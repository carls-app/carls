// @flow

import * as React from 'react'
import {TabBarIcon} from '../components/tabbar-icon'
import openUrl from '../components/open-url'
import type {TopLevelViewPropsType} from '../types'
import {NoticeView} from '../components/notice'

type Props = TopLevelViewPropsType

export class TheHubView extends React.PureComponent<Props> {
	static navigationOptions = {
		tabBarLabel: 'The Hub',
		tabBarIcon: TabBarIcon('cash'),
	}

	open = () => openUrl('https://campushub.carleton.edu/')

	render() {
		return (
			<NoticeView
				buttonText="Open The Hub"
				header="The Hub"
				onPress={this.open}
				text="The Hub is the hub of your Carleton academic life. Well, the Hub and Moodle together are, at least."
			/>
		)
	}
}
