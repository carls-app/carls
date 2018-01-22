// @flow

import * as React from 'react'
import {StackNavigator} from 'react-navigation'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'
import type {TopLevelViewPropsType} from '../types'
import {BonAppHostedMenu} from './menu-bonapp'
import {
	OlafCafeIndex,
	OlafStavMenuScreen,
	OlafCageMenuScreen,
	OlafPauseMenuScreen,
} from './olaf-menus'
// import {BonAppPickerView} from './dev-bonapp-picker'

const OlafMenuPicker = StackNavigator(
	{
		OlafCafeIndex: {screen: OlafCafeIndex},
		OlafStavMenuView: {screen: OlafStavMenuScreen},
		OlafCageMenuView: {screen: OlafCageMenuScreen},
		OlafPauseMenuView: {screen: OlafPauseMenuScreen},
	},
	{
		headerMode: 'none',
	},
)

export const MenusView = TabNavigator(
	{
		BurtonMenuScreen: {
			screen: ({navigation}: TopLevelViewPropsType) => (
				<BonAppHostedMenu
					navigation={navigation}
					name="burton"
					cafeId="35"
					loadingMessage={['Searching for Schiller…']}
				/>
			),
			navigationOptions: {
				title: 'Burton',
				tabBarIcon: TabBarIcon('ice-cream'),
			},
		},

		LDCMenuScreen: {
			screen: ({navigation}: TopLevelViewPropsType) => (
				<BonAppHostedMenu
					navigation={navigation}
					name="ldc"
					cafeId="36"
					loadingMessage={['Tracking down empty seats…']}
				/>
			),
			navigationOptions: {
				title: 'LDC',
				tabBarIcon: TabBarIcon('nutrition'),
			},
		},

		SaylesMenuScreen: {
			screen: ({navigation}: TopLevelViewPropsType) => (
				<BonAppHostedMenu
					navigation={navigation}
					name="sayles"
					cafeId="34"
					loadingMessage={[
						'Engaging in people-watching…',
						'Checking the mail…',
					]}
				/>
			),
			navigationOptions: {
				title: 'Sayles Hill',
				tabBarIcon: TabBarIcon('cafe'),
			},
		},

		WeitzMenuScreen: {
			screen: ({navigation}: TopLevelViewPropsType) => (
				<BonAppHostedMenu
					navigation={navigation}
					name="weitz"
					cafeId="458"
					loadingMessage={[
						'Observing the artwork…',
						'Previewing performances…',
					]}
				/>
			),
			navigationOptions: {
				title: 'Weitz Center',
				tabBarIcon: TabBarIcon('wine'),
			},
		},

		OlafMenuListView: {
			screen: OlafMenuPicker,
			navigationOptions: {
				title: 'St. Olaf',
				tabBarIcon: TabBarIcon('menu'),
			},
		},

		// BonAppDevToolView: {screen: BonAppPickerView},
	},
	{
		navigationOptions: {
			title: 'Menus',
		},
	},
)
