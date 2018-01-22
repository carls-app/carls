/* eslint-disable camelcase */
// @flow

import * as React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'

import {newsImages} from '../../../images/news-images'
import NewsContainer from './news-container'

export default TabNavigator(
	{
		CarletonNewsView: {
			screen: ({navigation}) => (
				<NewsContainer
					mode="rss"
					name="Carleton"
					navigation={navigation}
					thumbnail={newsImages.carleton}
					url="https://apps.carleton.edu/media_relations/feeds/blogs/news"
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
					embedFeaturedImage={true}
					mode="rss"
					name="The Carletonian"
					navigation={navigation}
					thumbnail={newsImages.carletonian}
					url="https://apps.carleton.edu/carletonian/feeds/blogs/tonian"
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
					mode="wp-json"
					name="KRLX"
					navigation={navigation}
					query={{per_page: 10, _embed: true}}
					thumbnail={newsImages.krlx}
					url="https://www.krlx.org/wp-json/wp/v2/posts/"
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
