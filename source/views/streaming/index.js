// @flow
/**
 * All About Olaf
 * Media page
 */

import React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'
import {ReasonCalendarView} from '../calendar/calendar-reason'

import KSTOView from './radio'
// import WeeklyMovieView from './movie'

export default TabNavigator(
  {
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
    KSTORadioView: {screen: KSTOView},
  },
  {
    navigationOptions: {
      title: 'Streaming Media',
    },
  },
)
