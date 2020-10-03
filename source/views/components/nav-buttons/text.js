// @flow

import * as React from 'react'
import {Text} from 'react-native'
import {Touchable} from '../touchable'
import {commonStyles} from './styles'

type Props = {
	onPress: () => any,
	title: string,
	buttonStyle?: any,
}

export function TextButton({buttonStyle, title, onPress}: Props) {
	return (
		<Touchable
			borderless={true}
			highlight={false}
			onPress={onPress}
			style={[commonStyles.button, buttonStyle]}
		>
			<Text style={commonStyles.text}>{title}</Text>
		</Touchable>
	)
}
