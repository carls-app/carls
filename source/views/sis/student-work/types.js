// @flow

import type moment from 'moment'

export type FullJobType = {
  title: string,
  department?: string,
  dateOpen: moment,
  duringTerm: boolean,
  duringBreak: boolean,
  description: string,
}

export type ThinJobType = {
  title: string,
  pubDate: string, // sadly, this is just the date published
  link: string,
}
