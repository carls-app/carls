// @flow

import * as React from 'react'
import {TabNavigator, TabBarIcon} from '@frogpond/navigation-tabs'

import * as newsImages from '../../../images/news-sources'
import NewsContainer from './news-container'

const NewsView = TabNavigator({
	CarletonNewsView: {
		screen: ({navigation}) => (
			<NewsContainer
				navigation={navigation}
				source="carleton-now"
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
				source="carletonian"
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
				source="krlx"
				thumbnail={newsImages.krlx}
				title="KRLX"
			/>
		),
		navigationOptions: {
			tabBarLabel: 'KRLX',
			tabBarIcon: TabBarIcon('radio'),
		},
	},
})
NewsView.navigationOptions = {
	title: 'News',
}

export default NewsView
