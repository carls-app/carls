// @flow
import {clearAsyncStorage} from './storage'
import restart from 'react-native-restart'
import * as icons from '@hawkrives/react-native-alternate-icons'

export async function refreshApp() {
	// Clear AsyncStorage
	await clearAsyncStorage()

	// Reset the app icon
	if ((await icons.getIconName()) !== 'default') {
		await icons.reset()
	}

	// Restart the app
	restart.Restart()
}
