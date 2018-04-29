// @flow

import * as React from 'react'
import * as glamorous from 'glamorous-native'
import * as c from '../components/colors'
import sample from 'lodash/sample'
import {CELL_MARGIN} from './button'

const messages = [
	'☃️🍃 An Unofficial App Project ⛱🍂',
	'An unofficial Carleton app',
	'🐧',
]

export function UnofficialAppNotice() {
	return (
		<glamorous.View
			justifyContent="center"
			marginBottom={CELL_MARGIN}
			marginHorizontal={10}
		>
			<glamorous.View backgroundColor="rgba(0,0,0,0.05)" borderRadius={7}>
				<glamorous.Text color={c.black25Percent} padding={8} textAlign="center">
					{sample(messages)}
				</glamorous.Text>
			</glamorous.View>
		</glamorous.View>
	)
}
