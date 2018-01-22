// @flow

import type {XyzBusLine} from '../../views/transportation/xyz/types'

import values from 'lodash/values'

export const UPDATE_BUS_LIST_START = 'transit/bus/UPDATE_BUS_LIST/start'
export const UPDATE_BUS_LIST_SUCCESS = 'transit/bus/UPDATE_BUS_LIST/success'
export const UPDATE_BUS_LIST_ERROR = 'transit/bus/UPDATE_BUS_LIST/error'

type BusDataShape = {[key: string]: XyzBusLine}

export type UpdateBusListStartAction = {|
	type: 'transit/bus/UPDATE_BUS_LIST/start',
|}
export type UpdateBusListSuccessAction = {|
	type: 'transit/bus/UPDATE_BUS_LIST/success',
	payload: BusDataShape,
|}
export type UpdateBusListErrorAction = {|
	type: 'transit/bus/UPDATE_BUS_LIST/error',
	payload: Error,
|}

const busUrl = 'https://www.sayleshill.xyz/data/buses.json'
export const fetchBuses = (): Promise<BusDataShape> => fetchJson(busUrl)

export function updateBusList() {
	return async (dispatch: any => any) => {
		dispatch({type: UPDATE_BUS_LIST_START})
		try {
			const busses = await fetchBuses()
			dispatch({type: UPDATE_BUS_LIST_SUCCESS, payload: busses})
		} catch (err) {
			dispatch({type: UPDATE_BUS_LIST_ERROR, payload: err})
		}
	}
}

type Action =
	| UpdateBusListStartAction
	| UpdateBusListSuccessAction
	| UpdateBusListErrorAction

export type State = {|
	routes: Array<XyzBusLine>,
	loading: boolean,
	error: ?Error,
|}

const initialState = {
	routes: [],
	loading: false,
	error: null,
}

export function bus(state: State = initialState, action: Action) {
	switch (action.type) {
		case UPDATE_BUS_LIST_START: {
			return {...state, loading: true}
		}
		case UPDATE_BUS_LIST_SUCCESS: {
			return {
				...state,
				loading: false,
				routes: values(action.payload),
				error: null,
			}
		}
		case UPDATE_BUS_LIST_ERROR: {
			return {...state, loading: false, error: action.payload}
		}

		default:
			return state
	}
}
