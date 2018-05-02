/* eslint-disable camelcase */
// @flow

import * as React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'

import * as newsImages from '../../../images/news-sources'
import NewsContainer from './news-container'
import {NoonNewsView} from './noon-news-bulletin'

export default TabNavigator(
	{
		NoonNews: {
			screen: ({navigation}) => (
				<NoonNewsView name="Noon News Bulletin" navigation={navigation} />
			),
			navigationOptions: {
				tabBarLabel: 'NNB',
				tabBarIcon: TabBarIcon('bonfire'),
			},
		},

		CarletonNewsView: {
			screen: ({navigation}) => (
				<NewsContainer
					navigation={navigation}
					source={{name: 'carleton-now'}}
					thumbnail={false}
					title="Carleton"
				/>
			),
			navigationOptions: {
				tabBarLabel: 'Carleton',
				tabBarIcon: TabBarIcon('school'),
			},
		},

		CarletonianNewsView: {
			screen: ({navigation}) => (
				<NewsContainer
					navigation={navigation}
					source={{name: 'carletonian'}}
					thumbnail={false}
					title="The Carletonian"
				/>
			),
			navigationOptions: {
				tabBarLabel: 'Carletonian',
				tabBarIcon: TabBarIcon('paper'),
			},
		},

		KrlxNewsView: {
			screen: ({navigation}) => (
				<NewsContainer
					navigation={navigation}
					source={{name: 'krlx'}}
					thumbnail={newsImages.krlx}
					title="KRLX"
				/>
			),
			navigationOptions: {
				tabBarLabel: 'KRLX',
				tabBarIcon: TabBarIcon('radio'),
			},
		},
	},
	{
		navigationOptions: {
			title: 'News',
		},
	},
)
