// @flow

import React from 'react'
import {Column, Row} from '../../components/layout'
import {ListRow, Title} from '../../components/list'
import type {ThinJobType} from './types'

type Props = {
	onPress: ThinJobType => any,
	job: ThinJobType,
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
					</Column>
				</Row>
			</ListRow>
		)
	}
}
