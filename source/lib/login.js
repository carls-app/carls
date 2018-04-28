// @flow
import {
	setInternetCredentials,
	getInternetCredentials,
	resetInternetCredentials,
} from 'react-native-keychain'

import buildFormData from './formdata'
import {CARLETON_LOGIN} from './financials/urls'

const SIS_LOGIN_KEY = 'stolaf.edu'

const empty = () => ({})

export type Credentials = {username: string, password: string}
export type MaybeCredentials = {username?: string, password?: string}

export function saveLoginCredentials({username, password}: Credentials) {
	return setInternetCredentials(SIS_LOGIN_KEY, username, password).catch(empty)
}
export function loadLoginCredentials(): Promise<MaybeCredentials> {
	return getInternetCredentials(SIS_LOGIN_KEY).catch(empty)
}
export function clearLoginCredentials() {
	return resetInternetCredentials(SIS_LOGIN_KEY).catch(empty)
}

export async function performLogin(
	{username, password}: Credentials,
	{attempts = 0}: {attempts: number} = {},
): Promise<boolean> {
	if (!username || !password) {
		return false
	}

	// we have to fetch the page once so that we get the random cookie that
	// carleton uses to make sure cookies are enabled.
	// we don't need to _do_ anything with it, since fetch() handles
	// re-sending it to the server for us.
	await fetch(CARLETON_LOGIN, {method: 'GET', credentials: 'include'})

	const form = buildFormData({username, password})

	let loginResult = null
	try {
		loginResult = await fetch(CARLETON_LOGIN, {
			method: 'POST',
			body: form,
			credentials: 'include',
		})
	} catch (err) {
		const networkFailure = err.message === 'Network request failed'
		if (networkFailure && attempts > 0) {
			// console.log(`login failed; trying ${attempts - 1} more time(s)`)
			return performLogin({username, password}, {attempts: attempts - 1})
		}
		return false
	}

	const page = await loginResult.text()

	if (page.includes('Password')) {
		return false
	}

	await saveLoginCredentials({username, password})

	return true
}

export async function checkToken() {
	const result = await fetch(CARLETON_LOGIN, {credentials: 'include'})
	const page = await result.text()

	if (page.includes('Please Sign In')) {
		return false
	}

	return true
}
