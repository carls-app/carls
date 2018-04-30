// @flow

import * as React from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableHighlight,
	Image,
	Clipboard,
	Dimensions,
} from 'react-native'
import glamorous from 'glamorous-native'
import * as c from '../components/colors'
import type {Building} from './types'
import startCase from 'lodash/startCase'
import {Row, Column} from '../components/layout'
import {ListRow, Title} from '../components/list'
import openUrl from '../components/open-url'
import {Touchable} from '../components/touchable'

type Props = {
	building: Building,
	onClose: () => any,
	overlaySize: 'min' | 'mid' | 'max',
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
			<React.Fragment>
				<Row
					alignItems="center"
					justifyContent="space-between"
					marginBottom={12}
					style={styles.container}
				>
					<Column>
						<PlaceTitle>{building.name}</PlaceTitle>
						<PlaceSubtitle>{category}</PlaceSubtitle>
					</Column>
					<CloseButton onPress={this.onClose} />
				</Row>

				<ScrollView
					contentContainerStyle={styles.container}
					contentInsetAdjustmentBehavior="automatic"
					scrollEnabled={this.props.overlaySize === 'max'}
					style={styles.scroll}
				>
					{building.photo ? (
						<Section paddingTop={0}>
							<ScrollView horizontal={true}>
								<Image source={{uri: photo}} style={styles.photo} />
							</ScrollView>
						</Section>
					) : null}

					{building.address ? (
						<Section>
							<Row alignItems="center">
								<Column flex={1}>
									<SectionTitle>Address</SectionTitle>
									<SectionContent>{building.address}</SectionContent>
								</Column>
								<CopyText
									render={({copied, copy}) => (
										<OutlineButton
											disabled={copied}
											onPress={() => building.address && copy(building.address)}
											title={copied ? 'Copied' : 'Copy'}
										/>
									)}
								/>
							</Row>
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
				</ScrollView>
			</React.Fragment>
		)
	}
}

const PlaceTitle = glamorous.text({fontSize: 20, fontWeight: '700'})
const PlaceSubtitle = glamorous.text({fontSize: 16})

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

const OutlineButton = (props: {
	title: string,
	onPress: () => any,
	disabled: boolean,
}) => (
	<Touchable
		accessibilityTraits="button"
		disabled={props.disabled}
		onPress={props.onPress}
		style={[
			styles.outlineButton,
			props.disabled && styles.outlineButtonDisabled,
		]}
	>
		<Text
			style={[
				styles.outlineButtonText,
				props.disabled && styles.outlineButtonTextDisabled,
			]}
		>
			{props.title}
		</Text>
	</Touchable>
)

class CopyText extends React.Component<
	{render: ({copied: boolean, copy: string => any}) => React.Node},
	{copied: boolean},
> {
	state = {
		copied: false,
	}

	onCopy = (text: string) => {
		Clipboard.setString(text)
		this.setState(() => ({copied: true}))
	}

	render() {
		return this.props.render({copied: this.state.copied, copy: this.onCopy})
	}
}

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
		accessibilityTraits="button"
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
	scroll: {
		height: Dimensions.get('window').height - 66 - 66,
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
	outlineButton: {
		borderWidth: 1,
		borderColor: c.infoBlue,
		paddingVertical: 4,
		paddingHorizontal: 6,
		borderRadius: 4,
		marginLeft: 4,
	},
	outlineButtonDisabled: {
		borderColor: c.iosDisabledText,
	},
	outlineButtonText: {
		fontWeight: 'bold',
		color: c.infoBlue,
	},
	outlineButtonTextDisabled: {
		color: c.iosDisabledText,
	},
})
