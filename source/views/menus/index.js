// @flow

import * as React from 'react'
import {TabNavigator, TabBarIcon} from '@frogpond/navigation-tabs'

import {BonAppHostedMenu} from './menu-bonapp'
import {OlafCafeIndex} from './olaf-menus'

export {OlafCafeIndex}
export {
	OlafStavMenuView,
	OlafCageMenuView,
	OlafPauseMenuView,
} from './olaf-menus'

export const MenusView = TabNavigator({
	BurtonMenuScreen: {
		screen: ({navigation}) => (
			<BonAppHostedMenu
				cafe="burton"
				loadingMessage={['Searching for Schiller…']}
				name="burton"
				navigation={navigation}
			/>
		),
		navigationOptions: {
			title: 'Burton',
			tabBarIcon: TabBarIcon('ice-cream'),
		},
	},

	LDCMenuScreen: {
		screen: ({navigation}) => (
			<BonAppHostedMenu
				cafe="ldc"
				loadingMessage={['Tracking down empty seats…']}
				name="ldc"
				navigation={navigation}
			/>
		),
		navigationOptions: {
			title: 'LDC',
			tabBarIcon: TabBarIcon('nutrition'),
		},
	},

	SaylesMenuScreen: {
		screen: ({navigation}) => (
			<BonAppHostedMenu
				cafe="sayles"
				loadingMessage={['Engaging in people-watching…', 'Checking the mail…']}
				name="sayles"
				navigation={navigation}
			/>
		),
		navigationOptions: {
			title: 'Sayles Hill',
			tabBarIcon: TabBarIcon('cafe'),
		},
	},

	WeitzMenuScreen: {
		screen: ({navigation}) => (
			<BonAppHostedMenu
				cafe="weitz"
				loadingMessage={['Observing the artwork…', 'Previewing performances…']}
				name="weitz"
				navigation={navigation}
			/>
		),
		navigationOptions: {
			title: 'Weitz Center',
			tabBarIcon: TabBarIcon('wine'),
		},
	},

	OlafMenuListView: {
		screen: OlafCafeIndex,
		navigationOptions: {
			title: 'St. Olaf',
			tabBarIcon: TabBarIcon('menu'),
		},
	},
})
MenusView.navigationOptions = {
	title: 'Menus',
}
