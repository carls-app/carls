// @flow

import React from 'react'
import {TabBarIcon} from '@frogpond/navigation-tabs'
import {StyleSheet, SectionList} from 'react-native'
import * as c from '@frogpond/colors'
import toPairs from 'lodash/toPairs'
import type {TopLevelViewPropsType} from '../types'
import groupBy from 'lodash/groupBy'
import {ListSeparator, ListSectionHeader} from '@frogpond/lists'
import {NoticeView, LoadingView} from '@frogpond/notice'
import delay from 'delay'
import {ArchivedConvocationRow} from './archived-row'
import type {PodcastEpisode} from './types'
import moment from 'moment'

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
			data = await fetch(
				'https://carleton.api.frogpond.tech/v1/convos/archived',
			).then(r => r.json())
		} catch (err) {
			this.setState({error: err.message})
			console.warn(err)
		}

		let onlyVideos = data.filter(
			ep => ep.enclosure && ep.enclosure.type.startsWith('video/'),
		)

		onlyVideos = onlyVideos.map(item => ({
			...item,
			pubDate: moment(item.pubDate),
		}))

		this.setState(() => ({loaded: true, events: onlyVideos}))
	}

	refresh = async (): any => {
		let start = Date.now()
		this.setState(() => ({refreshing: true}))

		await this.getEvents()

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		let elapsed = start - Date.now()
		if (elapsed < 500) {
			await delay(500 - elapsed)
		}

		this.setState(() => ({refreshing: false}))
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
