// @flow
import * as React from 'react'
import {StyleSheet, FlatList} from 'react-native'
import * as c from '../components/colors'
import {ListSeparator} from '../components/list'
import {NoticeView} from '../components/notice'
import {UpdatesRow} from './updates-row'
import openUrl from '../components/open-url'

import type {TopLevelViewPropsType} from '../types'
import type {UpdateType} from './types'

const styles = StyleSheet.create({
	listContainer: {
		backgroundColor: c.white,
	},
})

type Props = TopLevelViewPropsType & {
	name: string,
	onRefresh: () => any,
	updates: UpdateType[],
	loading: boolean,
	showAll: boolean,
}

export class UpdatesList extends React.PureComponent<Props> {
	static navigationOptions = {
		title: 'Updates on COVID-19',
	}

	onPressUpdates = (url: string) => {
		return openUrl(url)
	}

	renderItem = ({item}: {item: UpdateType}) => (
		<UpdatesRow onPress={this.onPressUpdates} update={item} />
	)

	keyExtractor = (item: UpdateType) => item.id.toString()

	render() {
		const showAll =
			this.props.showAll !== undefined
				? this.props.showAll
				: this.props.navigation.state.params.showAll

		const updates =
			this.props.updates !== undefined
				? this.props.updates
				: this.props.navigation.state.params.updates

		const data = showAll ? updates : updates.slice(0, 3)

		return (
			<FlatList
				ItemSeparatorComponent={() => <ListSeparator />}
				ListEmptyComponent={<NoticeView text="No updates." />}
				data={data}
				keyExtractor={this.keyExtractor}
				onRefresh={this.props.onRefresh}
				refreshing={this.props.loading}
				renderItem={this.renderItem}
				style={styles.listContainer}
			/>
		)
	}
}
