/**
 * @flow
 *
 * <LinkTable/> renders the table of building-related links.
 */

import * as React from 'react'
import {StyleSheet} from 'react-native'
import {Card} from '../../components/card'
import {ButtonCell} from '../../components/cells/button'
import openUrl from '../../components/open-url'
import type {BuildingLinkType} from '../types'

type Props = {
	links: BuildingLinkType[],
}

export class LinkTable extends React.PureComponent<Props> {
	render() {
		const {links} = this.props

		return (
			<Card header="Resources" style={styles.scheduleContainer}>
				{links.map((link, i) => (
					<ButtonCell
						key={i}
						onPress={() => openUrl(link.url.toString())}
						title={link.title}
					/>
				))}
			</Card>
		)
	}
}

const styles = StyleSheet.create({
	scheduleContainer: {
		marginBottom: 20,
	},
})
