// @flow

import * as React from 'react'
import {StyleSheet, ScrollView} from 'react-native'
import {TableView} from 'react-native-tableview-simple'
import type {TopLevelViewPropsType} from '../types'

import CarletonLoginSection from './sections/login-credentials'
import OddsAndEndsSection from './sections/odds-and-ends'
import SupportSection from './sections/support'

//export {CarletonLoginView} from './login'

const styles = StyleSheet.create({
	container: {
		paddingVertical: 20,
	},
})

export default function SettingsView(props: TopLevelViewPropsType) {
	return (
		<ScrollView
			contentContainerStyle={styles.container}
			keyboardDismissMode="on-drag"
			keyboardShouldPersistTaps="always"
		>
			<TableView>
				<CarletonLoginSection navigation={props.navigation} />

				<SupportSection navigation={props.navigation} />

				<OddsAndEndsSection navigation={props.navigation} />
			</TableView>
		</ScrollView>
	)
}
SettingsView.navigationOptions = {
	title: 'Settings',
}
