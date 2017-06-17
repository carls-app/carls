// @flow
/**
 * All About Olaf
 * Calendar page
 */

import React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'

import {GoogleCalendarView} from './calendar-google'

export {EventDetail} from './event-detail'

export default TabNavigator(
  {
    CarletonMasterCalendarView: {
      screen: ({navigation}) =>
        <GoogleCalendarView
          navigation={navigation}
          calendarId="c7lu6q4995afqqv43de8okj416pajcf8@import.calendar.google.com"
        />,
      navigationOptions: {
        tabBarLabel: 'Carleton',
        tabBarIcon: TabBarIcon('school'),
      },
    },

    StOlafCalendarView: {
      screen: ({navigation}) =>
        <GoogleCalendarView
          navigation={navigation}
          calendarId="le6tdd9i38vgb7fcmha0hu66u9gjus2e@import.calendar.google.com"
        />,
      navigationOptions: {
        tabBarLabel: 'St. Olaf',
        tabBarIcon: TabBarIcon('rose'),
      },
    },

    NorthfieldCalendarView: {
      screen: ({navigation}) =>
        <GoogleCalendarView
          navigation={navigation}
          calendarId="thisisnorthfield@gmail.com"
        />,
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
