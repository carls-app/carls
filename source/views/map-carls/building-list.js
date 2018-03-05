// @flow

import * as React from 'react'
import {View, FlatList} from 'react-native'
import * as c from '../components/colors'
import {ListSeparator, Title, Detail, ListRow} from '../components/list'
import {Row, Column} from '../components/layout'
import type {Building} from './types'

type Props = {
	buildings: Array<Building>,
	onSelect: string => any,
	scrollEnabled: boolean,
}

export class BuildingList extends React.Component<Props> {
	keyExtractor = (item: Building) => item.id

	onPress = (id: string) => this.props.onSelect(id)

	renderItem = ({item}: {item: Building}) => {
		const detail = item.address || (item.center || []).join(',') || ''
		return (
			<ListRow onPress={() => this.onPress(item.id)} spacing={{left: 12}}>
				<Row>
					<View
						alignSelf="center"
						backgroundColor={c.success}
						borderRadius={24}
						height={24}
						marginRight={8}
						width={24}
					/>
					<Column>
						<Title>{item.name}</Title>
						<Detail>{detail}</Detail>
					</Column>
				</Row>
			</ListRow>
		)
	}

	separator = () => <ListSeparator spacing={{left: 12}} />

	render() {
		return (
			<FlatList
				ItemSeparatorComponent={this.separator}
				contentInsetAdjustmentBehavior="automatic"
				data={this.props.buildings}
				keyExtractor={this.keyExtractor}
				keyboardDismissMode="on-drag"
				renderItem={this.renderItem}
				scrollEnabled={this.props.scrollEnabled}
			/>
		)
	}
}
