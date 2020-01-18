// @flow
import * as React from 'react'
import {StyleSheet, ActivityIndicator, Text} from 'react-native'
import {Section} from 'react-native-tableview-simple'
import type {EventType} from '@frogpond/event-type'
import type {PoweredBy} from '@frogpond/event-list'
import type {TopLevelViewPropsType} from '../types'
import {ShareButton} from '@frogpond/navigation-buttons'
import {openUrl} from '@frogpond/open-url'
import {PushButtonCell} from '@frogpond/tableview'
import {shareEvent, getTimes} from '@frogpond/event-list'
import {AddToCalendar} from '@frogpond/add-to-device-calendar'
import {Markdown} from '@frogpond/markdown'
import glamorous from 'glamorous-native'
import * as c from '@frogpond/colors'
import * as colors from '../../lib/colors'

const styles = StyleSheet.create({
	spinner: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
	},
	text: {
		textAlign: 'center',
	},
})

const Container = glamorous.scrollView({
	backgroundColor: c.white,
})

const Padding = glamorous.view({
	paddingHorizontal: 18,
	paddingVertical: 6,
})

const Title = glamorous.text({
	fontSize: 36,
	textAlign: 'center',
	marginHorizontal: 18,
	marginVertical: 10,
})
const Description = glamorous.text({
	fontSize: 16,
	fontStyle: 'italic',
})

const WhenWhereBlock = glamorous.view({
	marginTop: 8,
	backgroundColor: colors.lightGray,
	paddingVertical: 4,
	paddingHorizontal: 8,
	borderRadius: 4,
})

const When = glamorous.text({
	fontSize: 16,
})
const Where = glamorous.text({
	fontSize: 16,
})

const PosterContainer = glamorous.view({
	flexDirection: 'column',
	alignItems: 'center',
	marginVertical: 20,
})

const Poster = glamorous.image({
	width: 200,
	height: 300,
})

type Props = TopLevelViewPropsType & {
	navigation: {
		state: {params: {event: EventType, poweredBy: ?PoweredBy}},
	},
}

type State = {
	images: Array<string>,
	sponsor: string,
	content: string,
	loading: boolean,
}

class DetailView extends React.Component<Props, State> {
	static navigationOptions = ({navigation}: any) => {
		const {event} = navigation.state.params
		return {
			title: event.title,
			headerRight: <ShareButton onPress={() => shareEvent(event)} />,
		}
	}

	state = {
		images: [],
		content: '',
		sponsor: '',
		loading: true,
	}

	componentDidMount() {
		this.fetchEvent()
	}

	fetchEvent = async () => {
		let {event} = this.props.navigation.state.params
		if (!event.metadata) {
			return
		}

		let id = event.metadata.reasonId
		let url =
			'https://carleton.api.frogpond.tech/v1/convos/upcoming/' + String(id)
		let eventData = await fetch(url).then(r => r.json())

		this.setState(() => ({
			images: eventData.images,
			content: eventData.content,
			sponsor: eventData.sponsor,
			loading: false,
		}))
	}

	render() {
		const {event} = this.props.navigation.state.params

		let id = event.metadata.reasonId
		let eventLink = `https://apps.carleton.edu/events/convocations/?event_id=${id}`

		return (
			<Container>
				<Padding>
					<Title>{event.title}</Title>

					<Description>{event.description}</Description>

					<WhenWhereBlock>
						<When>{getTimes(event)}</When>
						<Where>{event.location}</Where>
					</WhenWhereBlock>

					{this.state.images.length ? (
						<PosterContainer>
							{this.state.images.map(imgUrl => (
								<Poster key={imgUrl} source={{uri: imgUrl}} />
							))}
						</PosterContainer>
					) : null}

					{this.state.loading ? (
						<React.Fragment>
							<ActivityIndicator style={styles.spinner} />
							<Text selectable={true} style={[styles.text]}>
								{'Loading details…'}
							</Text>
						</React.Fragment>
					) : (
						<Markdown source={this.state.content} />
					)}
				</Padding>

				<Section sectionTintColor={c.white}>
					<AddToCalendar
						compactMessages={true}
						event={event}
						render={({message, disabled, onPress}) => (
							<PushButtonCell
								disabled={disabled}
								onPress={onPress}
								title={
									'Add to calendar' + (message.trim() ? ` (${message})` : '')
								}
							/>
						)}
					/>
					{event.metadata && event.metadata.reasonId ? (
						<PushButtonCell
							onPress={() => openUrl(eventLink)}
							title="Open on carleton.edu"
						/>
					) : null}
				</Section>
			</Container>
		)
	}
}

export {DetailView as UpcomingConvocationsDetailView}
