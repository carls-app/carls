// @flow

import * as React from 'react'
import {View, StyleSheet, Animated, Dimensions} from 'react-native'
import * as c from '../components/colors'
import {GrabberBar} from './grabber'
import Interactable from 'react-native-interactable'

type ViewState = 'min' | 'mid' | 'max'

type Props = {
	renderCollapsed: () => React.Node,
	renderExpanded: () => React.Node,
	style?: any,
	size: ViewState,
	onSizeChange: ViewState => any,
}

const screenHeight = Dimensions.get('window').height - 75

export class Overlay extends React.Component<Props> {
	componentWillReceiveProps(nextProps: Props) {
		console.warn(nextProps.size)
		Animated.timing(
			this._deltaY,
			{toValue: this.lookupPosition(nextProps.size)}
		).start()
	}

	positions = {
		max: 40,
		mid: screenHeight - 300,
		min: screenHeight - 100,
	}

	lookupPosition = (size: ViewState) => {
		return this.positions[size]
	}

	_deltaY = new Animated.Value(this.lookupPosition(this.props.size))

	resizeMin = () => this.props.onSizeChange('min')
	resizeMid = () => this.props.onSizeChange('mid')
	resizeMax = () => this.props.onSizeChange('max')

	onSnap = (index: number, id: ViewState) => {
		this.props.onSizeChange(id)
	}

	render() {
		const {
			renderCollapsed,
			renderExpanded,
			style: outerStyle,
			size: viewState,
		} = this.props

		let style = [
			styles.overlay,
			outerStyle,
		]

		let contents = null
		if (viewState === 'min') {
			contents = (
				<React.Fragment>
					<GrabberBar onPress={this.resizeMax} />
					{renderCollapsed()}
				</React.Fragment>
			)
		} else if (viewState === 'mid') {
			contents = (
				<React.Fragment>
					<GrabberBar onPress={this.resizeMax} />
					{renderExpanded()}
				</React.Fragment>
			)
		} else if (viewState === 'max') {
			contents = (
				<React.Fragment>
					<GrabberBar onPress={this.resizeMin} />
					{renderExpanded()}
				</React.Fragment>
			)
		} else {
			;(viewState: empty)
		}

		return (
			<View pointerEvents="box-none" style={styles.panelContainer}>
				{/* this would be a way to darken the background as you move the panel up, but
				    it currently starts out dark – we'd need it to start out transparent. */}
				{/* <Animated.View
					pointerEvents="box-none"
					style={[
						styles.panelContainer,
						{backgroundColor: 'black'},
						{
							opacity: this._deltaY.interpolate({
								inputRange: [0, screenHeight - 100],
								outputRange: [0.5, 0],
								extrapolateRight: 'clamp',
							}),
						},
					]}
				/> */}

				<Interactable.View
					// to play with the darkening bg, uncomment the following line as well
					animatedValueY={this._deltaY}
					boundaries={{top: -300}}
					initialPosition={{y: this.positions[viewState]}}
					onSnap={this.onSnap}
					snapPoints={[
						{id: 'max', y: this.positions.max},
						{id: 'mid', y: this.positions.mid},
						{id: 'min', y: this.positions.min},
					]}
					verticalOnly={true}
				>
					<View style={style}>{contents}</View>
				</Interactable.View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	panelContainer: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	overlay: {
		backgroundColor: c.white,
		height: screenHeight + 300,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		paddingHorizontal: 0,
		paddingTop: 0,
		shadowColor: c.black,
		shadowOffset: {height: -4},
		shadowOpacity: 0.15,
		shadowRadius: 4,
	},
})
