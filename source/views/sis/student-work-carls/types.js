// @flow

export type FullJobType = {
	id: string,
	title: string,
	offCampus: boolean,
	department?: string,
	dateOpen: string,
	duringTerm: boolean,
	duringBreak: boolean,
	description: string,
	links: Array<string>,
}
