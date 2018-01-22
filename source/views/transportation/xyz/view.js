// @flow

import React from 'react'
import {connect} from 'react-redux'
import {View, Text, StyleSheet, Platform, SectionList} from 'react-native'
import head from 'lodash/head'
import last from 'lodash/last'
import moment from 'moment-timezone'
import * as c from '../../components/colors'
import {Separator} from '../../components/separator'
import {ListRow, ListSectionHeader, Title} from '../../components/list'
import {updateBusList} from '../../../flux/parts/bus'
import {BusView} from '../bus'
import {BusStopRow} from '../bus/components/bus-stop-row'
import type {XyzBusLine} from './types'

const TIME_FORMAT = 'H:mm'
const TIMEZONE = 'America/Winnipeg'

import {data as defaultBusLines} from '../../../../docs/bus-times.json'
const defaultBusNames = defaultBusLines.map(l => l.line)

const styles = StyleSheet.create({
	separator: {
		marginLeft: 45,
		// erase the gap in the bar caused by the separators' block-ness
		marginTop: -1,
	},
})

function makeSubtitle(now, moments) {
	if (now.isBefore(head(moments))) {
		return `Starts ${now
			.clone()
			.seconds(0)
			.to(head(moments))}`
	} else if (now.isAfter(last(moments))) {
		return 'Over for Today'
	}

	return 'Running'
}

const parseTime = (now: moment) => time => {
	return (
		moment
			// interpret in Central time
			.tz(time, TIME_FORMAT, true, TIMEZONE)
			// and set the date to today
			.dayOfYear(now.dayOfYear())
	)
}

type Props = {
	navigation: any,
	routeName: string,
	route?: XyzBusLine,
	loading: boolean,
	error: ?Error,
	now: moment,
	updateBusList: () => mixed,
}

export class XyzBusView extends React.PureComponent<Props> {
	componentWillMount() {
		this.props.updateBusList()
	}

	checkException = (today: string) => ({dates}: {dates: string[]}) =>
		dates.includes(today)
	checkNormal = (dayofweek: string) => ({days}: {days: string[]}) =>
		days.includes(dayofweek)

	getScheduleForNow = (route: XyzBusLine, now: moment) => {
		// the exceptions lists serve two purposes:
		// 1. to add extra times for a given day
		// 2. to say that the route isn't running on a given day

		const today = now.format('YYYY-MM-DD')

		const exceptionalSchedule =
			route.departures_exceptions &&
			route.departures_exceptions.find(this.checkException(today))

		if (exceptionalSchedule) {
			// if there is an exception for today, and there are no times given, then
			// the route isn't running.
			if (exceptionalSchedule.departures.length === 0) {
				return null
			}

			// now we know that there are times for today's exception
			return exceptionalSchedule.departures
		}

		// const dow = now.format('ddd').toLowerCase()
		// const normalSchedule = route.departures.find(this.checkNormal(dow))
		const normalSchedule = route.departures[0]

		// if today isn't in the list of days for which the schedule applies,
		// then the route isn't running
		if (!normalSchedule) {
			return null
		}

		return normalSchedule.departures
	}

	keyExtractor = (item: moment, i: number) => i.toString()

	render() {
		const {route, now, routeName, loading} = this.props

		console.log(route)

		if (defaultBusNames.includes(routeName)) {
			return <BusView line={routeName} navigation={this.props.navigation} />
		}

		if (!route && loading) {
			return (
				<View>
					<Text>Loading</Text>
				</View>
			)
		}

		const androidColor = Platform.OS === 'android' ? {color: c.steelBlue} : null

		if (!route) {
			return (
				<View>
					<ListSectionHeader title={routeName} titleStyle={androidColor} />
					<ListRow>
						<Title>
							<Text>No route found.</Text>
						</Title>
					</ListRow>
				</View>
			)
		}

		const schedule = this.getScheduleForNow(route, now)
		if (!schedule) {
			return (
				<View>
					<ListSectionHeader title={route.name} titleStyle={androidColor} />
					<ListRow>
						<Title>
							<Text>This line is not running today.</Text>
						</Title>
					</ListRow>
				</View>
			)
		}

		const moments = schedule.map(parseTime(now))

		const sections = [{data: moments, title: route.name}]

		return (
			<SectionList
				ItemSeparatorComponent={BusListSeparator}
				sections={sections}
				renderSectionHeader={() => (
					<ListSectionHeader
						title={route.name}
						subtitle={makeSubtitle(now, moments)}
						titleStyle={androidColor}
					/>
				)}
				keyExtractor={this.keyExtractor}
				renderItem={({item}) => (
					<BusStopRow
						stop={{name: item.format('h:mma'), departures: []}}
						departureIndex={0}
						now={now}
						barColor={c.steelBlue}
						currentStopColor={c.midnightBlue}
						isFirstRow={false}
						isLastRow={false}
						status="running"
					/>
				)}
			/>
		)
	}
}

const BusListSeparator = () => <Separator style={styles.separator} />

const mapStateToProps = (state, {routeName, navigation}) => {
	routeName = routeName || (navigation && navigation.state.params.routeName)
	return {
		loading: state.bus.loading,
		error: state.bus.error,
		route: state.bus.routes.find(
			({name}) =>
				routeName && routeName.test ? routeName.test(name) : routeName === name,
		),
		now: moment(state.app.now),
	}
}

const mapDispatchToProps = dispatch => ({
	updateBusList: () => dispatch(updateBusList()),
})

export const ConnectedXyzBusView = connect(mapStateToProps, mapDispatchToProps)(
	XyzBusView,
)
