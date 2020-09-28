// @flow
import * as React from 'react'
import delay from 'delay'
import LoadingView from '../components/loading'
import {NoticeView} from '../components/notice'
import {reportNetworkProblem} from '../../lib/report-network-problem'
import {UpdatesList} from './updates-list'
import {ButtonCell} from '../components/cells/button'

import type {TopLevelViewPropsType} from '../types'
import type {UpdateType} from './types'

type Props = TopLevelViewPropsType & {
	title: string,
}

type State = {
	updates: UpdateType[],
	loading: boolean,
	refreshing: boolean,
	error: ?Error,
}
export class UpdatesContainer extends React.PureComponent<Props, State> {
	state = {
		updates: [],
		loading: true,
		error: null,
		refreshing: false,
	}

	componentDidMount() {
		this.fetchData().then(() => {
			this.setState(() => ({loading: false}))
		})
	}

	fetchData = async () => {
		try {
			let url = 'https://carleton.api.frogpond.tech/v1/news/named/covid'
			let updates: UpdateType[] = await fetchJson(url)
			this.setState(() => ({updates}))
		} catch (error) {
			reportNetworkProblem(error)
			this.setState(() => ({error}))
		}
	}

	refresh = async (): any => {
		let start = Date.now()
		this.setState(() => ({refreshing: true}))

		await this.fetchData()

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		let elapsed = Date.now() - start
		if (elapsed < 500) {
			await delay(500 - elapsed)
		}
		this.setState(() => ({refreshing: false}))
	}

	onPress = () => {
		this.props.navigation.push('CovidUpdatesView', {
			updates: this.state.updates,
			showAll: true,
		})
	}

	render() {
		if (this.state.error) {
			return <NoticeView text={`Error: ${this.state.error.message}`} />
		}

		if (this.state.loading) {
			return <LoadingView />
		}

		return (
			<React.Fragment>
				<UpdatesList
					loading={this.state.refreshing}
					name={this.props.title}
					navigation={this.props.navigation}
					onRefresh={this.refresh}
					showAll={false}
					updates={this.state.updates}
				/>

				<ButtonCell onPress={this.onPress} title="See all updates…" />
			</React.Fragment>
		)
	}
}
