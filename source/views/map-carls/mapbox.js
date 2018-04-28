// @flow

import * as React from 'react'
import {View, StyleSheet} from 'react-native'
import * as c from '../components/colors'
import type {TopLevelViewPropsType} from '../types'
import type {Building} from './types'
import {MAP_DATA_URL, MAPBOX_CARLETON_STYLE} from './urls'
import {BuildingPicker} from './picker'
import {BuildingInfo} from './info'
import {Overlay} from './overlay'
import Mapbox from '@mapbox/react-native-mapbox-gl'
import {MAPBOX_API_KEY} from '../../lib/config'
import pointInPolygon from '@turf/boolean-point-in-polygon'

Mapbox.setAccessToken(MAPBOX_API_KEY)

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
	outlines: ?GeoJsonFeatureCollection,
	visibleMarkers: Array<string>,
	highlighted: Array<string>,
	selectedBuilding: ?Building,
	overlaySize: 'min' | 'mid' | 'max',
|}

const originalCenterpoint = [-93.15488752015, 44.460800862266]

type GeoJsonFeature = {
	type: 'Feature',
	id?: string,
	geometry: {
		type: 'Polygon',
		coordinates: Array<Array<[number, number]>>,
	},
}

type GeoJsonFeatureCollection = {
	type: 'FeatureCollection',
	features: Array<GeoJsonFeature>,
}

export class MapView extends React.Component<Props, State> {
	static navigationOptions = {
		title: 'Campus Map',
		headerBackTitle: 'Map',
	}

	state = {
		buildings: [],
		outlines: null,
		highlighted: [],
		visibleMarkers: [],
		selectedBuilding: null,
		overlaySize: 'mid',
	}

	componentDidMount() {
		this.fetchData()
	}

	_map: ?Mapbox.MapView = null

	fetchData = async () => {
		const data: Array<Building> = await fetchJson(MAP_DATA_URL)

		/*
		const centers = {
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
		*/

		const outlines = {
			type: 'FeatureCollection',
			features: data.filter(b => b.outline && b.outline.length).map(b => {
				const outline = b.outline.map(([lat, long]) => [long, lat])
				outline.push(outline[0])

				return {
					type: 'Feature',
					id: b.id,
					geometry: {
						type: 'Polygon',
						coordinates: [outline],
					},
				}
			}),
		}

		this.setState(() => ({
			buildings: data,
			outlines: outlines,
			// centers: centers,
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
			<Mapbox.PointAnnotation key={b.id} coordinate={coord} id={b.id}>
				<View style={styles.annotationContainer}>
					<View style={styles.annotationFill} />
				</View>
			</Mapbox.PointAnnotation>
		)
	}

	handlePress = (ev: MapboxEvent) => {
		const coords = ev.geometry.coordinates
		const featurePoint = this.lookupBuildingByCoordinates(coords)

		if (!featurePoint || !featurePoint.id) {
			return
		}

		this.highlightBuildingById(featurePoint.id)
	}

	lookupBuildingByCoordinates = ([lng, lat]: [number, number]) => {
		if (!this.state.outlines) {
			return
		}

		const searchPoint = {
			type: 'Feature',
			geometry: {type: 'Point', coordinates: [lng, lat]},
		}

		return this.state.outlines.features.find(feat =>
			pointInPolygon(searchPoint, feat),
		)
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
		this.setOverlayMid()
	}

	setOverlayMax = () => this.setState(() => ({overlaySize: 'max'}))
	setOverlayMid = () => this.setState(() => ({overlaySize: 'mid'}))
	setOverlayMin = () => this.setState(() => ({overlaySize: 'min'}))

	onOverlaySizeChange = (size: 'min' | 'mid' | 'max') => {
		this.setState(() => ({overlaySize: size}))
	}

	render() {
		return (
			<View style={StyleSheet.absoluteFill}>
				<Mapbox.MapView
					ref={ref => (this._map = ref)}
					centerCoordinate={originalCenterpoint}
					logoEnabled={false}
					onPress={this.handlePress}
					showUserLocation={true}
					style={styles.map}
					styleURL={MAPBOX_CARLETON_STYLE}
					zoomLevel={15}
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
		backgroundColor: c.white,
		shadowOffset: {width: 0, height: 1},
		shadowColor: c.black,
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
