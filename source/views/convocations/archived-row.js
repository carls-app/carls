// @flow

import React from 'react'
import {StyleSheet} from 'react-native'
import {ListRow, Detail, Title} from '../components/list'
import type {PodcastEpisode} from './types'

const styles = StyleSheet.create({
	row: {
		paddingTop: 5,
		paddingBottom: 5,
	},
})

type Props = {
	event: PodcastEpisode,
	onPress: PodcastEpisode => any,
}

export class ArchivedConvocationRow extends React.PureComponent<Props> {
	_onPress = () => this.props.onPress(this.props.event)

	render() {
		const {event} = this.props

		let annotation = ''
		if (event.enclosure && event.enclosure.type.startsWith('audio/')) {
			annotation = '🎧'
		} else if (event.enclosure && event.enclosure.type.startsWith('video/')) {
			annotation = '📺'
		}

		return (
			<ListRow
				arrowPosition="center"
				contentContainerStyle={styles.row}
				onPress={this._onPress}
			>
				<Title>
					{annotation} {event.title}
				</Title>
				<Detail lines={4}>{event.description}</Detail>
			</ListRow>
		)
	}
}
