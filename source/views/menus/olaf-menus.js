// @flow
import * as React from 'react'
import {TabBarIcon} from '@frogpond/navigation-tabs'
import {View, Platform, ScrollView, StyleSheet} from 'react-native'
import type {TopLevelViewPropsType} from '../types'
import {Row} from '@frogpond/layout'
import {ListRow, ListSeparator, Title} from '@frogpond/lists'
import {BonAppHostedMenu} from './menu-bonapp'
import {GitHubHostedMenu} from './menu-github'

export const OlafStavMenuView = ({navigation}: TopLevelViewPropsType) => (
	<BonAppHostedMenu
		cafe="stav-hall"
		loadingMessage={[
			'Hunting Ferndale Turkey…',
			'Tracking wild vegan burgers…',
			'"Cooking" some lutefisk…',
			'Finding more mugs…',
			'Waiting for omlets…',
			'Putting out more cookies…',
		]}
		name="stav"
		navigation={navigation}
	/>
)
OlafStavMenuView.navigationOptions = {
	title: 'Stav Hall',
	tabBarIcon: TabBarIcon('menu'),
}

export const OlafCageMenuView = ({navigation}: TopLevelViewPropsType) => (
	<BonAppHostedMenu
		cafe="the-cage"
		ignoreProvidedMenus={true}
		loadingMessage={[
			'Checking for vegan cookies…',
			'Serving up some shakes…',
			'Waiting for menu screens to change…',
			'Frying chicken…',
			'Brewing coffee…',
		]}
		name="cage"
		navigation={navigation}
	/>
)
OlafCageMenuView.navigationOptions = {
	title: 'The Cage',
	tabBarIcon: TabBarIcon('menu'),
}

export const OlafPauseMenuView = ({navigation}: TopLevelViewPropsType) => (
	<GitHubHostedMenu
		cafe="the-pause"
		loadingMessage={[
			'Mixing up a shake…',
			'Spinning up pizzas…',
			'Turning up the music…',
			'Putting ice cream on the cookies…',
			'Fixing the oven…',
		]}
		name="pause"
		navigation={navigation}
	/>
)
OlafPauseMenuView.navigationOptions = {
	tabBarLabel: 'The Pause',
	tabBarIcon: TabBarIcon('menu'),
}

export class OlafCafeIndex extends React.Component<TopLevelViewPropsType> {
	render() {
		let cafes = [
			{id: 'OlafStavMenuView', title: 'Stav Hall'},
			{id: 'OlafCageMenuView', title: 'The Cage'},
			{id: 'OlafPauseMenuView', title: 'The Pause'},
		]

		return (
			<ScrollView style={styles.container}>
				{cafes.map((loc: {id: string, title: string}, i, collection) => (
					<View key={i}>
						<ListRow
							arrowPosition="center"
							onPress={() => this.props.navigation.navigate(loc.id)}
						>
							<Row alignItems="center">
								<Title style={styles.rowText}>{loc.title}</Title>
							</Row>
						</ListRow>
						{i < collection.length - 1 ? (
							<ListSeparator spacing={{left: 15}} />
						) : null}
					</View>
				))}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	rowText: {
		paddingVertical: 6,
	},
	container: {
		paddingTop: Platform.OS === 'ios' ? 20 : 0,
	},
})
