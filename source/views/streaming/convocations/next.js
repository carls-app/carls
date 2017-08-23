// @flow

import React from 'react'
import {ReasonCalendarView} from '../../calendar/calendar-reason'
import {TabBarIcon} from '../../components/tabbar-icon'

export class NextConvocationView extends React.PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Convo',
    tabBarIcon: TabBarIcon('barcode'),
  }

  props: TopLevel

  render() {
    return (
      <ReasonCalendarView
        navigation={this.props.navigation}
        calendarUrl="https://apps.carleton.edu/events/convocations/"
      />
    )
  }
}
