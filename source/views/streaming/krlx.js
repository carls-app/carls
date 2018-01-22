// @flow

import React from 'react'
import {
	StyleSheet,
	View,
	ScrollView,
	Text,
	Dimensions,
	Image,
} from 'react-native'
import * as c from '../components/colors'
import {TabBarIcon} from '../components/tabbar-icon'
import {trackedOpenUrl} from '../components/open-url'
import {ActionButton} from './radio/buttons'

const image = require('../../../images/streaming/krlx.png')

type Viewport = {width: number, height: number}

type Props = {}

type State = {
	viewport: Viewport,
}

export class KRLXView extends React.PureComponent<Props, State> {
	static navigationOptions = {
		tabBarLabel: 'KRLX',
		tabBarIcon: TabBarIcon('radio'),
	}

	state = {
		viewport: Dimensions.get('window'),
	}

	componentWillMount() {
		Dimensions.addEventListener('change', this.handleResizeEvent)
	}

	componentWillUnmount() {
		Dimensions.removeEventListener('change', this.handleResizeEvent)
	}

	handleResizeEvent = (event: {window: {width: number, height: number}}) => {
		this.setState(() => ({viewport: event.window}))
	}

	openWebsite = () => {
		trackedOpenUrl({url: 'http://live.krlx.org', id: 'krlx-stream'})
	}

	render() {
		const sideways = this.state.viewport.width > this.state.viewport.height

		const logoWidth = Math.min(
			this.state.viewport.width / 1.5,
			this.state.viewport.height / 1.75,
		)

		const logoSize = {
			width: logoWidth,
			height: logoWidth,
		}

		return (
			<ScrollView
				contentContainerStyle={[styles.root, sideways && landscape.root]}
			>
				<View style={[styles.logoWrapper, sideways && landscape.logoWrapper]}>
					<Image
						resizeMode="contain"
						source={image}
						style={[styles.logo, logoSize]}
					/>
				</View>

				<View style={styles.container}>
					<View style={styles.titleWrapper}>
						<Text selectable={true} style={styles.heading}>
							Carleton College Radio
						</Text>

						<Text selectable={true} style={styles.subheading}>
							88.1 KRLX-FM is the radio station at Carleton College. Independent
							and completely student-run since its origin in 1948, KRLX
							broadcasts 24 hours a day during the academic year, with over 200
							student participants each term.
						</Text>
					</View>

					<ActionButton
						icon="ios-play"
						onPress={this.openWebsite}
						text="Listen to KRLX"
					/>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	root: {
		flexDirection: 'column',
		alignItems: 'stretch',
		justifyContent: 'space-between',
		padding: 20,
	},
	container: {
		alignItems: 'center',
		flex: 1,
		marginTop: 20,
		marginBottom: 20,
	},
	logoWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	logo: {
		borderRadius: 6,
		borderColor: c.kstoSecondaryDark,
		borderWidth: 3,
	},
	titleWrapper: {
		alignItems: 'center',
		marginBottom: 20,
	},
	heading: {
		color: c.kstoPrimaryDark,
		fontWeight: '600',
		fontSize: 28,
		textAlign: 'center',
	},
	subheading: {
		marginTop: 5,
		color: c.kstoPrimaryDark,
		fontWeight: '300',
		fontSize: 28,
		textAlign: 'center',
	},
})

const landscape = StyleSheet.create({
	root: {
		flex: 1,
		padding: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	logoWrapper: {
		flex: 0,
	},
})
