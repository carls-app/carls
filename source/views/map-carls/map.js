// @flow

import * as React from 'react'
import {View, StyleSheet} from 'react-native'
import Map, {Marker, Polygon, UrlTile} from 'react-native-maps'
import * as c from '../components/colors'
import type {TopLevelViewPropsType} from '../types'
import type {Building} from './types'
import {MAP_DATA_URL, GITHUB_TILE_TEMPLATE} from './urls'
import {BuildingPicker} from './picker'
import {BuildingInfo} from './info'

type Props = TopLevelViewPropsType

type State = {|
	buildings: Array<Building>,
	visibleMarkers: Array<string>,
	highlighted: Array<string>,
	selectedBuilding: ?Building,
|}

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

	state = {
		buildings: [],
		highlighted: [],
		visibleMarkers: [],
		selectedBuilding: null,
	}

	componentDidMount() {
		this.fetchData()
	}

	_mapRef: ?Map = null

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

	buildingToOutline = (b: Building, highlighted: boolean) => {
		const coords = b.outline.map(([latitude, longitude]) => ({
			latitude,
			longitude,
		}))

		return (
			<Polygon
				key={b.id}
				coordinates={coords}
				fillColor={highlighted ? c.brickRed : c.black75Percent}
				onPress={() => this.onTouchOutline(b.id)}
				strokeColor={highlighted ? c.maroon : c.black50Percent}
				strokeWidth={StyleSheet.hairlineWidth}
			/>
		)
	}

	onTouchOutline = (id: string) => {
		this.highlightBuildingById(id)
	}

	buildingToUnhightlightedOutline = (b: Building) =>
		this.buildingToOutline(b, false)
	buildingToHighlightedOutline = (b: Building) =>
		this.buildingToOutline(b, true)

	highlightBuildingById = (id: string) => {
		const match = this.state.buildings.find(b => b.id === id)

		if (!match || !match.center) {
			return
		}

		const newRegion = {
			latitude: match.center[0],
			longitude: match.center[1],
			latitudeDelta: 0.002252,
			longitudeDelta: 0.001962,
		}

		this.setState(
			() => ({
				visibleMarkers: [id],
				highlighted: [id],
				selectedBuilding: match,
			}),
			() => {
				if (!this._mapRef) {
					return
				}
				this._mapRef.animateToRegion(newRegion)
			},
		)
	}

	onPickerSelect = (id: string) => {
		this.highlightBuildingById(id)
	}

	onInfoOverlayClose = () => {
		this.setState(() => ({
			selectedBuilding: null,
			visibleMarkers: [],
			highlighted: [],
		}))
	}

	render() {
		return (
			<View style={StyleSheet.absoluteFill}>
				<Map
					ref={ref => (this._mapRef = ref)}
					initialRegion={originalCenterpoint}
					showsPointsOfInterest={false}
					showsUserLocation={true}
					style={styles.map}
				>
					<UrlTile maximumZ={19} urlTemplate={GITHUB_TILE_TEMPLATE} />

					{this.state.buildings
						.filter(b => this.state.visibleMarkers.includes(b.id))
						.map(this.buildingToMarker)}

					{this.state.buildings
						.filter(b => !this.state.highlighted.includes(b.id))
						.map(this.buildingToUnhightlightedOutline)}

					{this.state.buildings
						.filter(b => this.state.highlighted.includes(b.id))
						.map(this.buildingToHighlightedOutline)}
				</Map>

				{this.state.selectedBuilding ? (
					<BuildingInfo
						building={this.state.selectedBuilding}
						onClose={this.onInfoOverlayClose}
					/>
				) : (
					<BuildingPicker
						buildings={this.state.buildings}
						onSelect={this.onPickerSelect}
					/>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	map: {
		flex: 1,
	},
})
