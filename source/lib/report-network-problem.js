// @flow

import bugsnag from '../bugsnag'

export function reportNetworkProblem(err: Error) {
	bugsnag.notify(err)
	console.warn(err)
}
