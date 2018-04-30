// @flow

import * as React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'
import {CccCalendarView} from '../calendar/calendar-ccc'
import type {TopLevelViewPropsType} from '../types'

export {KSTOScheduleView, KRLXScheduleView} from './radio'

export const SumoTabView = TabNavigator(
	{
		NextWeeklyMovieView: {
			screen: ({navigation}) => (
				<CccCalendarView
					calendarId="/v1/calendar/sumo"
					eventMapper={event => ({
						...event,
						title: event.title.replace(/^SUMO: /, ''),
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
					calendarId="/v1/calendar/sumo"
					eventMapper={event => ({
						...event,
						title: event.title.replace(/^SUMO: /, ''),
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
		calendarId="/v1/calendar/sumo"
		eventMapper={event => ({
			...event,
			title: event.title.replace(/^SUMO: /, ''),
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
