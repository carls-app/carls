// @flow

import React from 'react'
import {ReasonCalendarView} from '../calendar/calendar-reason'
import {TabBarIcon} from '../components/tabbar-icon'
import type {TopLevelViewPropsType} from '../types'

export class UpcomingConvocationsView extends React.PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Next Convos',
    tabBarIcon: TabBarIcon('planet'),
  }

  props: TopLevelViewPropsType

  render() {
    return (
      <ReasonCalendarView
        navigation={this.props.navigation}
        calendarUrl="https://apps.carleton.edu/events/convocations/"
      />
    )
  }
}
