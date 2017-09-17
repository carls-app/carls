// @flow
/**
 * All About Olaf
 * Media page
 */

import React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'
import {ReasonCalendarView} from '../calendar/calendar-reason'

import {KRLXView} from './krlx'
// import WeeklyMovieView from './movie'

export default TabNavigator(
  {
    KRLXRadioView: {screen: KRLXView},
    WeeklyMovieView: {
      screen: ({navigation}) =>
        <ReasonCalendarView
          navigation={navigation}
          calendarUrl="https://apps.carleton.edu/student/orgs/sumo/"
        />,
      navigationOptions: {
        tabBarLabel: 'SUMO',
        tabBarIcon: TabBarIcon('film'),
      },
    },
  },
  {
    navigationOptions: {
      title: 'Streaming Media',
    },
  },
)
