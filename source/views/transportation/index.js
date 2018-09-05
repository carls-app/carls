// @flow

import * as React from 'react'

import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'

import {OtherModesView} from './other-modes'
import {BusView} from './bus'

export {OtherModesDetailView} from './other-modes'
export {BusMap} from './bus'

export default TabNavigator(
	{
		ExpressLineBusView: {
			screen: ({navigation}) => (
				<BusView line="Express Bus" navigation={navigation} />
			),
			navigationOptions: {
				tabBarLabel: 'Express Bus',
				tabBarIcon: TabBarIcon('subway'),
			},
		},

		BlueLineBusView: {
			screen: ({navigation}) => (
				<BusView line="Blue Line" navigation={navigation} />
			),
			navigationOptions: {
				tabBarLabel: 'Blue Line',
				tabBarIcon: TabBarIcon('bus'),
			},
		},

		CarlsGo1BusView: {
			screen: ({navigation}) => (
				<BusView line="Carls-Go! Route 1" navigation={navigation} />
			),
			navigationOptions: {
				tabBarLabel: 'Carls-Go! R1',
				tabBarIcon: TabBarIcon('car'),
			},
		},

		CarlsGo2BusView: {
			screen: ({navigation}) => (
				<BusView line="Carls-Go! Route 2" navigation={navigation} />
			),
			navigationOptions: {
				tabBarLabel: 'Carls-Go! R2',
				tabBarIcon: TabBarIcon('car'),
			},
		},

		TransportationOtherModesListView: {
			screen: OtherModesView,
		},
	},
	{
		navigationOptions: {
			title: 'Transportation',
		},
	},
)
