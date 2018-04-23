// @flow
import React from 'react'
import {WebView} from 'react-native'
import {AAO_USER_AGENT} from '../../user-agent'

import {NoticeView} from '../components/notice'
import type {TopLevelViewPropsType} from '../types'

const LOGIN_URL = 'https://apps.carleton.edu/login/'

type Props = TopLevelViewPropsType & {onLoginComplete: (status: boolean) => any}

type State = {complete: boolean}

export class CarletonLoginView extends React.Component<Props, State> {
	state = {complete: false}
	_ref: ?WebView = null

	onMessage = (event: any) => {
		let status = event.nativeEvent.data
		if (status.startsWith('You are logged in')) {
			this.props.navigation.state.params.onLoginComplete(true)
			this.setState(() => ({complete: true}))
		}
	}

	render() {
		if (this.state.complete) {
			return (
				<NoticeView
					buttonText="Done"
					onPress={() => this.props.navigation.goBack()}
					text="You're logged in!"
				/>
			)
		}

		let handler = `
			var info = document.querySelector(".statusInfo");
			window.postMessage(info ? info.textContent : "not logged in");
		`

		return (
			<WebView
				ref={handle => (this._ref = handle)}
				injectedJavaScript={handler}
				javaScriptEnabled={true}
				onMessage={this.onMessage}
				scalesPageToFit={true}
				source={{uri: LOGIN_URL}}
				startInLoadingState={true}
				userAgent={AAO_USER_AGENT}
			/>
		)
	}
}
