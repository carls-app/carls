// @flow

import React from 'react'
import {CccCalendarView} from '../calendar/calendar-ccc'
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
			<CccCalendarView
				calendarId="/v1/convos/upcoming"
				navigation={this.props.navigation}
				poweredBy={{
					title: 'Powered by the Carleton Calendar',
					href: 'https://carleton.edu/calendar',
				}}
			/>
		)
	}
}
