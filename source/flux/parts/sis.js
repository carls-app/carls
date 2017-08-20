/**
 * @flow
 * Reducer for app settings
 */

import {getBalances} from '../../lib/financials'

import {loadAllCourses} from '../../lib/courses'

export const UPDATE_BALANCES_START = 'sis/UPDATE_BALANCES/start'
export const UPDATE_BALANCES_SUCCESS = 'sis/UPDATE_BALANCES/success'
export const UPDATE_BALANCES_ERROR = 'sis/UPDATE_BALANCES/error'
export const UPDATE_COURSES = 'sis/UPDATE_COURSES'

export function updateBalances(forceFromServer: boolean = false) {
  return async (dispatch: any => any, getState: any) => {
    dispatch({type: UPDATE_BALANCES_START})
    const state = getState()
    const balances = await getBalances(state.app.isConnected, forceFromServer)
    if (balances.error) {
      dispatch({type: UPDATE_BALANCES_ERROR, payload: balances.error})
    } else {
      dispatch({type: UPDATE_BALANCES_SUCCESS, payload: balances.value})
    }
  }
}

export function updateCourses(forceFromServer: boolean = false) {
  return async (dispatch: any => any, getState: any) => {
    const state = getState()
    const courses = await loadAllCourses(state.app.isConnected, forceFromServer)
    dispatch({
      type: UPDATE_COURSES,
      error: courses.error,
      payload: courses.value,
    })
  }
}

const initialBalancesState = {
  message: null,
  flex: null,
  ole: null,
  print: null,
  daily: null,
  weekly: null,
  loading: false,
}
function balances(state = initialBalancesState, action) {
  const {type, payload} = action

  switch (type) {
    case UPDATE_BALANCES_START: {
      return {...state, loading: true}
    }
    case UPDATE_BALANCES_ERROR: {
      return {...state, message: payload.message, loading: false}
    }

    case UPDATE_BALANCES_SUCCESS: {
      return {
        ...state,
        ...payload,
        loading: false,
        message: null,
      }
    }

    default:
      return state
  }
}

const initialCoursesState = {}
function courses(state = initialCoursesState, action) {
  const {type, payload} = action

  switch (type) {
    case UPDATE_COURSES:
      return {...payload}

    default:
      return state
  }
}

const initialSisPageState = {}
export function sis(state: Object = initialSisPageState, action: Object) {
  return {
    balances: balances(state.balances, action),
    courses: courses(state.courses, action),
  }
}
