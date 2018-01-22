// @flow

import React from 'react'
import {FlatList} from 'react-native'
import {connect} from 'react-redux'
import moment from 'moment'

import {updateBusList} from '../../../flux/parts/bus'
import {ListRow, Detail, Title, ListSeparator} from '../../components/list'
import type {XyzBusLine} from './types'
import {TabBarIcon} from '../../components/tabbar-icon'

const blacklist = [/Red Line/, /Blue Line/, /Northfield Express/, /Carls-Go/]

type Props = {
	blacklist: Array<RegExp>,
	routes: Array<XyzBusLine>,
	loading: boolean,
	error: ?Error,
	navigation: {navigate: any => any},
}

export class XyzBusList extends React.PureComponent<Props> {
	static navigationOptions = {
		tabBarLabel: 'Other Buses',
		tabBarIcon: TabBarIcon('bus'),
	}

	renderItem = ({item}: {item: XyzBusLine}) => (
		<XyzBusListRow item={item} navigate={this.props.navigation.navigate} />
	)

	keyExtractor = (item: XyzBusLine) => item.name

	render() {
		return (
			<FlatList
				data={this.props.routes}
				ItemSeparatorComponent={ListSeparator}
				renderItem={this.renderItem}
				keyExtractor={this.keyExtractor}
			/>
		)
	}
}

type RowProps = {item: XyzBusLine, navigate: (...mixed[]) => mixed}

class XyzBusListRow extends React.PureComponent<RowProps> {
	onPress = () =>
		this.props.navigate('XyzBusView', {routeName: this.props.item.name})

	render() {
		const {item} = this.props

		return (
			<ListRow onPress={this.onPress}>
				<Title>{item.name}</Title>
				<Detail>
					{(item.direction ? `${item.direction} to ` : '') + item.dest}
				</Detail>
			</ListRow>
		)
	}
}

const mapStateToProps = state => {
	const today = moment(state.app.now).format('YYYY-MM-DD')

	return {
		...state.bus,
		routes: state.bus.routes.filter(r => {
			const notBlacklisted = !blacklist.find(n => n.test(r.name))

			const hasDepartureSchedule =
				r.departures.length && r.departures.find(d => d.departures.length)

			const hasExceptionForToday =
				r.departures_exceptions &&
				r.departures_exceptions.find(d => d.dates.includes(today))

			return notBlacklisted && (hasDepartureSchedule || hasExceptionForToday)
		}),
	}
}

const mapDispatchToProps = dispatch => ({
	updateBusList: () => dispatch(updateBusList()),
})

export const ConnectedXyzBusList = connect(mapStateToProps, mapDispatchToProps)(
	XyzBusList,
)
