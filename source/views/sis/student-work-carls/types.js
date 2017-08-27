// @flow

export type FullJobType = {
  title: string,
  offCampus: boolean,
  department?: string,
  dateOpen: string,
  duringTerm: boolean,
  duringBreak: boolean,
  description: string,
}

export type ThinJobType = {
  title: string,
  pubDate: string, // sadly, this is just the date published
  link: string,
}
