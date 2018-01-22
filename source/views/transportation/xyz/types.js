// @flow

export type Departures = {
	days: string[],
	departures: any[],
}

export type Exceptions = {
	dates: string[],
	departures: string[],
}

export type XyzBusLine = {
	name: string,
	dest: string,
	direction?: string,
	display_class?: string,
	display_style?: string,
	departures: Departures[],
	departures_exceptions?: Exceptions[],
}
