// @flow

import * as React from 'react'

import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'

import {OtherModesView} from './other-modes'
import {BusView} from './bus'
import {ConnectedXyzBusList} from './xyz'

export {ConnectedXyzBusView} from './xyz/view'
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

		TransportationOtherBusView: {
			screen: ConnectedXyzBusList,
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
