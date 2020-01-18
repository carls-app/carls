// @flow

import * as React from 'react'
import {TabNavigator, TabBarIcon} from '@frogpond/navigation-tabs'
import {CccCalendarView} from '@frogpond/ccc-calendar'
import type {TopLevelViewPropsType} from '../types'

export {KSTOScheduleView, KRLXScheduleView} from './radio'

export const SumoTabView = TabNavigator(
	{
		NextWeeklyMovieView: {
			screen: ({navigation}) => (
				<CccCalendarView
					calendar="sumo-schedule"
					eventMapper={event => ({
						...event,
						title: event.title.replace(/^SUMO: /u, ''),
						config: {
							...event.config,
							endTime: false,
						},
					})}
					navigation={navigation}
					poweredBy={{
						title: 'Powered by SUMO',
						href: 'https://apps.carleton.edu/student/orgs/sumo/',
					}}
				/>
			),
			navigationOptions: {
				tabBarLabel: 'Up Next',
				tabBarIcon: TabBarIcon('film'),
			},
		},
		FutureWeeklyMoviesView: {
			screen: ({navigation}) => (
				<CccCalendarView
					calendar="sumo-schedule"
					eventMapper={event => ({
						...event,
						title: event.title.replace(/^SUMO: /u, ''),
						config: {
							...event.config,
							endTime: false,
						},
					})}
					navigation={navigation}
					poweredBy={{
						title: 'Powered by SUMO',
						href: 'https://apps.carleton.edu/student/orgs/sumo/',
					}}
				/>
			),
			navigationOptions: {
				tabBarLabel: 'Upcoming',
				tabBarIcon: TabBarIcon('film'),
			},
		},
	},
	{
		navigationOptions: {
			title: 'SUMO',
		},
	},
)

export const SumoUpcomingView = ({navigation}: TopLevelViewPropsType) => (
	<CccCalendarView
		calendar="sumo-schedule"
		eventMapper={event => ({
			...event,
			title: event.title.replace(/^SUMO: /u, ''),
			config: {
				...event.config,
				endTime: false,
			},
		})}
		navigation={navigation}
		poweredBy={{
			title: 'Powered by SUMO',
			href: 'https://apps.carleton.edu/student/orgs/sumo/',
		}}
	/>
)

SumoUpcomingView.navigationOptions = {
	title: 'SUMO',
}
