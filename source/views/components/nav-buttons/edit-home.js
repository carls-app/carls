// @flow

import * as React from 'react'
import type {NavType} from '../../types'
import {TextButton} from './text'

type Props = {
	navigation: NavType,
	buttonStyle?: any,
}

export function EditHomeButton({navigation, buttonStyle}: Props) {
	return (
		<TextButton
			onPress={() => navigation.navigate('EditHomeView')}
			style={buttonStyle}
			title="Edit"
		/>
	)
}
