// @flow

import React from 'react'
import {StyleSheet, Text, SectionList} from 'react-native'
import {TabBarIcon} from '../../components/tabbar-icon'
import type {TopLevelViewPropsType} from '../../types'
import * as c from '../../components/colors'
import {ListSeparator, ListSectionHeader} from '../../components/list'
import {tracker} from '../../../analytics'
import bugsnag from '../../../bugsnag'
import {NoticeView} from '../../components/notice'
import LoadingView from '../../components/loading'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import toPairs from 'lodash/toPairs'
import delay from 'delay'
import {JobRow} from './job-row'
import type {FullJobType} from './types'

const jobsUrl = 'https://carleton.api.frogpond.tech/v1/jobs'

const styles = StyleSheet.create({
	listContainer: {
		backgroundColor: c.white,
	},
})

type State = {
	jobs: Array<{title: string, data: Array<FullJobType>}>,
	loaded: boolean,
	refreshing: boolean,
	error: boolean,
}

type Props = TopLevelViewPropsType & {}

export class StudentWorkView extends React.Component<Props, State> {
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
			const jobs = await fetchJson(jobsUrl)
			// ensure that During Term comes first
			let sortedJobs = sortBy(
				jobs,
				job => `${job.duringTerm ? 0 : 1}-${job.name}`,
			)
			// now group them
			let grouped = groupBy(
				sortedJobs,
				job => (job.duringTerm ? 'During Term' : 'During Break'),
			)
			grouped = toPairs(grouped).map(([title, data]) => ({title, data}))
			this.setState(() => ({jobs: grouped}))
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

	onPressJob = (job: FullJobType) => {
		this.props.navigation.navigate('StudentWorkDetailView', {job})
	}

	keyExtractor = (item: FullJobType) => item.id

	renderSectionHeader = ({section: {title}}: any) => (
		<ListSectionHeader title={title} />
	)

	renderItem = ({item}: {item: FullJobType}) => (
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
			<SectionList
				ItemSeparatorComponent={ListSeparator}
				ListEmptyComponent={<NoticeView text="There are no job postings." />}
				keyExtractor={this.keyExtractor}
				onRefresh={this.refresh}
				refreshing={this.state.refreshing}
				renderItem={this.renderItem}
				renderSectionHeader={this.renderSectionHeader}
				sections={(this.state.jobs: any)}
				style={styles.listContainer}
			/>
		)
	}
}
