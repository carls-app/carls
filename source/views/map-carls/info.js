// @flow

import * as React from 'react'
import {View, Text, StyleSheet,ScrollView,  TouchableHighlight, Image} from 'react-native'
import glamorous from 'glamorous-native'
import * as c from '../components/colors'
import type {Building} from './types'
import {GrabberBar} from './grabber'
import startCase from 'lodash/startCase'
import {Row, Column} from '../components/layout'
import {ListRow, Title} from '../components/list'
import openUrl from '../components/open-url'

type Props = {
	viewState: 'min' | 'mid' | 'max',
	building: Building,
	onClose: () => any,
	expandMin: () => any,
	expandMid: () => any,
	expandMax: () => any,
}

export class BuildingInfo extends React.Component<Props> {
	render() {
		const {viewState, building} = this.props

		const blacklist = ['hall', 'house', 'building']
		const category = Object.keys(building.categories)
			.filter(name => !blacklist.includes(name))
			.map(name => startCase(name))
			.join(' • ')

		if (viewState === 'min') {
			return (
				<View style={[styles.overlay, styles.overlayMin]}>
					<GrabberBar onPress={this.props.expandMid} />
					<Row>
						<Column>
							<PlaceTitle>{building.name}</PlaceTitle>
							<PlaceSubtitle>{category}</PlaceSubtitle>
						</Column>
						<CloseButton onPress={this.props.onClose} />
					</Row>
				</View>
			)
		} else if (viewState === 'mid' || viewState === 'max') {
			const style = [
				styles.overlay,
				viewState === 'mid' && styles.overlayMid,
				viewState === 'max' && styles.overlayMax,
			]

			const photo = building.photo
				? `https://carls-app.github.io/map-data/cache/img/${building.photo}`
				: null

			return (
				<View style={style}>
					<GrabberBar onPress={this.props.expandMax} />
					<Row
						alignItems="center"
						justifyContent="space-between"
						marginBottom={12}
					>
						<Column>
							<PlaceTitle>{building.name}</PlaceTitle>
							<PlaceSubtitle>{category}</PlaceSubtitle>
						</Column>
						<CloseButton onPress={this.props.onClose} />
					</Row>

					{building.photo ? (
						<Section paddingTop={0}>
							<ScrollView horizontal={true}>
								<Image source={{uri: photo}} style={styles.photo} />
							</ScrollView>
						</Section>
					) : null}

					{building.address ? (
						<Section>
							<SectionTitle>Address</SectionTitle>
							<SectionContent>{building.address}</SectionContent>
						</Section>
					) : null}

					{building.departments.length ? (
						<Section>
							<SectionListTitle>Departments</SectionListTitle>
							<View>
								{building.departments.map(d => (
									<SectionListItem
										key={d.label}
										href={d.href}
										label={d.label}
									/>
								))}
							</View>
						</Section>
					) : null}

					{building.offices.length ? (
						<Section>
							<SectionListTitle>Offices</SectionListTitle>
							<View>
								{building.offices.map(d => (
									<SectionListItem
										key={d.label}
										href={d.href}
										label={d.label}
									/>
								))}
							</View>
						</Section>
					) : null}
				</View>
			)
		}
	}
}

const PlaceTitle = glamorous.text({fontSize: 22, fontWeight: '600'})
const PlaceSubtitle = glamorous.text({fontSize: 18})

const Section = glamorous.view({
	paddingVertical: 12,
	borderBottomWidth: StyleSheet.hairlineWidth,
	borderBottomColor: c.black75Percent,
})
const SectionTitle = glamorous.text({fontWeight: '700'})
const SectionContent = glamorous.text()

const SectionListTitle = glamorous(SectionTitle)({
	paddingBottom: 8,
})

const SectionListItem = ({href, label}) => {
	return (
		<ListRow contentContainerStyle={styles.listItem} onPress={() => openUrl(href)}>
			<Title style={styles.listItemText}>{label}</Title>
		</ListRow>
	)
}

const CloseButton = ({onPress}) => (
	<TouchableHighlight
		onPress={onPress}
		style={styles.closeButton}
		underlayColor={c.black50Percent}
	>
		<Text style={styles.closeButtonText}>×</Text>
	</TouchableHighlight>
)

const styles = StyleSheet.create({
	overlay: {
		backgroundColor: c.white,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		bottom: 0,
		left: 0,
		paddingTop: 0,
		position: 'absolute',
		right: 0,
		shadowColor: c.black,
		shadowOffset: {height: -4},
		shadowOpacity: 0.15,
		shadowRadius: 4,
		zIndex: 2,

		paddingHorizontal: 12,
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
	closeButton: {
		width: 24,
		height: 24,
		borderRadius: 24,
		backgroundColor: c.semitransparentGray,
		alignItems: 'center',
		justifyContent: 'center',
	},
	closeButtonText: {
		color: c.white,
		fontWeight: '600',
		textAlign: 'center',
		marginTop: -2,
	},
	photo: {
		width: 265,
		height: 200,
	},
	listItem: {
		paddingLeft: 0,
	},
	listItemText: {
		fontSize: 15,
	},
})
