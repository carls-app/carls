// @flow

import * as React from 'react'
import {Text} from 'react-native'

type Props = {}

export class SelectableText extends React.Component<Props> {
	render() {
		return <Text selectable={true} {...this.props} />
	}
}
