// @flow

import * as React from 'react'
import {TextInput, Platform, StyleSheet} from 'react-native'
import type {NewsBulletinType} from './types'
import {ListRow} from '../../components/list'
import * as c from '../../components/colors'

type Props = {
	bulletin: NewsBulletinType,
}

export class NoonNewsRowView extends React.PureComponent<Props> {
	render() {
		const {bulletin} = this.props

		return (
			<ListRow arrowPosition="none">
				<TextInput
					dataDetectorTypes="all"
					editable={false}
					multiline={true}
					style={styles.title}
					value={bulletin.description}
				/>
			</ListRow>
		)
	}
}

const styles = StyleSheet.create({
	title: {
		color: c.black,
		fontSize: 17,
		marginTop: -4,
		...Platform.select({
			ios: {
				fontWeight: '500',
			},
			android: {
				fontWeight: '600',
			},
		}),
	},
})
