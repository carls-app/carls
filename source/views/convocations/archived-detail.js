// @flow

import React from 'react'
// import Video from 'react-native-video'
import {StyleSheet, WebView, ScrollView} from 'react-native'
import {Title} from '../components/list'
import type {PodcastEpisode} from './types'

const styles = StyleSheet.create({
	'🎧': {
		width: 200,
		height: 100,
	},
	'📺': {
		width: 854,
		height: 480,
		flex: 1,
	},
})

const htmlVideo = (url: string) => `<!DOCTYPE html>
  <style>
    video {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  </style>
  <video webkit-playsinline playsinline controls>
    <source src="${url}" type="video/mp4" />
  </video>
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

export class ArchivedConvocationDetailView extends React.PureComponent<Props> {
	render() {
		const {navigation: {state: {params: {event}}}} = this.props

		let style = null
		if (event.enclosure && event.enclosure.type.startsWith('audio/')) {
			style = styles['🎧']
		} else if (event.enclosure && event.enclosure.type.startsWith('video/')) {
			style = styles['📺']
		}

		return (
			<ScrollView>
				<Title>{event.title}</Title>

				{event.enclosure ? (
					/* <Video
    					source={{uri: event.enclosure.url}}
    					style={style}
    					controls={true}
    					playInBackground={true}
    					playWhenInactive={true}
    				/> */
					<WebView
						source={{html: htmlVideo(event.enclosure.url)}}
						style={style}
					/>
				) : null}
			</ScrollView>
		)
	}
}
