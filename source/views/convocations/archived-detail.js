// @flow

import * as React from 'react'
import {StyleSheet, WebView, ScrollView} from 'react-native'
import glamorous from 'glamorous-native'
import type {PodcastEpisode} from './types'
import moment from 'moment'
import {AllHtmlEntities} from 'html-entities'
import qs from 'querystring'
import {Viewport} from '../components/viewport'
import {TextButton} from '../components/nav-buttons'
import {openUrl} from '../components/open-url'

const entities = new AllHtmlEntities()

const styles = StyleSheet.create({
	audio: {
		width: 200,
		height: 100,
	},
	video: {},
})

const htmlVideo = (params: string) => `<!DOCTYPE html>
<style>
body {
	margin: 0;
}
iframe {
	width: 100%;
	height: 100%;
	background-color: black;
}
</style>
<iframe
	scrolling="no"
	frameborder="0"
	allowfullscreen
	src="https://apps.carleton.edu/reason_package/reason_4.0/www/scripts/media/media_iframe.php?${params}"
></iframe>
`

type Props = {
	navigation: {
		state: {
			params: {
				event: PodcastEpisode,
			},
		},
	},
}

const Title = glamorous.text({
	fontSize: 36,
	textAlign: 'center',
	marginHorizontal: 18,
	marginVertical: 10,
})

const Description = glamorous.text({
	fontSize: 18,
	textAlign: 'left',
	marginHorizontal: 18,
	marginVertical: 10,
})

const ConvoDate = glamorous(Description)({
	textAlign: 'center',
})

const ConvoLength = glamorous(ConvoDate)({})

const CONVO_WIDTH = 639
const CONVO_HEIGHT = 360
const RATIO = CONVO_HEIGHT / CONVO_WIDTH

function getConvoUrlParams(mediaUrl: string) {
	return mediaUrl.split('?')[1]
}

function getConvoId(mediaUrl: string) {
	return qs.parse(entities.decode(getConvoUrlParams(mediaUrl))).media_work_id
}

function getConvoLink(mediaUrl: string) {
	let convoId = getConvoId(mediaUrl)
	return `https://apps.carleton.edu/events/convocations/audio_video/?item_id=${convoId}`
}

export class ArchivedConvocationDetailView extends React.Component<Props> {
	static navigationOptions = ({navigation}: any) => {
		const {params: {event} = {}} = navigation.state

		if (!event.enclosure) {
			return {}
		}

		let link = getConvoLink(event.enclosure.url)

		return {
			headerRight: (
				<TextButton
					onPress={() => openUrl(link)}
					title="Open on carleton.edu"
				/>
			),
		}
	}

	render() {
		const {
			navigation: {
				state: {
					params: {event},
				},
			},
		} = this.props

		let style = null
		if (event.enclosure && event.enclosure.type.startsWith('audio/')) {
			style = styles.audio
		} else if (event.enclosure && event.enclosure.type.startsWith('video/')) {
			style = styles.video
		}

		let title = event.title.replace(/^Convocation: /, '')
		let date = event.pubDate.format('dddd, MMMM Do YYYY')

		let convoUrlParams = event.enclosure
			? getConvoUrlParams(event.enclosure.url)
			: ''

		let convoLength = null
		if (event.enclosure) {
			let duration = moment.duration(parseInt(event.enclosure.length) / 100)

			let hours =
				duration.hours() === 1
					? `${duration.hours()} hour`
					: `${duration.hours()} hours`

			let minutes =
				duration.minutes() === 0
					? ''
					: duration.minutes() === 1
						? `, ${duration.minutes()} minute`
						: `, ${duration.minutes()} minutes`

			convoLength = `${hours}${minutes}`
		}

		return (
			<ScrollView>
				<ConvoDate>{date}</ConvoDate>
				<Title>{title}</Title>
				<Description>{event.description}</Description>

				{event.enclosure ? (
					<React.Fragment>
						<Viewport
							render={({width}) => (
								<WebView
									scrollEnabled={false}
									source={{html: htmlVideo(convoUrlParams)}}
									style={[style, {width: width, height: RATIO * width}]}
								/>
							)}
						/>

						<ConvoLength>{convoLength}</ConvoLength>
					</React.Fragment>
				) : null}
			</ScrollView>
		)
	}
}
