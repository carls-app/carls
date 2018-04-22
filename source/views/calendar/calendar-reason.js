// @flow

import React from 'react'
import {EventList} from './event-list'
import bugsnag from '../../bugsnag'
import {tracker} from '../../analytics'
import type {TopLevelViewPropsType} from '../types'
import type {EventType, ReasonEventType} from './types'
import moment from 'moment-timezone'
import delay from 'delay'
import LoadingView from '../components/loading'
import qs from 'querystring'
const TIMEZONE = 'America/Winnipeg'

type State = {
	events: EventType[],
	loaded: boolean,
	refreshing: boolean,
	error: ?Error,
	now: moment,
}

type Props = TopLevelViewPropsType & {
	calendarUrl: string,
	calendarProps?: any,
	poweredBy: {title: string, href: string},
	eventMapper?: EventType => EventType,
}

export class ReasonCalendarView extends React.Component<Props, State> {
	state = {
		events: [],
		loaded: false,
		refreshing: true,
		error: null,
		now: moment.tz(TIMEZONE),
	}

	componentDidMount() {
		this.refresh()
	}

	buildCalendarUrl(calendarUrl: string, calendarProps: any, now: moment) {
		let params = {
			// eslint-disable-next-line camelcase
			start_date: now.clone().format('YYYY-MM-DD'),
			// eslint-disable-next-line camelcase
			end_date: now
				.clone()
				.add(1, 'month')
				.format('YYYY-MM-DD'),
			...(calendarProps || {}),
			format: 'json',
		}
		return `${calendarUrl}?${qs.stringify(params)}`
	}

	convertEvents(data: ReasonEventType[], now: moment): EventType[] {
		let events = data.map(event => {
			const startTime = moment(event.datetime)
			const endTime = startTime
				.clone()
				.add(event.hours, 'hours')
				.add(event.minutes, 'minutes')

			return {
				startTime,
				endTime,
				title: event.name || '',
				description: event.description || '',
				location: event.location || '',
				isOngoing: startTime.isBefore(now, 'day') && endTime.isSameOrAfter(now),
				config: {
					startTime: true,
					endTime: true,
					subtitle: 'location',
				},
			}
		})

		if (this.props.eventMapper) {
			events = events.map(this.props.eventMapper)
		}

		return events
	}

	getEvents = async (now: moment = moment.tz(TIMEZONE)) => {
		let url = this.buildCalendarUrl(
			this.props.calendarUrl,
			this.props.calendarProps,
			now,
		)

		let data: Array<ReasonEventType> = []
		try {
			data = await fetchJson(url)
		} catch (err) {
			tracker.trackException(err.message)
			bugsnag.notify(err)
			this.setState({error: err.message})
			console.warn(err)
		}

		this.setState(() => ({
			now,
			loaded: true,
			events: this.convertEvents(data, now),
		}))
	}

	refresh = async () => {
		let start = Date.now()
		this.setState({refreshing: true})

		await this.getEvents()

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		let elapsed = start - Date.now()
		if (elapsed < 500) {
			await delay(500 - elapsed)
		}

		this.setState({refreshing: false})
	}

	render() {
		if (!this.state.loaded) {
			return <LoadingView />
		}

		return (
			<EventList
				events={this.state.events}
				message={this.state.error ? this.state.error.message : null}
				navigation={this.props.navigation}
				now={this.state.now}
				onRefresh={this.refresh}
				poweredBy={this.props.poweredBy}
				refreshing={this.state.refreshing}
			/>
		)
	}
}
