// @flow

import React from 'react'
import {TabBarIcon} from '../components/tabbar-icon'
import {StyleSheet, SectionList} from 'react-native'
import * as c from '../components/colors'
import toPairs from 'lodash/toPairs'
import type {TopLevelViewPropsType} from '../types'
import groupBy from 'lodash/groupBy'
import {ListSeparator, ListSectionHeader} from '../components/list'
import {NoticeView} from '../components/notice'
import bugsnag from '../../bugsnag'
import {tracker} from '../../analytics'
import delay from 'delay'
import LoadingView from '../components/loading'
import {ArchivedConvocationRow} from './archived-row'
import type {PodcastEpisode} from './types'
import {fetchConvos} from './fetch'

type Props = TopLevelViewPropsType

type State = {
	events: PodcastEpisode[],
	loaded: boolean,
	refreshing: boolean,
	error: ?Error,
}

export class ArchivedConvocationsView extends React.PureComponent<
	Props,
	State,
> {
	static navigationOptions = {
		tabBarLabel: 'Archives',
		tabBarIcon: TabBarIcon('recording'),
	}

	state = {
		events: [],
		loaded: false,
		refreshing: true,
		error: null,
	}

	componentDidMount() {
		this.refresh()
	}

	getEvents = async () => {
		let data = []
		try {
			data = await fetchConvos()
		} catch (err) {
			tracker.trackException(err.message)
			bugsnag.notify(err)
			this.setState({error: err.message})
			console.warn(err)
		}

		const onlyVideos = data.filter(
			ep => ep.enclosure && ep.enclosure.type.startsWith('video/'),
		)

		this.setState(() => ({loaded: true, events: onlyVideos}))
	}

	refresh = async (): any => {
		let start = Date.now()
		this.setState({refreshing: true})

		await this.getEvents()

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		let elapsed = start - Date.now()
		if (elapsed < 500) {
			await delay(500 - elapsed)
		}

		this.setState({refreshing: false})
	}

	groupEvents = (events: PodcastEpisode[]): any => {
		const grouped = groupBy(events, event =>
			event.pubDate.format('MMMM Do, YYYY'),
		)

		return toPairs(grouped).map(([title, data]) => ({title, data}))
	}

	onPressEvent = (event: PodcastEpisode) =>
		this.props.navigation.navigate('ArchivedConvocationDetailView', {event})

	renderSectionHeader = ({section: {title}}: any) => (
		// the proper type is ({section: {title}}: {section: {title: string}})
		<ListSectionHeader spacing={{left: 10}} title={title} />
	)

	renderItem = ({item}: {item: PodcastEpisode}) => (
		<ArchivedConvocationRow event={item} onPress={this.onPressEvent} />
	)

	keyExtractor = (item: PodcastEpisode, index: number) => index.toString()

	render() {
		if (!this.state.loaded) {
			return <LoadingView />
		}

		return (
			<SectionList
				ItemSeparatorComponent={ListSeparator}
				ListEmptyComponent={<NoticeView text="No convocations found." />}
				keyExtractor={this.keyExtractor}
				onRefresh={this.refresh}
				refreshing={this.state.refreshing}
				renderItem={this.renderItem}
				renderSectionHeader={this.renderSectionHeader}
				sections={this.groupEvents(this.state.events)}
				style={styles.container}
			/>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: c.white,
	},
})
