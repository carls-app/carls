// @flow

import * as React from 'react'
import {Cell, Section} from 'react-native-tableview-simple'
import {CellTextField} from '../../components/cells/textfield'
import {LoginButton} from '../components/login-button'
import {
	logInViaCredentials,
	logOutViaCredentials,
	validateLoginCredentials,
	setLoginCredentials,
	type LoginStateType,
} from '../../../flux/parts/settings'
import {type ReduxState} from '../../../flux'
import {connect} from 'react-redux'
import noop from 'lodash/noop'
import {sectionBgColor} from '../../components/colors'

type ReduxStateProps = {
	initialUsername: string,
	initialPassword: string,
	loginState: LoginStateType,
}

type ReduxDispatchProps = {
	logIn: (username: string, password: string) => any,
	logOut: () => any,
	validateCredentials: (username: string, password: string) => any,
	setCredentials: (username: string, password: string) => any,
}

type Props = ReduxStateProps & ReduxDispatchProps

type State = {
	username: string,
	password: string,
}

class CredentialsLoginSection extends React.PureComponent<Props, State> {
	_usernameInput: any
	_passwordInput: any

	state = {
		username: this.props.initialUsername,
		password: this.props.initialPassword,
	}

	focusUsername = () => this._usernameInput.focus()
	focusPassword = () => this._passwordInput.focus()

	logIn = async () => {
		await this.props.logIn(this.state.username, this.state.password)
	}

	logOut = () => {
		this.props.logOut()
	}

	getUsernameRef = ref => (this._usernameInput = ref)
	getPasswordRef = ref => (this._passwordInput = ref)

	onChangeUsername = (text = '') => this.setState(() => ({username: text}))
	onChangePassword = (text = '') => this.setState(() => ({password: text}))

	render() {
		const {loginState} = this.props
		const {username, password} = this.state

		const loading = loginState === 'checking'
		const loggedIn = loginState === 'logged-in'

		return (
			<Section
				footer='Carleton login enables the "meals remaining" feature.'
				header="CARLETON LOGIN"
				sectionTintColor={sectionBgColor}
			>
				{loggedIn ? (
					<Cell title={`Logged in as ${username}.`} />
				) : (
					[
						<CellTextField
							key="username"
							_ref={this.getUsernameRef}
							disabled={loading}
							label="Username"
							onChangeText={this.onChangeUsername}
							onSubmitEditing={this.focusPassword}
							placeholder="username"
							returnKeyType="next"
							secureTextEntry={false}
							value={username}
						/>,

						<CellTextField
							key="password"
							_ref={this.getPasswordRef}
							disabled={loading}
							label="Password"
							onChangeText={this.onChangePassword}
							onSubmitEditing={loggedIn ? noop : this.logIn}
							placeholder="password"
							returnKeyType="done"
							secureTextEntry={true}
							value={password}
						/>,
					]
				)}

				<LoginButton
					disabled={loading || !username || !password}
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
	if (!state.settings) {
		return {
			initialUsername: '',
			initialPassword: '',
			loginState: 'logged-out',
		}
	}

	return {
		initialUsername: state.settings.username,
		initialPassword: state.settings.password,
		loginState: state.settings.loginState,
	}
}

function mapDispatchToProps(dispatch): ReduxDispatchProps {
	return {
		logOut: () => dispatch(logOutViaCredentials()),
		logIn: (username, password) =>
			dispatch(logInViaCredentials({username, password})),
		validateCredentials: (username, password) =>
			dispatch(validateLoginCredentials({username, password})),
		setCredentials: (username, password) =>
			dispatch(setLoginCredentials({username, password})),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CredentialsLoginSection)
