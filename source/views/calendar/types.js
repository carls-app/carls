// @flow
import type moment from 'moment'

type GoogleTimeType = {
	dateTime: string,
}
export type GoogleEventType = {
	summary?: string,
	description?: string,
	start: GoogleTimeType,
	end: GoogleTimeType,
	location?: string,
}

type ReasonStringBoolean = '0' | '1'
export type ReasonEventType = {
	address: ?string,
	author: string,
	calendar_record: number,
	contact_organization: string,
	contact_username: string,
	content: string,
	created_by: string,
	creation_date: string,
	dates: string[],
	datetime: string,
	description: string,
	end_date: string,
	frequency: ?number,
	friday: boolean,
	geopoint: string,
	hours: ?number,
	id: number,
	keywords: string,
	language: ?string,
	last_edited_by: string,
	last_modified: string,
	last_occurence: string,
	latitude: ?string,
	location: string,
	longitude: ?string,
	minutes: ?number,
	monday: boolean,
	month_day_of_week: ?string,
	monthly_repeat: ?string,
	name: string,
	new: ReasonStringBoolean,
	no_share: ReasonStringBoolean,
	recurrence: string,
	registration: string,
	saturday: boolean,
	show_hide: 'show' | 'hide',
	sponsor: string,
	state: string,
	sunday: boolean,
	term_only: boolean,
	thursday: boolean,
	tuesday: boolean,
	type: string,
	unique_name: string,
	url: string,
	wednesday: boolean,
	week_of_month: ?string,
}

export type PoweredBy = {
	title: string,
	href: string,
}

export type EventType = {|
	title: string,
	description: string,
	location: string,
	startTime: moment,
	endTime: moment,
	isOngoing: boolean,
	metadata?: {
		reasonId?: number,
	},
	config: {
		startTime: boolean,
		endTime: boolean,
		subtitle: 'location' | 'description',
	},
|}
