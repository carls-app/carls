// @flow

import type moment from 'moment'

export type RawPodcastEpisode = {
  title: string,
  description: string,
  pubDate: string,
  enclosure: {
    $: {
      url: string,
      length: string,
      type: string,
    },
  },
}

export type ParsedPodcastEpisode = {
  title: string,
  description: string,
  pubDate: moment,
  enclosure: ?{
    url: string,
    length: string,
    type: string,
  },
}
