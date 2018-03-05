// @flow

import * as React from 'react'
import {View, StyleSheet} from 'react-native'
import {SafeAreaView} from 'react-native'
import Map, {Marker, Polygon, UrlTile} from 'react-native-maps'
import * as c from '../components/colors'
import type {TopLevelViewPropsType} from '../types'
import type {Building} from './types'
import {MAP_DATA_URL, GITHUB_TILE_TEMPLATE} from './urls'
import {BuildingPicker} from './picker'
import {BuildingInfo} from './info'
import {Overlay} from './overlay'
// import {SafeAreaView} from 'react-navigation'

type Props = TopLevelViewPropsType

type State = {|
	buildings: Array<Building>,
	visibleMarkers: Array<string>,
	highlighted: Array<string>,
	selectedBuilding: ?Building,
	overlaySize: 'min' | 'mid' | 'max',
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
		overlaySize: 'mid',
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

	buildingToUnhightlightedOutline = (b: Building) =>
		this.buildingToOutline(b, false)
	buildingToHighlightedOutline = (b: Building) =>
		this.buildingToOutline(b, true)

	onTouchOutline = (id: string) => {
		this.highlightBuildingById(id)
		this.setOverlayMid()
	}

	highlightBuildingById = (id: string) => {
		const match = this.state.buildings.find(b => b.id === id)

		if (!match || !match.center) {
			return
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
				if (!match || !match.center) {
					return
				}
				const latitude =
					this.state.overlaySize === 'min'
						? // case 1: overlay is collapsed; center in viewport
							match.center[0]
						: // case 2: overlay is open; center above overlay
							match.center[0] - 0.002252 / 4
				const newRegion = {
					latitude: latitude,
					longitude: match.center[1],
					latitudeDelta: 0.002252,
					longitudeDelta: 0.001962,
				}
				this._mapRef.animateToRegion(newRegion)
			},
		)
	}

	onPickerSelect = (id: string) => {
		this.highlightBuildingById(id)
		this.setOverlayMid()
	}
	onPickerFocus = () => this.setOverlayMax()
	onPickerCancel = () => this.setOverlayMid()

	onInfoOverlayClose = () => {
		this.setState(() => ({
			selectedBuilding: null,
			visibleMarkers: [],
			highlighted: [],
		}))
		this.setOverlayMin()
	}

	setOverlayMax = () => this.setState(() => ({overlaySize: 'max'}))
	setOverlayMid = () => this.setState(() => ({overlaySize: 'mid'}))
	setOverlayMin = () => this.setState(() => ({overlaySize: 'min'}))

	onOverlaySizeChange = (size: 'min' | 'mid' | 'max') =>
		this.setState(() => ({overlaySize: size}))

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

				<Overlay
					onSizeChange={this.onOverlaySizeChange}
					size={this.state.overlaySize}
				>
					{this.state.selectedBuilding ? (
						<BuildingInfo
							building={this.state.selectedBuilding}
							onClose={this.onInfoOverlayClose}
						/>
					) : (
						<BuildingPicker
							buildings={this.state.buildings}
							onCancel={this.onPickerCancel}
							onFocus={this.onPickerFocus}
							onSelect={this.onPickerSelect}
							overlaySize={this.state.overlaySize}
						/>
					)}
				</Overlay>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	map: {
		...StyleSheet.absoluteFillObject,
	},
})
