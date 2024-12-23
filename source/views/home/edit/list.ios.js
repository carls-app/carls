// @flow

import * as React from 'react'
import {StyleSheet} from 'react-native'
import {type ReduxState} from '../../../flux'
import {saveHomescreenOrder} from '../../../flux/parts/homescreen'
import {connect} from 'react-redux'
import * as c from '../../components/colors'
import fromPairs from 'lodash/fromPairs'
import {Viewport} from '../../components/viewport'

import SortableList from '@hawkrives/react-native-sortable-list'
import debounce from 'lodash/debounce'

import type {ViewType} from '../../views'
import {allViews} from '../../views'
import {EditHomeRow} from './row'
import {toggleViewDisabled} from '../../../flux/parts/homescreen'

const styles = StyleSheet.create({
	contentContainer: {
		backgroundColor: c.iosLightBackground,
		paddingTop: 10,
		paddingBottom: 20,
		flexDirection: 'column',
		alignItems: 'stretch',
	},
})

type ReduxStateProps = {
	order: string[],
	inactiveViews: string[],
	easterEggEnabled: boolean,
}

type ReduxDispatchProps = {
	onSaveOrder: (string[]) => any,
	onToggleViewDisabled: string => any,
}

type Props = ReduxStateProps & ReduxDispatchProps

class EditHomeView extends React.PureComponent<Props> {
	static navigationOptions = {
		title: 'Edit Home',
	}

	renderRow = (args: {data: ViewType, active: boolean, width: number}) => {
		const {data, active, width} = args
		const enabled = !this.props.inactiveViews.includes(data.view)
		return (
			<EditHomeRow
				active={active}
				data={data}
				isEnabled={enabled}
				onToggle={this.props.onToggleViewDisabled}
				width={width}
			/>
		)
	}

	_saveOrder = (order: string[]) => this.props.onSaveOrder(order)

	onChangeOrder = debounce(this._saveOrder, 100)

	render() {
		let views = this.props.easterEggEnabled
			? allViews
			: allViews.filter(v => !v.easterEgg)

		let objViews = fromPairs(views.map(v => [v.view, v]))

		let order = this.props.easterEggEnabled
			? this.props.order
			: this.props.order.filter(name => objViews[name])

		return (
			<Viewport
				render={({width}) => (
					<SortableList
						contentContainerStyle={[styles.contentContainer, {width}]}
						data={objViews}
						onChangeOrder={this.onChangeOrder}
						order={order}
						renderRow={props => this.renderRow({...props, width})}
					/>
				)}
			/>
		)
	}
}

function mapState(state: ReduxState): ReduxStateProps {
	return {
		order: state.homescreen ? state.homescreen.order : [],
		inactiveViews: state.homescreen ? state.homescreen.inactiveViews : [],
		easterEggEnabled: state.settings ? state.settings.easterEggEnabled : false,
	}
}

function mapDispatch(dispatch): ReduxDispatchProps {
	return {
		onSaveOrder: newOrder => dispatch(saveHomescreenOrder(newOrder)),
		onToggleViewDisabled: view => dispatch(toggleViewDisabled(view)),
	}
}

export const ConnectedEditHomeView = connect(
	mapState,
	mapDispatch,
)(EditHomeView)
