// @flow
import * as React from 'react'
import {ScrollView, StyleSheet} from 'react-native'
import {type FilterType} from './types'
import {type ReduxState} from '../../../flux'
import {FilterSection} from './section'
import {TableView} from 'react-native-tableview-simple'
import {connect} from 'react-redux'
import get from 'lodash/get'

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})

type NavigationState = {
	params: {
		title: string,
		pathToFilters: string[],
		initialFilters?: Array<FilterType>,
		onChange: (x: FilterType[]) => any,
		onLeave?: (filters: FilterType[]) => any,
	},
}

type ReactProps = {
	navigation: {
		state: NavigationState,
	},
}

type ReduxStateProps = {
	initialReduxFilters: FilterType[],
}

type Props = ReactProps & ReduxStateProps

type State = {
	filters: Array<FilterType>,
}

class FilterViewComponent extends React.Component<Props, State> {
	static navigationOptions = ({navigation}: Props) => {
		return {
			title: navigation.state.params.title,
		}
	}

	static getDerivedStateFromProps(nextProps: Props) {
		return {
			filters: nextProps.initialReduxFilters || nextProps.initialFilters,
		}
	}

	state = {
		filters: [],
	}

	componentWillUnmount() {
		if (this.props.navigation.state.params.onLeave) {
			this.props.navigation.state.params.onLeave(this.state.filters)
		}
	}

	onFilterChanged = (filter: FilterType) => {
		const {onChange} = this.props.navigation.state.params

		// replace the changed filter in the array, maintaining position
		let result = this.state.filters.map(
			f => (f.key !== filter.key ? f : filter),
		)

		// update the in-component filters, then update the outside world
		this.setState(() => ({filters: result}), () => onChange(result))
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<TableView>
					{this.state.filters.map(filter => (
						<FilterSection
							key={filter.key}
							filter={filter}
							onChange={this.onFilterChanged}
						/>
					))}
				</TableView>
			</ScrollView>
		)
	}
}

function mapState(state: ReduxState, actualProps: ReactProps): ReduxStateProps {
	let pathToFilters = actualProps.navigation.state.params.pathToFilters

	if (!pathToFilters) {
		return {
			initialReduxFilters: [],
		}
	}

	return {
		initialReduxFilters: get(state, pathToFilters, []),
	}
}

export const ConnectedFilterView = connect(mapState)(FilterViewComponent)
