// @flow

import * as React from 'react'
import moment from 'moment-timezone'
import {Alert} from 'react-native'
import {Column, Row} from '../components/layout'
import {ListRow, Detail, Title} from '../components/list'
import type {UpdateType} from './types'

type Props = {
	onPress: string => any,
	update: UpdateType,
}

const TIMEZONE = 'America/Winnipeg'

export class UpdatesRow extends React.PureComponent<Props> {
	_onPress = () => {
		if (!this.props.update.link) {
			Alert.alert('There is nowhere to go for this update')
			return
		}
		this.props.onPress(this.props.update.link)
	}

	calculateFromNow = (publishedOffset: moment) => {
		const today = moment.utc().tz(TIMEZONE).startOf('day')

		if (today.isAfter(publishedOffset, 'day')) {
			return moment.duration(publishedOffset - today).humanize(true)
		}

		return publishedOffset.fromNow()
	}

	render() {
		const {update} = this.props

		const publishedOffset = moment.utc(update.datePublished).tz(TIMEZONE)

		const posted = publishedOffset.format('MMMM D, YYYY')
		const fromNow = this.calculateFromNow(publishedOffset)

		return (
			<ListRow arrowPosition="center" onPress={this._onPress}>
				<Row alignItems="center">
					<Column flex={1}>
						<Title lines={1}>{`${posted} (${fromNow})`}</Title>
						<Detail lines={3}>{update.title}</Detail>
					</Column>
				</Row>
			</ListRow>
		)
	}
}
