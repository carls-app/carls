// @flow

import * as React from 'react'
import {StyleSheet, SectionList} from 'react-native'
import {TabBarIcon} from '@frogpond/navigation-tabs'
import type {TopLevelViewPropsType} from '../../types'
import * as c from '@frogpond/colors'
import {ListSeparator, ListSectionHeader} from '@frogpond/lists'
import {NoticeView, LoadingView} from '@frogpond/notice'
import toPairs from 'lodash/toPairs'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import {JobRow} from './job-row'
import {API} from '@frogpond/api'
import type {FullJobType} from './types'
import {fetch} from '@frogpond/fetch'

const styles = StyleSheet.create({
	listContainer: {
		backgroundColor: c.white,
	},
	contentContainer: {
		flexGrow: 1,
	},
})

type Props = TopLevelViewPropsType

type State = {
	jobs: Array<{title: string, data: Array<FullJobType>}>,
	loading: boolean,
	refreshing: boolean,
	error: boolean,
}

export default class StudentWorkView extends React.PureComponent<Props, State> {
	static navigationOptions = {
		headerBackTitle: 'Job Postings',
		tabBarLabel: 'Job Postings',
		tabBarIcon: TabBarIcon('briefcase'),
	}

	state = {
		jobs: [],
		loading: true,
		refreshing: false,
		error: false,
	}

	componentDidMount() {
		this.fetchData().then(() => {
			this.setState(() => ({loading: false}))
		})
	}

	fetchData = async (reload?: boolean) => {
		let data: Array<FullJobType> = await fetch(API('/jobs'), {
			delay: reload ? 500 : 0,
		}).json()

		// ensure that During Term comes first
		let sortedJobs = sortBy(
			data,
			job => `${job.duringTerm ? 0 : 1}-${job.title}`,
		)

		// now group them
		let grouped = groupBy(sortedJobs, job =>
			job.duringTerm ? 'During Term' : 'During Break',
		)
		let intoPairs = toPairs(grouped).map(([title, data]) => ({title, data}))

		this.setState(() => ({jobs: intoPairs}))
	}

	refresh = async (): any => {
		this.setState(() => ({refreshing: true}))
		await this.fetchData(true)
		this.setState(() => ({refreshing: false}))
	}

	onPressJob = (job: FullJobType) => {
		this.props.navigation.navigate('JobDetailView', {job})
	}

	keyExtractor = (item: FullJobType, index: number) => index.toString()

	renderSectionHeader = ({section: {title}}: any) => (
		<ListSectionHeader title={title} />
	)

	renderItem = ({item}: {item: FullJobType}) => (
		<JobRow job={item} onPress={this.onPressJob} />
	)

	render() {
		if (this.state.error) {
			return <NoticeView text="Could not get open jobs." />
		}

		if (this.state.loading) {
			return <LoadingView />
		}

		return (
			<SectionList
				ItemSeparatorComponent={ListSeparator}
				ListEmptyComponent={
					<NoticeView text="There are no open job postings." />
				}
				contentContainerStyle={styles.contentContainer}
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
