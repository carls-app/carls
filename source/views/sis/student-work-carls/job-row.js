// @flow

import React from 'react'
import {Column, Row} from '../../components/layout'
import {ListRow, Title} from '../../components/list'
import type {ThinJobType} from './types'

export class JobRow extends React.PureComponent {
  props: {
    onPress: ThinJobType => any,
    job: ThinJobType,
  }

  _onPress = () => this.props.onPress(this.props.job)

  render() {
    const {job} = this.props

    return (
      <ListRow arrowPosition="center" onPress={this._onPress}>
        <Row minHeight={36} alignItems="center">
          <Column flex={1}>
            <Title lines={1}>{job.title}</Title>
          </Column>
        </Row>
      </ListRow>
    )
  }
}
