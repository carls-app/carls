// @flow

import React from 'react'
import {CccCalendarView} from '@frogpond/ccc-calendar'
import {TabBarIcon} from '@frogpond/navigation-tabs'
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
				calendar="upcoming-convos"
				navigation={this.props.navigation}
				poweredBy={{
					title: 'Powered by the Carleton Calendar',
					href: 'https://carleton.edu/calendar',
				}}
			/>
		)
	}
}
