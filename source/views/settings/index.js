// @flow

import * as React from 'react'
import {StyleSheet, ScrollView} from 'react-native'
import {TableView} from 'react-native-tableview-simple'
import {connect} from 'react-redux'
import {type ReduxState} from '../../flux'
import type {TopLevelViewPropsType} from '../types'

import CredentialsLoginSection from './sections/login-credentials'
import OddsAndEndsSection from './sections/odds-and-ends'
import SupportSection from './sections/support'

type ReduxStateProps = {
	loadEasterEggStatus: boolean,
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 20,
	},
})

function SettingsView(props: TopLevelViewPropsType) {
	return (
		<ScrollView
			contentContainerStyle={styles.container}
			keyboardDismissMode="on-drag"
			keyboardShouldPersistTaps="always"
		>
			<TableView>
				{props.loadEasterEggStatus ? <CredentialsLoginSection /> : null}

				<SupportSection navigation={props.navigation} />

				<OddsAndEndsSection navigation={props.navigation} />
			</TableView>
		</ScrollView>
	)
}
SettingsView.navigationOptions = {
	title: 'Settings',
}

function mapStateToProps(state) {
	return {
		loadEasterEggStatus: state.settings.easterEggEnabled
			? state.settings.easterEggEnabled
			: false,
	}
}
export default connect(mapStateToProps)(SettingsView)
