/**
 * @flow
 * Reducer for app settings
 */

import type {XyzBusLine} from '../../views/transportation/xyz/types'

import values from 'lodash/values'

export const UPDATE_BUS_LIST_START = 'transit/bus/UPDATE_BUS_LIST/start'
export const UPDATE_BUS_LIST_SUCCESS = 'transit/bus/UPDATE_BUS_LIST/success'
export const UPDATE_BUS_LIST_ERROR = 'transit/bus/UPDATE_BUS_LIST/error'

const busUrl = 'https://www.sayleshill.xyz/data/buses.json'
export const fetchBuses = (): {[key: string]: XyzBusLine} => fetchJson(busUrl)

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

const initialState: {
  routes: Array<XyzBusLine>,
  loading: boolean,
  error: ?Error,
} = {
  routes: [],
  loading: false,
  error: null,
}
export function bus(
  state: $Shape<typeof initialState> = initialState,
  action: Object,
) {
  const {payload, type} = action

  switch (type) {
    case UPDATE_BUS_LIST_START: {
      return {...state, loading: true}
    }
    case UPDATE_BUS_LIST_SUCCESS: {
      return {...state, loading: false, routes: values(payload), error: null}
    }
    case UPDATE_BUS_LIST_ERROR: {
      return {...state, loading: false, error: payload}
    }
    default:
      return state
  }
}
