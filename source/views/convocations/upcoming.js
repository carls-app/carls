// @flow

import React from 'react'
import {CccCalendarView} from '../calendar/calendar-ccc'
import {TabBarIcon} from '../components/tabbar-icon'
import type {TopLevelViewPropsType} from '../types'

type Props = TopLevelViewPropsType

export class UpcomingConvocationsView extends React.PureComponent<Props> {
	static navigationOptions = {
		tabBarLabel: 'Upcoming',
		tabBarIcon: TabBarIcon('planet'),
	}

	render() {
		return (
			<CccCalendarView
				calendarId="/v1/calendar/convos"
				detailView="UpcomingConvocationsDetailView"
				eventMapper={event => ({
					...event,
					title: event.title.replace(/^Convocation: /, ''),
				})}
				navigation={this.props.navigation}
				poweredBy={{
					title: 'Powered by the Carleton Calendar',
					href: 'https://carleton.edu/calendar',
				}}
			/>
		)
	}
}
