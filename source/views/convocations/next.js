// @flow

import React from 'react'
import {ReasonCalendarView} from '../calendar/calendar-reason'
import {TabBarIcon} from '../components/tabbar-icon'
import type {TopLevelViewPropsType} from '../types'

type Props = TopLevelViewPropsType

export class NextConvocationView extends React.PureComponent<Props> {
	static navigationOptions = {
		tabBarLabel: 'Next Up',
		tabBarIcon: TabBarIcon('barcode'),
	}

	render() {
		return (
			<ReasonCalendarView
				calendarUrl="https://apps.carleton.edu/events/convocations/"
				navigation={this.props.navigation}
				poweredBy={{
					title: 'Powered by the Carleton Calendar',
					href: 'https://carleton.edu/calendar',
				}}
			/>
		)
	}
}
