// @flow
import React from 'react'
import {Text} from 'react-native'
import LoadingView from '../../components/loading'
import {JobDetailView} from './detail'
import type {ThinJobType, FullJobType} from './types'
import {fetchJob} from './fetch-job'

type State = {
	job: ?FullJobType,
	error: ?Error,
	loading: boolean,
}

type Props = {navigation: {state: {params: {job: ThinJobType}}}}

export class StudentWorkDetailView extends React.PureComponent<Props, State> {
	static navigationOptions = ({navigation}) => {
		return {title: navigation.state.params.job.title}
	}

	state = {
		job: null,
		error: null,
		loading: true,
	}

	componentWillMount() {
		this.fetch()
	}

	fetch = async () => {
		this.setState(() => ({loading: true}))
		const job = this.props.navigation.state.params.job
		try {
			const jobData = await fetchJob(job.link)
			this.setState(() => ({job: jobData, error: null, loading: false}))
		} catch (e) {
			this.setState(() => ({error: e, loading: false}))
		}
	}

	render() {
		if (this.state.loading) {
			return <LoadingView />
		}

		if (this.state.error) {
			return <Text>{this.state.error.message}</Text>
		}

		if (!this.state.job) {
			return <Text>This should never be seen.</Text>
		}

		return <JobDetailView job={this.state.job} />
	}
}
