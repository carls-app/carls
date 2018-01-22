// @flow

import React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'
import {ReasonCalendarView} from '../calendar/calendar-reason'

import {KSTOView} from './radio'
// import WeeklyMovieView from './movie'

export {KSTOScheduleView, KRLXScheduleView} from './radio'

export default TabNavigator(
	{
		WeeklyMovieView: {
			screen: ({navigation}) => (
				<ReasonCalendarView
					calendarUrl="https://apps.carleton.edu/student/orgs/sumo/"
					navigation={navigation}
					poweredBy={{
						title: 'Powered by SUMO',
						href: 'https://apps.carleton.edu/student/orgs/sumo/',
					}}
				/>
			),
			navigationOptions: {
				tabBarLabel: 'SUMO',
				tabBarIcon: TabBarIcon('film'),
			},
		},
		KRLXRadioView: {screen: KSTOView},
		// StreamingView: {screen: StreamListView},
		// LiveWebcamsView: {screen: WebcamsView},
		// KSTORadioView: {screen: KSTOView},
		// WeeklyMovieView: {screen: WeeklyMovieView},
	},
	{
		navigationOptions: {
			title: 'Streaming Media',
		},
	},
)
