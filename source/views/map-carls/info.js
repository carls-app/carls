// @flow

import * as React from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableHighlight,
	Image,
} from 'react-native'
import glamorous from 'glamorous-native'
import * as c from '../components/colors'
import type {Building} from './types'
import startCase from 'lodash/startCase'
import {Row, Column} from '../components/layout'
import {ListRow, Title} from '../components/list'
import openUrl from '../components/open-url'

type Props = {
	building: Building,
	onClose: () => any,
}

export class BuildingInfo extends React.Component<Props> {
	onClose = () => {
		this.props.onClose()
	}

	makeBuildingCategory = (building: Building) => {
		const blacklist = ['hall', 'house', 'building']
		return Object.keys(building.categories)
			.filter(name => !blacklist.includes(name))
			.map(name => startCase(name))
			.join(' • ')
	}

	render() {
		const {building} = this.props
		const category = this.makeBuildingCategory(building)
		const photo = building.photo
			? `https://carls-app.github.io/map-data/cache/img/${building.photo}`
			: null

		return (
			<View style={styles.container}>
				<Row
					alignItems="center"
					justifyContent="space-between"
					marginBottom={12}
				>
					<Column>
						<PlaceTitle>{building.name}</PlaceTitle>
						<PlaceSubtitle>{category}</PlaceSubtitle>
					</Column>
					<CloseButton onPress={this.onClose} />
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
								<SectionListItem key={d.label} href={d.href} label={d.label} />
							))}
						</View>
					</Section>
				) : null}

				{building.offices.length ? (
					<Section>
						<SectionListTitle>Offices</SectionListTitle>
						<View>
							{building.offices.map(d => (
								<SectionListItem key={d.label} href={d.href} label={d.label} />
							))}
						</View>
					</Section>
				) : null}
			</View>
		)
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
		<ListRow
			contentContainerStyle={styles.listItem}
			onPress={() => openUrl(href)}
		>
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
	container: {
		paddingHorizontal: 12,
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
