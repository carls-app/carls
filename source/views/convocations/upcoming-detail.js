// @flow
import * as React from 'react'
import {Text, ScrollView, StyleSheet, Image} from 'react-native'
import {Cell, Section, TableView} from 'react-native-tableview-simple'
import type {EventType, PoweredBy} from '../calendar/types'
import type {TopLevelViewPropsType} from '../types'
import {ShareButton} from '../components/nav-buttons'
import openUrl from '../components/open-url'
import {ListFooter} from '../components/list'
import {ButtonCell} from '../components/cells/button'
import {parseHtml, cssSelect, toMarkdown, resolveLink} from '../../lib/html'
import {
	getLinksFromEvent,
	addToCalendar,
	shareEvent,
	getTimes,
} from '../calendar/calendar-util'
import delay from 'delay'
import {Markdown} from '../components/markdown'

const styles = StyleSheet.create({
	chunk: {
		paddingVertical: 10,
	},
})

function MaybeSection({header, content}: {header: string, content: string}) {
	return content.trim() ? (
		<Section header={header}>
			<Cell
				cellContentView={
					<Text selectable={true} style={styles.chunk}>
						{content}
					</Text>
				}
			/>
		</Section>
	) : null
}

function Links({header, event}: {header: string, event: EventType}) {
	const links = getLinksFromEvent(event)

	return links.length ? (
		<Section header={header}>
			{links.map(url => (
				<Cell
					key={url}
					accessory="DisclosureIndicator"
					onPress={() => openUrl(url)}
					title={url}
				/>
			))}
		</Section>
	) : null
}

const CalendarButton = ({message, disabled, onPress}) => {
	return (
		<Section footer={message}>
			<ButtonCell
				disabled={disabled}
				onPress={onPress}
				title="Add to calendar"
			/>
		</Section>
	)
}

type Props = TopLevelViewPropsType & {
	navigation: {
		state: {params: {event: EventType, poweredBy: ?PoweredBy}},
	},
}

type State = {
	message: string,
	disabled: boolean,
	images: Array<string>,
	sponsor: string,
	content: string,
}

async function fetchEventHtml(eventId: number) {
	let body = await fetch(
		`https://apps.carleton.edu/events/convocations/?event_id=${String(
			eventId,
		)}`,
	).then(r => r.text())

	let dom = parseHtml(body)

	let eventEl = cssSelect('.eventItemMain', dom)

	let descEl = cssSelect('.eventContent', eventEl)
	let descText = descEl.length
		? toMarkdown(descEl[0], 'https://apps.carleton.edu/events/convocations/')
		: ''

	let images = cssSelect('.media a', eventEl).map(imgLink =>
		resolveLink(
			imgLink.attribs.href,
			'https://apps.carleton.edu/events/convocations/',
			'https://apps.carleton.edu',
		),
	)

	let sponsor = cssSelect('.sponsorContactInfo', eventEl)
	let sponsorText = sponsor.length
		? toMarkdown(sponsor[0], 'https://apps.carleton.edu/events/convocations/')
		: ''

	return {
		images,
		content: descText,
		sponsor: sponsorText,
	}
}

export class UpcomingConvocationsDetailView extends React.Component<Props, State> {
	static navigationOptions = ({navigation}: any) => {
		const {event} = navigation.state.params
		return {
			title: event.title,
			headerRight: <ShareButton onPress={() => shareEvent(event)} />,
		}
	}

	state = {
		message: '',
		disabled: false,
		images: [],
		content: '',
		sponsor: '',
	}

	componentDidMount() {
		this.fetchEvent()
	}

	fetchEvent = async () => {
		let {event} = this.props.navigation.state.params
		if (!event.metadata) {
			return
		}

		let eventData = await fetchEventHtml(event.metadata.reasonId)

		this.setState(() => ({
			images: eventData.images,
			content: eventData.content,
			sponsor: eventData.sponsor,
		}))
	}

	addEvent = async (event: EventType) => {
		const start = Date.now()
		this.setState(() => ({message: 'Adding event to calendar…'}))

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		const elapsed = Date.now() - start
		if (elapsed < 500) {
			await delay(500 - elapsed)
		}

		const result = await addToCalendar(event)

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

	onPressButton = () => this.addEvent(this.props.navigation.state.params.event)

	render() {
		const {event, poweredBy} = this.props.navigation.state.params

		return (
			<ScrollView>
				<TableView>
					<Section header="IMAGE">
						{this.state.images.map(imgUrl => (
							<Cell
								key={imgUrl}
								cellContentView={
									<Image
										source={{uri: imgUrl}}
										style={{width: 200, height: 300}}
									/>
								}
							/>
						))}
					</Section>
					<Section header="TEST">
						<Cell cellContentView={<Markdown source={this.state.content} />} />
					</Section>
					<MaybeSection content={event.title} header="EVENT" />
					<MaybeSection content={getTimes(event)} header="TIME" />
					<MaybeSection content={event.location} header="LOCATION" />
					<MaybeSection content={event.description} header="DESCRIPTION" />
					<Links event={event} header="LINKS" />
					<CalendarButton
						disabled={this.state.disabled}
						message={this.state.message}
						onPress={this.onPressButton}
					/>

					{poweredBy.title ? (
						<ListFooter href={poweredBy.href} title={poweredBy.title} />
					) : null}
				</TableView>
			</ScrollView>
		)
	}
}
