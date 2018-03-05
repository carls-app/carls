// @flow

import * as React from 'react'
import {View, StyleSheet, Animated, Dimensions} from 'react-native'
import * as c from '../components/colors'
import {GrabberBar} from './grabber'
import Interactable from 'react-native-interactable'

type ViewState = 'min' | 'mid' | 'max'

type Props = {
	children: React.Node,
	style?: any,
	size: ViewState,
	onSizeChange: ViewState => any,
}

const screenHeight = Dimensions.get('window').height - 75

export class Overlay extends React.Component<Props> {
	componentWillReceiveProps(nextProps: Props) {
		if (this.props.size !== nextProps.size) {
			if (!this._view) {
				return
			}

			this._view.snapTo({index: this.positionsOrder.indexOf(nextProps.size)})
		}
	}

	positionsOrder = ['max', 'mid', 'min']
	positions = {
		max: 40,
		mid: screenHeight - 300,
		min: screenHeight - 58,
	}

	lookupPosition = (size: ViewState) => this.positions[size]
	resizeMin = () => this.props.onSizeChange('min')
	resizeMid = () => this.props.onSizeChange('mid')
	resizeMax = () => this.props.onSizeChange('max')

	_view: any = null
	_deltaY = new Animated.Value(this.lookupPosition(this.props.size))

	onSnap = (ev: {nativeEvent: {index: number, id: ViewState}}) => {
		this.props.onSizeChange(ev.nativeEvent.id)
	}

	render() {
		const {style: outerStyle, size: viewState} = this.props

		let style = [styles.overlay, outerStyle]

		return (
			<View pointerEvents="box-none" style={styles.panelContainer}>
				{/* this would be a way to darken the background as you move the panel up, but
				    it currently starts out dark – we'd need it to start out transparent. */}
				{/* <Animated.View
					pointerEvents="box-none"
					style={[
						styles.overlayBackground,
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
					ref={ref => (this._view = ref)}
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
					<View style={style}>
						<GrabberBar />
						{this.props.children}
					</View>
				</Interactable.View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	panelContainer: StyleSheet.absoluteFillObject,
	// overlayBackground: {
	// 	...StyleSheet.absoluteFillObject,
	// 	backgroundColor: c.black,
	// },
	overlay: {
		backgroundColor: c.white,
		height: screenHeight + 300,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		shadowColor: c.black,
		shadowOffset: {height: -4},
		shadowOpacity: 0.15,
		shadowRadius: 4,
	},
})
