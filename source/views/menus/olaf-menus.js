// @flow
import React from 'react'
import {TabBarIcon} from '../components/tabbar-icon'
import {Platform, FlatList, StyleSheet} from 'react-native'
import type {TopLevelViewPropsType} from '../types'
import {Row} from '../components/layout'
import {ListRow, ListSeparator, Title, ListEmpty} from '../components/list'
import {BonAppHostedMenu} from './menu-bonapp'
import {GitHubHostedMenu} from './menu-github'

export const OlafStavMenuScreen = ({navigation}: TopLevelViewPropsType) => (
	<BonAppHostedMenu
		cafeId="261"
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
OlafStavMenuScreen.navigationOptions = {
	title: 'Stav Hall',
	tabBarIcon: TabBarIcon('menu'),
}

export const OlafCageMenuScreen = ({navigation}: TopLevelViewPropsType) => (
	<BonAppHostedMenu
		cafeId="262"
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
OlafCageMenuScreen.navigationOptions = {
	title: 'The Cage',
	tabBarIcon: TabBarIcon('menu'),
}

export const OlafPauseMenuScreen = ({navigation}: TopLevelViewPropsType) => (
	<GitHubHostedMenu
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
OlafPauseMenuScreen.navigationOptions = {
	tabBarLabel: 'The Pause',
	tabBarIcon: TabBarIcon('menu'),
}

type OleCafeShape = {id: string, title: string}
const olafCafes = [
	{id: 'OlafStavMenuView', title: 'Stav Hall'},
	{id: 'OlafCageMenuView', title: 'The Cage'},
	{id: 'OlafPauseMenuView', title: 'The Pause'},
]

type Props = TopLevelViewPropsType & {}

export class OlafCafeIndex extends React.Component<Props> {
	renderItem = ({item}: {item: OleCafeShape}) => (
		<OleCafeRow
			id={item.id}
			onPress={this.props.navigation.navigate}
			title={item.title}
		/>
	)

	keyExtractor = (item: OleCafeShape) => item.id

	render() {
		return (
			<FlatList
				ItemSeparatorComponent={ListSeparator}
				ListEmptyComponent={<ListEmpty mode="bug" />}
				data={olafCafes}
				keyExtractor={this.keyExtractor}
				renderItem={this.renderItem}
				style={styles.container}
			/>
		)
	}
}

type RowProps = {
	id: string,
	title: string,
	onPress: string => any,
}

class OleCafeRow extends React.PureComponent<RowProps> {
	onPress = () => this.props.onPress(this.props.id)

	render() {
		return (
			<ListRow arrowPosition="center" onPress={this.onPress}>
				<Row alignItems="center">
					<Title style={styles.rowText}>{this.props.title}</Title>
				</Row>
			</ListRow>
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
