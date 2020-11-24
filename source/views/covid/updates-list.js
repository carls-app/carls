// @flow
import * as React from 'react'
import {StyleSheet, FlatList} from 'react-native'
import * as c from '../components/colors'
import {ListSeparator} from '../components/list'
import {NoticeView} from '../components/notice'
import {UpdatesRow} from './updates-row'
import openUrl from '../components/open-url'
import {ButtonCell} from '../components/cells/button'

import type {TopLevelViewPropsType} from '../types'
import type {UpdateType} from './types'

const styles = StyleSheet.create({
	listContainer: {
		backgroundColor: c.white,
	},
	empty: {
		padding: 20,
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

	onPressSeeAll = () => {
		this.props.navigation.push('CovidUpdatesView', {
			updates: this.props.updates,
			showAll: true,
		})
	}

	onPressUpdate = (url: string) => {
		return openUrl(url)
	}

	renderItem = ({item}: {item: UpdateType}) => (
		<UpdatesRow onPress={this.onPressUpdate} update={item} />
	)

	keyExtractor = (item: UpdateType) => item.link

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

		const NoUpdatesView = () => (
			<NoticeView style={styles.empty} text="No updates." />
		)

		const SeeMoreButton = () => {
			// Hide this button if:
			// * we have no data
			// * we are on the full list of stories
			if (data.length === 0 || showAll === true) {
				return null
			}

			return (
				<ButtonCell onPress={this.onPressSeeAll} title="See all updates…" />
			)
		}

		return (
			<FlatList
				ItemSeparatorComponent={() => <ListSeparator />}
				ListEmptyComponent={<NoUpdatesView />}
				ListFooterComponent={<SeeMoreButton />}
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
