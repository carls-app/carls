// @flow

import React from 'react'
import {StyleSheet, Text, FlatList} from 'react-native'
import {TabBarIcon} from '../../components/tabbar-icon'
import type {TopLevelViewPropsType} from '../../types'
import * as c from '../../components/colors'
import {ListSeparator} from '../../components/list'
import {tracker} from '../../../analytics'
import bugsnag from '../../../bugsnag'
import {NoticeView} from '../../components/notice'
import LoadingView from '../../components/loading'
import delay from 'delay'
import {JobRow} from './job-row'
import type {ThinJobType} from './types'

const jobsUrl = 'https://apps.carleton.edu/campus/sfs/employment/feeds/jobs'

const styles = StyleSheet.create({
	listContainer: {
		backgroundColor: c.white,
	},
})

const fetchJobs = (): Array<ThinJobType> =>
	fetchXml(jobsUrl).then(resp => resp.rss.channel[0].item)

type State = {
	jobs: Array<ThinJobType>,
	loaded: boolean,
	refreshing: boolean,
	error: boolean,
}

type Props = TopLevelViewPropsType & {}

export class StudentWorkView extends React.PureComponent<Props, State> {
	static navigationOptions = {
		headerBackTitle: 'Job Postings',
		tabBarLabel: 'Job Postings',
		tabBarIcon: TabBarIcon('briefcase'),
	}

	state = {
		jobs: [],
		loaded: false,
		refreshing: false,
		error: false,
	}

	componentDidMount() {
		this.refresh()
	}

	fetchData = async () => {
		try {
			const jobs = await fetchJobs()
			this.setState(() => ({jobs}))
		} catch (err) {
			tracker.trackException(err.message)
			bugsnag.notify(err)
			this.setState(() => ({error: true}))
			console.error(err)
		}

		this.setState(() => ({loaded: true}))
	}

	refresh = async (): any => {
		const start = Date.now()
		this.setState(() => ({refreshing: true}))

		await this.fetchData()

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		const elapsed = start - Date.now()
		if (elapsed < 500) {
			await delay(500 - elapsed)
		}
		this.setState(() => ({refreshing: false}))
	}

	onPressJob = (job: ThinJobType) => {
		this.props.navigation.navigate('StudentWorkDetailView', {job})
	}

	keyExtractor = (item: ThinJobType, index: number) => index.toString()

	renderItem = ({item}: {item: ThinJobType}) => (
		<JobRow job={item} onPress={this.onPressJob} />
	)

	render() {
		if (this.state.error) {
			return <Text selectable={true}>{this.state.error}</Text>
		}

		if (!this.state.loaded) {
			return <LoadingView />
		}

		return (
			<FlatList
				ItemSeparatorComponent={ListSeparator}
				ListEmptyComponent={<NoticeView text="There are no job postings." />}
				data={this.state.jobs}
				keyExtractor={this.keyExtractor}
				onRefresh={this.refresh}
				refreshing={this.state.refreshing}
				renderItem={this.renderItem}
				style={styles.listContainer}
			/>
		)
	}
}
