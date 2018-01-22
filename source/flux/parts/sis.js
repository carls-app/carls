// @flow

import {type ReduxState} from '../index'
import {getBalances, type BalancesShapeType} from '../../lib/financials'

const UPDATE_SCHILLERS = 'sis/UPDATE_SCHILLERS'
const UPDATE_DINING_DOLLARS = 'sis/UPDATE_DINING_DOLLARS'
const UPDATE_PRINT_DOLLARS = 'sis/UPDATE_PRINT_DOLLARS'
const UPDATE_BALANCES_SUCCESS = 'sis/UPDATE_BALANCES_SUCCESS'
const UPDATE_BALANCES_FAILURE = 'sis/UPDATE_BALANCES_FAILURE'
const UPDATE_MEALS_DAILY = 'sis/UPDATE_MEALS_DAILY'
const UPDATE_MEALS_WEEKLY = 'sis/UPDATE_MEALS_WEEKLY'
const UPDATE_MEAL_PLAN = 'sis/UPDATE_MEAL_PLAN'

type UpdateBalancesSuccessAction = {|
	type: 'sis/UPDATE_BALANCES_SUCCESS',
	payload: BalancesShapeType,
|}
type UpdateBalancesFailureAction = {|
	type: 'sis/UPDATE_BALANCES_FAILURE',
	payload: Error,
|}

type UpdateBalancesActions =
	| UpdateBalancesSuccessAction
	| UpdateBalancesFailureAction

type Dispatch<A: Action> = (action: A | Promise<A> | ThunkAction<A>) => any
type GetState = () => ReduxState
type ThunkAction<A: Action> = (dispatch: Dispatch<A>, getState: GetState) => any

export type UpdateBalancesType = ThunkAction<UpdateBalancesActions>
export function updateBalances(
	forceFromServer: boolean = false,
): UpdateBalancesType {
	return async (dispatch, getState) => {
		const state = getState()
		const isConnected = state.app ? state.app.isConnected : false
		const balances = await getBalances(isConnected, forceFromServer)
		if (balances.error) {
			dispatch({type: UPDATE_BALANCES_FAILURE, payload: balances.value})
		} else {
			dispatch({type: UPDATE_BALANCES_SUCCESS, payload: balances.value})
		}
	}
}

type Action = UpdateBalancesActions

export type State = {|
	balancesErrorMessage: ?string,
	schillersBalance: ?string,
	diningBalance: ?string,
	printBalance: ?string,
	mealsRemainingToday: ?string,
	mealsRemainingThisWeek: ?string,
	mealPlanDescription: ?string,
|}
const initialState = {
	balancesErrorMessage: null,
	schillersBalance: null,
	diningBalance: null,
	printBalance: null,
	mealsRemainingToday: null,
	mealsRemainingThisWeek: null,
	mealPlanDescription: null,
}
export function sis(state: State = initialState, action: Action) {
	switch (action.type) {
		case UPDATE_DINING_DOLLARS:
			return {...state, diningBalance: action.payload.balance}
		case UPDATE_SCHILLERS:
			return {...state, schillersBalance: action.payload.balance}
		case UPDATE_PRINT_DOLLARS:
			return {...state, printBalance: action.payload.balance}
		case UPDATE_MEALS_DAILY:
			return {...state, mealsRemainingToday: action.payload.mealsRemaining}
		case UPDATE_MEALS_WEEKLY:
			return {...state, mealsRemainingThisWeek: action.payload.mealsRemaining}
		case UPDATE_MEAL_PLAN:
			return {...state, mealPlanDescription: action.payload.mealPlan}

		case UPDATE_BALANCES_FAILURE:
			return {...state, balancesErrorMessage: action.payload.message}
		case UPDATE_BALANCES_SUCCESS: {
			const p = action.payload
			return {
				...state,
				schillersBalance: p.schillers,
				diningBalance: p.dining,
				printBalance: p.print,
				mealsRemainingThisWeek: p.weekly,
				mealsRemainingToday: p.daily,
				mealPlanDescription: p.plan,
				balancesErrorMessage: null,
			}
		}

		default:
			return state
	}
}
