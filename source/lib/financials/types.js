// @flow
export type BalancesShapeType = {
	schillers: ?string,
	dining: ?string,
	print: ?string,
	weekly: ?string,
	daily: ?string,
	plan: ?string,
	guestSwipes: ?string,
}

export type MealPlanInfoType = {
	plan: ?string,
	leftDaily: ?string,
	leftWeekly: ?string,
}

export type AccountBalanceType = {
	account: string,
	numeric: number,
	formatted: string,
}

export type OleCardBalancesType = {
	data: {
		accounts: Array<AccountBalanceType>,
		meals: ?MealPlanInfoType,
	},
	error: ?string,
}
