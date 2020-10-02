/**
 * @flow
 *
 * <LinkTable/> renders the table of building-related links.
 */

import * as React from 'react'
import {TableView, Section} from 'react-native-tableview-simple'
import {PushButtonCell} from '../../components/cells/push-button'
import openUrl from '../../components/open-url'
import type {BuildingLinkType} from '../types'

type Props = {
	links: BuildingLinkType[],
}

export class LinkTable extends React.PureComponent<Props> {
	render() {
		const {links} = this.props

		return (
			<TableView>
				<Section header="RESOURCES">
					{links.map((link, i) => (
						<PushButtonCell
							key={i}
							onPress={() => openUrl(link.url.toString())}
							title={link.title}
						/>
					))}
				</Section>
			</TableView>
		)
	}
}
