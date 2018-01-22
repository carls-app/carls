// @flow
import * as Keychain from 'react-native-keychain'

import * as storage from './storage'
import buildFormData from './formdata'
import {CARLETON_LOGIN} from './financials/urls'

const SIS_LOGIN_CREDENTIAL_KEY = 'stolaf.edu'

export function saveLoginCredentials(username: string, password: string) {
	return Keychain.setInternetCredentials(
		SIS_LOGIN_CREDENTIAL_KEY,
		username,
		password,
	).catch(() => ({}))
}
export function loadLoginCredentials(): Promise<{
	username?: string,
	password?: string,
}> {
	return Keychain.getInternetCredentials(SIS_LOGIN_CREDENTIAL_KEY).catch(
		() => ({}),
	)
}
export function clearLoginCredentials() {
	return Keychain.resetInternetCredentials(SIS_LOGIN_CREDENTIAL_KEY).catch(
		() => ({}),
	)
}

export async function isLoggedIn(): Promise<boolean> {
	const result = await Promise.all([
		storage.getTokenValid(),
		storage.getCredentialsValid(),
	])
	return result.every(result => result === true)
}

export async function performLogin(
	username?: string,
	password?: string,
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
	const loginResult = await fetch(CARLETON_LOGIN, {
		method: 'POST',
		body: form,
		credentials: 'include',
	})
	const page = await loginResult.text()

	if (page.includes('Please Sign In')) {
		await storage.setCredentialsValid(false)
		return false
	}

	await Promise.all([
		saveLoginCredentials(username, password),
		storage.setCredentialsValid(true),
	])

	return true
}
