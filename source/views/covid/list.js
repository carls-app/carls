// @flow

import * as React from 'react'
import {StyleSheet, ScrollView} from 'react-native'
import {UpdatesContainer} from './updates-container'
import {Card} from '../components/card'
import {Button} from '../components/button'
import {openUrl} from '../components/open-url'
import {buttons} from './data'

import type {TopLevelViewPropsType} from '../types'

type Props = TopLevelViewPropsType

export default class CovidView extends React.Component<Props> {
	static navigationOptions = {
		title: 'Covid Response',
	}

	render() {
		function handleButtonPress(btn) {
			return openUrl(btn.destination)
		}

		return (
			<ScrollView contentContainerStyle={styles.container}>
				<Card header="COVID-19 Resources" style={styles.card}>
					{buttons.map(btn => {
						const {title} = btn
						return (
							<Button
								key={title}
								onPress={() => handleButtonPress(btn)}
								title={title}
							/>
						)
					})}
				</Card>

				<Card header="Campus Updates on COVID-19" style={styles.card}>
					<UpdatesContainer
						navigation={this.props.navigation}
						title="Campus Updates"
					/>
				</Card>
			</ScrollView>
		)
	}
}

export const styles = StyleSheet.create({
	container: {
		paddingTop: 10,
	},
	card: {
		paddingHorizontal: 20,
		paddingVertical: 15,
		marginHorizontal: 10,
		marginBottom: 10,
	},
})
