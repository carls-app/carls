/**
 * <LinkTable/> renders the table of building-related links.
 */

import * as React from 'react'
import {StyleSheet} from 'react-native'
import {Card} from '../../../modules/silly-card'
import {ButtonCell} from '../../../modules/tableview/cells'
import {openUrl} from '../../../modules/open-url'
import type {BuildingLinkType} from '../types'

interface Props {
	links: BuildingLinkType[]
}

export function LinkTable(props: Props): React.ReactElement {
	return (
		<Card header="Resources" style={styles.scheduleContainer}>
			{props.links.map((link, i) => (
				<ButtonCell
					key={i}
					onPress={() => openUrl(link.url.toString())}
					title={link.title}
				/>
			))}
		</Card>
	)
}

const styles = StyleSheet.create({
	scheduleContainer: {
		marginBottom: 20,
	},
})
