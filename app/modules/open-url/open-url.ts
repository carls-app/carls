import {Linking} from 'react-native'
import * as WebBrowser from 'expo-web-browser'

function genericOpen(url: string): Promise<boolean> {
	return Linking.canOpenURL(url)
		.then((isSupported) => {
			if (!isSupported) {
				console.warn('cannot handle', url)
			}
			return Linking.openURL(url)
		})
		.catch((err) => {
			console.error(err)
		})
}

async function launchBrowser(url: string): Promise<boolean> {
	try {
		const result = await WebBrowser.openBrowserAsync(url, {presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET})
		if (!result) {
			// fall back to opening in Chrome / Browser / platform default
			await genericOpen(url)
		}
	} catch (error) {
		console.warn(`Error when trying to call launchBrowser: ${error}`)
		return false
	}

	return true
}

export async function openUrl(url: string): Promise<boolean> {
	let protocol = /^(.*?):/u.exec(url)

	if (protocol && protocol.length) {
		switch (protocol[1]) {
			case 'tel':
				return genericOpen(url)
			case 'mailto':
				return genericOpen(url)
			default:
				break
		}
	}

	return launchBrowser(url)
}

export function trackedOpenUrl({
	url,
}: {
	url: string
	id?: string
}): Promise<boolean> {
	return openUrl(url)
}

export function canOpenUrl(url: string): boolean {
	// iOS navigates to about:blank when you provide raw HTML to a webview.
	// Android navigates to data:text/html;$stuff (that is, the document you passed) instead.
	if (/^(?:about|data):/u.test(url)) {
		return false
	}
	return true
}
