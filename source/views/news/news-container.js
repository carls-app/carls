// @flow
import * as React from 'react'
import delay from 'delay'
import type {StoryType} from './types'
import LoadingView from '../components/loading'
import {NoticeView} from '../components/notice'
import type {TopLevelViewPropsType} from '../types'
import {reportNetworkProblem} from '../../lib/report-network-problem'
import {NewsList} from './news-list'

type Props = TopLevelViewPropsType & {
	title: string,
	query?: Object,
	source: {name: string},
	thumbnail: false | number,
}

type State = {
	entries: StoryType[],
	loading: boolean,
	refreshing: boolean,
	error: ?Error,
}
export default class NewsContainer extends React.PureComponent<Props, State> {
	state = {
		entries: [],
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
			let url = `https://carleton.api.frogpond.tech/v1/news/named/${
				this.props.source.name
			}`
			let entries: StoryType[] = await fetchJson(url)
			this.setState(() => ({entries}))
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

	render() {
		if (this.state.error) {
			return <NoticeView text={`Error: ${this.state.error.message}`} />
		}

		if (this.state.loading) {
			return <LoadingView />
		}

		return (
			<NewsList
				entries={this.state.entries}
				loading={this.state.refreshing}
				name={this.props.title}
				navigation={this.props.navigation}
				onRefresh={this.refresh}
				thumbnail={this.props.thumbnail}
			/>
		)
	}
}
