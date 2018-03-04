// @flow

import * as React from 'react'
import {View, StyleSheet} from 'react-native'
import * as c from '../components/colors'
import {GrabberBar} from './grabber'

type ViewState = 'min' | 'mid' | 'max'

type ControlledProps = {|
	initialState: ViewState,
|}

type UncontrolledProps = {|
	size: ViewState,
	onSizeChange: ViewState => any,
|}

type Props = {|
	renderCollapsed: () => React.Node,
	renderExpanded: () => React.Node,
	style: any,
|} & (ControlledProps | UncontrolledProps)

type State = {
	viewState: ViewState,
}

export class Overlay extends React.Component<Props, State> {
	state = {
		viewState: this.props.initialState ? this.props.initialState : 'min',
	}

	resizeMin = () => this.setState(() => ({viewState: 'min'}))
	resizeMid = () => this.setState(() => ({viewState: 'mid'}))
	resizeMax = () => this.setState(() => ({viewState: 'max'}))

	render() {
		const {renderCollapsed, renderExpanded, style: outerStyle} = this.props
		const {viewState} = this.state

		let overlaySize =
			viewState === 'min'
				? styles.overlayMin
				: viewState === 'mid'
					? styles.overlayMid
					: viewState === 'max' ? styles.overlayMax : styles.overlayMin
		let style = [styles.overlay, overlaySize, outerStyle]

		switch (viewState) {
			case 'min':
				return (
					<View style={style}>
						<GrabberBar onPress={this.resizeMax} />
						{renderCollapsed()}
					</View>
				)
			case 'mid':
				return (
					<View style={style}>
						<GrabberBar onPress={this.resizeMax} />
						{renderExpanded()}
					</View>
				)
			case 'max':
				return (
					<View style={style}>
						<GrabberBar onPress={this.resizeMin} />
						{renderExpanded()}
					</View>
				)
			default:
				;(viewState: empty)
		}
	}
}

const styles = StyleSheet.create({
	overlay: {
		backgroundColor: c.white,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		bottom: 0,
		left: 0,
		paddingHorizontal: 0,
		paddingTop: 0,
		position: 'absolute',
		right: 0,
		shadowColor: c.black,
		shadowOffset: {height: -4},
		shadowOpacity: 0.15,
		shadowRadius: 4,
		zIndex: 2,
	},
	overlayMin: {
		height: 80,
	},
	overlayMid: {
		height: 200,
	},
	overlayMax: {
		top: 20,
	},
})
