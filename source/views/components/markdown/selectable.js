// @flow

import * as React from 'react'
import {TextInput} from 'react-native'

type Props = {}

export class SelectableText extends React.Component<Props> {
	render() {
		return (
			<TextInput
				dataDetectorTypes="all"
				editable={false}
				multiline={true}
				{...this.props}
			/>
		)
	}
}
