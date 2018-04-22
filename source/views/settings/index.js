// @flow

import * as React from 'react'
import {StyleSheet, ScrollView} from 'react-native'
import {TableView} from 'react-native-tableview-simple'
import {connect} from 'react-redux'
import type {ReduxState} from '../../flux'
import type {TopLevelViewPropsType} from '../types'

import CredentialsLoginSection from './sections/login-credentials'
import OddsAndEndsSection from './sections/odds-and-ends'
import SupportSection from './sections/support'

type ReduxStateProps = {
	easterEggEnabled: boolean,
}

type ReduxDispatchProps = {
	onShowEasterEgg: (e: boolean) => any,
}

type Props = TopLevelViewPropsType & ReduxStateProps & ReduxDispatchProps

const styles = StyleSheet.create({
	container: {
		paddingVertical: 20,
	},
})

function SettingsView(props: Props) {
	return (
		<ScrollView
			contentContainerStyle={styles.container}
			keyboardDismissMode="on-drag"
			keyboardShouldPersistTaps="always"
		>
			<TableView>
				{props.easterEggEnabled ? <CredentialsLoginSection /> : null}

				<SupportSection navigation={props.navigation} />

				<OddsAndEndsSection navigation={props.navigation} />
			</TableView>
		</ScrollView>
	)
}
SettingsView.navigationOptions = {
	title: 'Settings',
}

function mapState(state: ReduxState): ReduxStateProps {
	return {
		easterEggEnabled: state.settings ? state.settings.easterEggEnabled : false,
	}
}

export default connect(mapState)(SettingsView)
