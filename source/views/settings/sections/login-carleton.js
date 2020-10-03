// @flow
import React from 'react'
import {Section} from 'react-native-tableview-simple'
import type {TopLevelViewPropsType} from '../../types'
import {LoginButton} from '../components/login-button'
import {
	logInViaToken,
	logOutViaToken,
	type LoginStateType,
} from '../../../flux/parts/settings'
import {type ReduxState} from '../../../flux'
import {connect} from 'react-redux'

type ReduxStateProps = {
	loginState: LoginStateType,
}

type ReduxDispatchProps = {
	logIn: boolean => any,
	logOut: () => any,
}

type Props = TopLevelViewPropsType & ReduxStateProps & ReduxDispatchProps

type State = {
	loading: boolean,
}

class TokenLoginSection extends React.Component<Props, State> {
	state = {
		loading: false,
	}

	logIn = () => {
		this.props.navigation.navigate('CarletonLoginView', {
			onLoginComplete: this.props.logIn,
		})
	}

	logOut = () => {
		this.props.logOut()
	}

	render() {
		let {loginState} = this.props
		let {loading} = this.state

		const loggedIn = loginState === 'logged-in'

		return (
			<Section
				footer="Carleton login allows OneCard access, which enables Schillers and Dining Dollars."
				header="CARLETON LOGIN"
			>
				<LoginButton
					label="Carleton"
					loading={loading}
					loggedIn={loggedIn}
					onPress={loggedIn ? this.logOut : this.logIn}
				/>
			</Section>
		)
	}
}

function mapStateToProps(state: ReduxState): ReduxStateProps {
	return {
		loggedIn: state.settings ? state.settings.tokenValid : false,
		loginState: state.settings ? state.settings.loginState : 'logged-out',
	}
}

function mapDispatchToProps(dispatch): ReduxDispatchProps {
	return {
		logIn: (s: boolean) => dispatch(logInViaToken(s)),
		logOut: () => dispatch(logOutViaToken()),
	}
}

export const CarletonLoginSection = connect(
	mapStateToProps,
	mapDispatchToProps,
)(TokenLoginSection)
