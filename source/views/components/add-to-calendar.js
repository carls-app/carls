// @flow
import * as React from 'react'
import type {EventType} from '../calendar/types'
import {addToCalendar} from '../calendar/calendar-util'
import delay from 'delay'

type Props = {
	event: EventType,
	render: ({
		message: string,
		disabled: boolean,
		onPress: () => any,
	}) => React.Node,
}

type State = {
	message: string,
	disabled: boolean,
}

export class AddToCalendar extends React.Component<Props, State> {
	state = {
		message: '',
		disabled: false,
	}

	addEvent = async () => {
		let {event} = this.props

		let start = Date.now()
		this.setState(() => ({message: 'Adding event to calendar…'}))

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		let elapsed = Date.now() - start
		if (elapsed < 500) {
			await delay(500 - elapsed)
		}

		let result = await addToCalendar(event)

		if (result) {
			this.setState(() => ({
				message: 'Event has been added to your calendar',
				disabled: true,
			}))
		} else {
			this.setState(() => ({
				message: 'Could not add event to your calendar',
				disabled: false,
			}))
		}
	}

	render() {
		return this.props.render({
			message: this.state.message,
			disabled: this.state.disabled,
			onPress: this.addEvent,
		})
	}
}
