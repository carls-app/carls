// @flow

import * as React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'

import {GoogleCalendarView} from './calendar-google'
import {ReasonCalendarView} from './calendar-reason'

export {EventDetail} from './event-detail'

export default TabNavigator(
	{
		CarletonCalendarView: {
			screen: ({navigation}) => (
				<ReasonCalendarView
					calendarUrl="https://apps.carleton.edu/calendar/"
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
				<ReasonCalendarView
					calendarUrl="https://apps.carleton.edu/student/orgs/cave/calendar/"
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
				<GoogleCalendarView
					calendarId="5g91il39n0sv4c2bjdv1jrvcpq4ulm4r@import.calendar.google.com"
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
				<GoogleCalendarView
					calendarId="thisisnorthfield@gmail.com"
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
