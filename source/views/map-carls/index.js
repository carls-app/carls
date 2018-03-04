// @flow

import * as React from 'react'
import {StyleSheet} from 'react-native'
import Map, {Marker, Polygon, UrlTile} from 'react-native-maps'

const url = 'https://carls-app.github.io/map-data/map.json'

type Props = {}

type State = {
	region: Object,
	markers: Array<any>,
	outlines: Array<any>,
}

export class MapView extends React.Component<Props, State> {
	static navigationOptions = {
		title: 'Campus Map',
		headerBackTitle: 'Map',
	}

	state = {
		region: {
			latitude: 44.460871,
			longitude: -93.153602,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01,
		},
		markers: [],
		outlines: [],
	}

	componentDidMount() {
		this.fetchData()
	}

	fetchData = async () => {
		const data = await fetchJson(url)

		const markers = data.filter(s => s.center).map(s => {
			return {
				coordinate: {latitude: s.center[0], longitude: s.center[1]},
				title: s.name,
				description: s.address,
				key: s.id,
			}
		})

		const outlines = data.filter(s => s.outline).map(s => {
			return {
				coordinates: s.outline.map(([latitude, longitude]) => ({
					latitude,
					longitude,
				})),
				key: s.id,
			}
		})

		this.setState(() => ({markers, outlines}))
	}

	onRegionChange = (region: any) => {
		this.setState(() => ({region}))
	}

	render() {
		return (
			<Map
				onRegionChange={this.onRegionChange}
				region={this.state.region}
				showsPointsOfInterest={false}
				showsUserLocation={true}
				style={styles.map}
			>
				{this.state.markers.map(marker => (
					<Marker
						key={marker.key}
						coordinate={marker.coordinate}
						description={marker.description}
						title={marker.title}
					/>
				))}
				<UrlTile
					maximumZ={19}
					//urlTemplate="https://www.carleton.edu/global_stock/images/campus_map/tiles/base/{z}_{x}_{y}.png"
					urlTemplate="https://carls-app.github.io/map-data/tiles/{z}/{x}_{y}.png"
				/>
				{this.state.outlines.map(marker => (
					<Polygon
						key={marker.key}
						coordinates={marker.coordinates}
						fillColor="rgb(161,31,3)"
						strokeColor="rgb(161,31,3)"
					/>
				))}
			</Map>
		)
	}
}

const styles = StyleSheet.create({
	map: StyleSheet.absoluteFillObject,
})
