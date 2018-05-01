// @flow

import * as React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'

import {CccCalendarView} from './calendar-ccc'

export {EventDetail} from './event-detail'

export default TabNavigator(
	{
		CarletonCalendarView: {
			screen: ({navigation}) => (
				<CccCalendarView
					calendarId="/v1/calendar/carleton"
					navigation={navigation}
					poweredBy={{
						title: 'Powered by the Carleton Calendar',
						href: 'https://carleton.edu/calendar',
					}}
				/>
			),
			navigationOptions: {
				tabBarLabel: 'Carleton',
				tabBarIcon: TabBarIcon('school'),
			},
		},

		TheCaveCalendarView: {
			screen: ({navigation}) => (
				<CccCalendarView
					calendarId="/v1/calendar/cave"
					navigation={navigation}
					poweredBy={{
						title: 'Powered by the Carleton Calendar',
						href: 'https://carleton.edu/calendar',
					}}
				/>
			),
			navigationOptions: {
				tabBarLabel: 'The Cave',
				tabBarIcon: TabBarIcon('beer'),
			},
		},

		StOlafCalendarView: {
			screen: ({navigation}) => (
				<CccCalendarView
					calendarId="/v1/calendar/stolaf"
					navigation={navigation}
					poweredBy={{
						title: 'Powered by the St. Olaf Calendar',
						href: 'https://wp.stolaf.edu/calendar/',
					}}
				/>
			),
			navigationOptions: {
				tabBarLabel: 'St. Olaf',
				tabBarIcon: TabBarIcon('school'),
			},
		},

		NorthfieldCalendarView: {
			screen: ({navigation}) => (
				<CccCalendarView
					calendarId="/v1/calendar/northfield"
					navigation={navigation}
					poweredBy={{
						title: 'Powered by VisitingNorthfield.com',
						href: 'http://visitingnorthfield.com/events/calendar/',
					}}
				/>
			),
			navigationOptions: {
				tabBarLabel: 'Northfield',
				tabBarIcon: TabBarIcon('pin'),
			},
		},
	},
	{
		navigationOptions: {
			title: 'Calendar',
		},
	},
)
