// @flow

import type moment from 'moment'

export type PodcastEpisode = {
	title: string,
	description: string,
	pubDate: moment,
	enclosure: ?{
		url: string,
		length: string,
		type: string,
	},
}
