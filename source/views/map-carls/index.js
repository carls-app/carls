// @flow

import * as React from 'react'
import {StyleSheet, FlatList} from 'react-native'
import {View, Text} from 'glamorous-native'
import Map, {Marker, Polygon, UrlTile} from 'react-native-maps'
import * as c from '../components/colors'
import {Button} from '../components/button'
import type {TopLevelViewPropsType} from '../types'
import {SearchBar} from '../components/searchbar'
import {ListSeparator, Title, Detail, ListRow} from '../components/list'
import {Row, Column} from '../components/layout'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'

const MAP_DATA_URL = 'https://carls-app.github.io/map-data/map.json'
const CARLETON_TILE_TEMPLATE =
	'https://www.carleton.edu/global_stock/images/campus_map/tiles/base/{z}_{x}_{y}.png'
const GITHUB_TILE_TEMPLATE =
	'https://carls-app.github.io/map-data/tiles/{z}/{x}_{y}.png'

type Props = TopLevelViewPropsType

type State = {|
	region: Region,
	buildings: Array<Building>,
	visibleMarkers: Array<string>,
	highlighted: Array<string>,
	buildingPickerState: 'min' | 'mid' | 'max',
|}

type Region = {
	latitude: number,
	longitude: number,
	latitudeDelta: number,
	longitudeDelta: number,
}

type LatLon = {
	latitude: number,
	longitude: number,
}

type MarkerT = {
	coordinate: LatLon,
	title: string,
	description: string,
	key: string,
}

type OutlineT = {
	coordinates: Array<LatLon>,
	key: string,
}

type Building = {
	accessibility: 'none' | 'wheelchair' | 'unknown',
	address: ?string,
	categories: {
		administrative?: true,
		academic?: true,
		outdoors?: true,
		building?: true,
		'employee-housing'?: true,
		'student-housing'?: true,
		hall?: true,
		parking?: true,
		house?: true,
	},
	center: ?[number, number],
	departments: Array<{href: string, label: string}>,
	description: ?string,
	floors: Array<{href: string, label: string}>,
	id: string,
	name: string,
	offices: Array<{href: string, label: string}>,
	outline: Array<[number, number]>,
	photo: ?string,
}

const originalCenterpoint = {
	latitude: 44.460800862266,
	longitude: -93.15488752015,
	latitudeDelta: 0.004617,
	longitudeDelta: 0.004023,
}

export class MapView extends React.Component<Props, State> {
	static navigationOptions = {
		title: 'Campus Map',
		headerBackTitle: 'Map',
	}

	_mapRef: ?Map = null

	state = {
		region: originalCenterpoint,
		buildings: [],
		highlighted: [],
		visibleMarkers: [],
		buildingPickerState: 'min',
	}

	componentDidMount() {
		this.fetchData()
	}

	fetchData = async () => {
		const data: Array<Building> = await fetchJson(MAP_DATA_URL)

		this.setState(() => ({
			buildings: data,
			highlighted: [],
			visibleMarkers: [],
		}))
	}

	buildingToMarker = (b: Building) => {
		if (!b.center) {
			return
		}

		const coord = {latitude: b.center[0], longitude: b.center[1]}
		return (
			<Marker
				key={b.id}
				coordinate={coord}
				description={b.address || ''}
				title={b.name}
			/>
		)
	}

	buildingToOutline = (b: Building) => {
		const coords = b.outline.map(([latitude, longitude]) => ({
			latitude,
			longitude,
		}))
		return (
			<Polygon
				key={b.id}
				coordinates={coords}
				fillColor={c.black75Percent}
				strokeColor={c.black50Percent}
			/>
		)
	}

	buildingToHighlightedOutline = (b: Building) => {
		const coords = b.outline.map(([latitude, longitude]) => ({
			latitude,
			longitude,
		}))

		return (
			<Polygon
				key={b.id}
				coordinates={coords}
				fillColor={c.brickRed}
				strokeColor={c.brickRed}
			/>
		)
	}

	onPickerFocus = () => {
		this.setState(() => ({buildingPickerState: 'max'}))
	}

	onPickerSearchCancel = () => {
		this.setState(() => ({buildingPickerState: 'mid'}))
	}

	onPickerSelect = (id: string) => {
		if (!this._mapRef) {
			return
		}

		const match = this.state.buildings.find(b => b.id === id)

		if (!match) {
			return
		}

		if (!match.center) {
			return
		}

		const newCenter = {latitude: match.center[0], longitude: match.center[1]}

		const zoom = {
			latitudeDelta: 0.002252,
			longitudeDelta: 0.001962,
		}

		if (!this._mapRef) {
			return
		}

		this._mapRef.animateToRegion({...newCenter, ...zoom}, 750)

		this.setState(state => {
			return {
				buildingPickerState: 'min',
				visibleMarkers: [id],
				highlighted: [id],
			}
		})
	}

	onRegionChange = (region: Region) => {
		this.setState(() => ({region}))
	}

	render() {
		return (
			<View {...StyleSheet.absoluteFillObject}>
				<Map
					initialRegion={originalCenterpoint}
					showsPointsOfInterest={false}
					showsUserLocation={true}
					style={styles.map}
					ref={ref => this._mapRef = ref}
				>
					<UrlTile maximumZ={19} urlTemplate={GITHUB_TILE_TEMPLATE} />

					{this.state.buildings
						.filter(b => this.state.visibleMarkers.includes(b.id))
						.map(this.buildingToMarker)}

					{this.state.buildings
						.filter(b => !this.state.highlighted.includes(b.id))
						.map(this.buildingToOutline)}

					{this.state.buildings
						.filter(b => this.state.highlighted.includes(b.id))
						.map(this.buildingToHighlightedOutline)}
				</Map>

				<BuildingPicker
					viewState={this.state.buildingPickerState}
					buildings={this.state.buildings}
					onFocus={this.onPickerFocus}
					onCancel={this.onPickerSearchCancel}
					onSelect={this.onPickerSelect}
				/>

				<View style={styles.infoOverlay}>
					<Text>latitude: {this.state.region.latitude}</Text>
					<Text>longitude: {this.state.region.longitude}</Text>
					<Text>
						latitudeDelta: {this.state.region.latitudeDelta}
					</Text>
					<Text>
						longitudeDelta: {this.state.region.longitudeDelta}
					</Text>
				</View>
			</View>
		)
	}
}

type BuildingPickerProps = {
	viewState: 'min' | 'mid' | 'max',
	buildings: Array<Building>,
	onFocus: () => any,
	onCancel: () => any,
	onSelect: string => any,
}

type BuildingPickerState = {
	query: string,
}

class BuildingPicker extends React.Component<
	BuildingPickerProps,
	BuildingPickerState,
> {
	searchBar: any = null

	state = {
		query: '',
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.props.viewState === 'max' &&
			this.props.viewState !== nextProps.viewState
		) {
			this.dismissKeyboard()
		}
	}

	dismissKeyboard = () => {
		this.searchBar.unFocus()
	}

	onSearch = (text: ?string) => {
		let query = text || ''
		query = query.toLowerCase()
		this.setState(() => ({query}))
	}

	performSearch = (text: string) => {
		// Android clear button returns an object
		if (typeof text !== 'string') {
			return this.onSearch(null)
		}

		return this.onSearch(text)
	}

	onSelectBuilding = (id: string) => this.props.onSelect(id)

	render() {
		const {viewState} = this.props

		const search = (
			<SearchBar
				getRef={ref => (this.searchBar = ref)}
				onSearchButtonPress={() => this.searchBar.unFocus()}
				onChangeText={this.performSearch}
				onSearchButtonPress={() => {}}
				onFocus={this.props.onFocus}
				onCancel={this.props.onCancel}
				textFieldBackgroundColor={c.iosGray}
				placeholder="Search for a place"
				style={styles.searchBox}
			/>
		)

		let matches = this.state.query
			? this.props.buildings.filter(b =>
					b.name.toLowerCase().startsWith(this.state.query),
				)
			: this.props.buildings

		matches = sortBy(matches, m => m.name)

		if (viewState === 'min') {
			return (
				<View style={[styles.overlay, styles.overlayMin]}>
					<GrabberBar />
					{search}
				</View>
			)
		} else if (viewState === 'mid') {
			return (
				<View style={[styles.overlay, styles.overlayMid]}>
					<GrabberBar />
					{search}
					<BuildingResults
						buildings={matches}
						onSelect={this.onSelectBuilding}
					/>
				</View>
			)
		} else if (viewState === 'max') {
			return (
				<View style={[styles.overlay, styles.overlayMax]}>
					<GrabberBar />
					{search}
					<BuildingResults
						buildings={matches}
						onSelect={this.onSelectBuilding}
					/>
				</View>
			)
		}
	}
}

const GrabberBar = () => <View style={styles.grabber} />

class BuildingResults extends React.Component<{
	buildings: Array<Building>,
	onSelect: string => any,
}> {
	keyExtractor = (item: Building) => item.id

	onPress = (id: string) => this.props.onSelect(id)

	renderItem = ({item}: {item: Building}) => {
		const detail = item.address || (item.center || []).join(',') || ''
		return (
			<ListRow spacing={{left: 12}} onPress={() => this.onPress(item.id)}>
				<Row>
					<View
						width={24}
						height={24}
						borderRadius={24}
						backgroundColor={c.success}
						alignSelf="center"
						marginRight={8}
					/>
					<Column>
						<Title>{item.name}</Title>
						<Detail>{detail}</Detail>
					</Column>
				</Row>
			</ListRow>
		)
	}

	separator = () => <ListSeparator spacing={{left: 12}} />

	render() {
		return (
			<FlatList
				data={this.props.buildings}
				keyExtractor={this.keyExtractor}
				ItemSeparatorComponent={this.separator}
				renderItem={this.renderItem}
				keyboardDismissMode="on-drag"
			/>
		)
	}
}

const styles = StyleSheet.create({
	map: {
		flex: 1,
	},
	searchBox: {
		marginHorizontal: 6,
	},
	grabber: {
		backgroundColor: c.iosGray,
		borderRadius: 4,
		height: 4,
		width: 30,
		alignSelf: 'center',
		marginBottom: 1,
		marginTop: 6,
	},
	infoOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 1,
	},
	overlay: {
		backgroundColor: c.white,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		bottom: 0,
		left: 0,
		paddingHorizontal: 0,
		paddingTop: 0,
		position: 'absolute',
		right: 0,
		shadowColor: c.black,
		shadowOffset: {height: -4},
		shadowOpacity: 0.15,
		shadowRadius: 4,
		zIndex: 2,
	},
	overlayMin: {
		height: 80,
	},
	overlayMid: {
		height: 200,
	},
	overlayMax: {
		top: 20,
	},
})
