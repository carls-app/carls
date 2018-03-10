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
import {Overlay} from './overlay'
import Mapbox from '@mapbox/react-native-mapbox-gl'
import {MAPBOX_API_KEY} from '../../lib/config'
import nearestPoint from '@turf/nearest-point'

Mapbox.setAccessToken(MAPBOX_API_KEY)
const MAPBOX_CARLETON_STYLE =
	'mapbox://styles/hawkrives/cjelhf2kx5ezz2sp8jbgoj9gt'

type MapboxEvent = {
	geometry: {
		coordinates: [number, number],
		type: string,
	},
	properties: {
		screenPointY: number,
		screenPointX: number,
	},
	type: string,
}

type Props = TopLevelViewPropsType

type State = {|
	buildings: Array<Building>,
	featureCollection: any,
	visibleMarkers: Array<string>,
	highlighted: Array<string>,
	selectedBuilding: ?Building,
	overlaySize: 'min' | 'mid' | 'max',
|}

const originalCenterpoint = [-93.15488752015, 44.460800862266]

export class MapView extends React.Component<Props, State> {
	static navigationOptions = {
		title: 'Campus Map',
		headerBackTitle: 'Map',
	}

	state = {
		buildings: [],
		featureCollection: [],
		highlighted: [],
		visibleMarkers: [],
		selectedBuilding: null,
		overlaySize: 'mid',
	}

	componentDidMount() {
		this.fetchData()
	}

	_map: ?Map = null

	fetchData = async () => {
		const data: Array<Building> = await fetchJson(MAP_DATA_URL)

		const featureCollection = {
			type: 'FeatureCollection',
			features: data.filter(b => b.center).map(b => {
				const [lat, lng] = b.center
				return {
					type: 'Feature',
					id: b.id,
					geometry: {
						type: 'Point',
						coordinates: [lng, lat],
					},
				}
			}),
		}

		this.setState(() => ({
			buildings: data,
			featureCollection: featureCollection,
			highlighted: [],
			visibleMarkers: [],
		}))
	}

	buildingToMarker = (b: Building) => {
		if (!b.center) {
			return
		}

		const [lat, long] = b.center
		const coord = [long, lat]
		return (
			<Mapbox.PointAnnotation key={b.id} id={b.id} coordinate={coord}>
				<View style={styles.annotationContainer}>
					<View style={styles.annotationFill} />
				</View>
			</Mapbox.PointAnnotation>
		)
	}

	handlePress = (ev: MapboxEvent) => {
		const featurePoint = this.lookupBuildingByCoordinates(ev.geometry.coordinates)

		if (!featurePoint) {
			return
		}

		this.highlightBuildingById(featurePoint.id)
	}

	lookupBuildingByCoordinates = ([lng, lat]: [number, number]) => {
		const searchPoint = {
			type: 'Feature',
			geometry: {type: 'Point', coordinates: [lng, lat]},
		}

		return nearestPoint(searchPoint, this.state.featureCollection)
	}

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
				if (!this._map || !match || !match.center) {
					return
				}

				const latitude =
					this.state.overlaySize === 'min'
						? // case 1: overlay is collapsed; center in viewport
							match.center[0]
						: // case 2: overlay is open; center above overlay
							match.center[0] - 0.0005

				this._map.setCamera({
					centerCoordinate: [match.center[1], latitude],
					zoom: 17,
				})
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
				<Mapbox.MapView
					ref={ref => (this._map = ref)}
					styleURL={MAPBOX_CARLETON_STYLE}
					zoomLevel={15}
					showUserLocation={true}
					centerCoordinate={originalCenterpoint}
					style={styles.map}
					logoEnabled={false}
					onPress={this.handlePress}
				>
					{this.state.buildings
						.filter(b => this.state.visibleMarkers.includes(b.id))
						.map(this.buildingToMarker)}
				</Mapbox.MapView>

				<Overlay
					onSizeChange={this.onOverlaySizeChange}
					size={this.state.overlaySize}
				>
					{this.state.selectedBuilding ? (
						<BuildingInfo
							building={this.state.selectedBuilding}
							onClose={this.onInfoOverlayClose}
							overlaySize={this.state.overlaySize}
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
	annotationContainer: {
		width: 20,
		height: 20,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		shadowOffset: {width: 0, height: 1},
		shadowColor: 'rgb(0, 0, 0)',
		shadowOpacity: 0.2,
	},
	annotationFill: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: c.olevilleGold,
		transform: [{scale: 0.6}],
	},
})
