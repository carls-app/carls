// @flow

import React from 'react'
import {Column, Row} from '../../components/layout'
import {ListRow, Title, Detail} from '../../components/list'
import type {FullJobType} from './types'

type Props = {
	onPress: FullJobType => any,
	job: FullJobType,
}

export class JobRow extends React.PureComponent<Props> {
	_onPress = () => this.props.onPress(this.props.job)

	render() {
		const {job} = this.props

		return (
			<ListRow arrowPosition="center" onPress={this._onPress}>
				<Row alignItems="center" minHeight={36}>
					<Column flex={1}>
						<Title lines={1}>{job.title}</Title>
						<Detail lines={2}>{job.description}</Detail>
					</Column>
				</Row>
			</ListRow>
		)
	}
}
