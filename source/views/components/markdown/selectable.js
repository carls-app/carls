// @flow

import * as React from 'react'
import {Text, TextInput} from 'react-native'

type Props = {}

// TODO: This is disabled until we can figure out how to let Links within the
// TextInput be tapped. At time of writing (RN 0.55), TextInput captures all
// input events in order to handle the selection handles, and doesn't let the
// nested components handle events.
export class FancySelectableText extends React.Component<Props> {
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

export class SelectableText extends React.Component<Props> {
	render() {
		return <Text selectable={true} {...this.props} />
	}
}
