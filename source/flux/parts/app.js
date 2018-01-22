// @flow

type ViewName = string

export const PUSH_VIEW = 'app/PUSH_VIEW'
export const POP_VIEW = 'app/POP_VIEW'
export const ONLINE_STATUS = 'app/ONLINE_STATUS'
export const TICK = 'app/TICK'

export type PushViewAction = {|type: 'app/PUSH_VIEW', payload: ViewName|}
export type PopViewAction = {|type: 'app/POP_VIEW'|}
export type TickAction = {|type: 'app/TICK', payload: Date|}

export type UpdateOnlineStatusAction = {|
	type: 'app/ONLINE_STATUS',
	payload: boolean,
|}
export function updateOnlineStatus(status: boolean): UpdateOnlineStatusAction {
	return {type: ONLINE_STATUS, payload: status}
}

export function tick(): TickAction {
	return {type: TICK, payload: new Date()}
}

type Action = UpdateOnlineStatusAction | PushViewAction | PopViewAction

export type State = {|
	+currentView: ?ViewName,
	+viewStack: Array<ViewName>,
	+isConnected: boolean,
	+now: Date,
|}

function handleViewPop(state: State) {
	return {
		...state,
		viewStack: state.viewStack.slice(0, -1),
		currentView: state.viewStack[state.viewStack.length - 2] || null,
	}
}

function handleViewPush(state: State, action: PushViewAction) {
	return {
		...state,
		viewStack: [...state.viewStack, action.payload],
		currentView: action.payload,
	}
}

const initialState = {
	currentView: null,
	viewStack: [],
	isConnected: false,
	now: new Date(),
}

export function app(state: State = initialState, action: Action) {
	switch (action.type) {
		case PUSH_VIEW:
			return handleViewPush(state, action)
		case POP_VIEW:
			return handleViewPop(state)

		case ONLINE_STATUS:
			return {...state, isConnected: action.payload}

		case TICK:
			return {...state, now: action.payload}

		default:
			return state
	}
}
