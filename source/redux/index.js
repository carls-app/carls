// @flow

import {createStore, applyMiddleware, combineReducers, type Store} from 'redux'
import {createLogger} from 'redux-logger'
import reduxPromise from 'redux-promise'
import reduxThunk from 'redux-thunk'

import {settings, type State as SettingsState} from './parts/settings'
import {buildings, type State as BuildingsState} from './parts/buildings'
import {help, type State as HelpState} from './parts/help'

export {init as initRedux} from './init'

export type ReduxState = {
	settings?: SettingsState,
	buildings?: BuildingsState,
	help?: HelpState,
}

export function makeStore(): Store<*, *, *> {
	let aao = combineReducers({
		settings,
		buildings,
		help,
	})

	let middleware = [reduxPromise, reduxThunk]

	if (__DEV__) {
		let logger = createLogger({
			collapsed: true,
			duration: true,
			// avoid logging the (large) course data state twice per action
			stateTransformer: state => ({
				...state,
				courses: {...state.courses, allCourses: '<omitted>'},
			}),
		})
		middleware.push(logger)
	}

	return createStore(aao, applyMiddleware(...middleware))
}
