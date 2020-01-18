// @flow

import React from 'react'
import {CccCalendarView} from '@frogpond/ccc-calendar'
import {TabBarIcon} from '@frogpond/navigation-tabs'
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
				calendar="upcoming-convos"
				detailView="UpcomingConvocationsDetailView"
				eventMapper={event => ({
					...event,
					title: event.title.replace(/^Convocation: /u, ''),
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
