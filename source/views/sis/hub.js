// @flow

import * as React from 'react'
import {TabBarIcon} from '@frogpond/navigation-tabs'
import {openUrl} from '@frogpond/open-url'
import type {TopLevelViewPropsType} from '../types'
import {NoticeView} from '@frogpond/notice'

type Props = TopLevelViewPropsType

export class TheHubView extends React.PureComponent<Props> {
	static navigationOptions = {
		tabBarLabel: 'The Hub',
		tabBarIcon: TabBarIcon('finger-print'),
	}

	open = () => openUrl('https://campushub.carleton.edu/')

	render() {
		return (
			<NoticeView
				buttonText="Open The Hub"
				header="The Hub"
				onPress={this.open}
				text="The Hub is a central area where Carleton community members access information about themselves or their students."
			/>
		)
	}
}
