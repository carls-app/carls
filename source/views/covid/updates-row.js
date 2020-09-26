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

export class UpdatesRow extends React.PureComponent<Props> {
	_onPress = () => {
		if (!this.props.update.link) {
			Alert.alert('There is nowhere to go for this update')
			return
		}
		this.props.onPress(this.props.update.link)
	}

	render() {
		const {update} = this.props

		const posted = moment(update.date).format('MMM Do YYYY')
		const description = update.title.rendered

		return (
			<ListRow arrowPosition="center" onPress={this._onPress}>
				<Row alignItems="center">
					<Column flex={1}>
						<Title lines={2}>{posted}</Title>
						<Detail lines={3}>{description}</Detail>
					</Column>
				</Row>
			</ListRow>
		)
	}
}
