// @flow
import {parseHtml, cssSelect, getTrimmedTextWithSpaces} from '../html'
import {ONECARD_DASHBOARD} from './urls'
import type {BalancesShapeType} from './types'
import fromPairs from 'lodash/fromPairs'
import * as cache from '../cache'

type BalancesOrErrorType =
	| {error: true, value: Error}
	| {error: false, value: BalancesShapeType}

export async function getBalances(
	isConnected: boolean,
	force?: boolean,
): Promise<BalancesOrErrorType> {
	const {
		schillers,
		dining,
		print,
		daily,
		weekly,
		_isExpired,
		_isCached,
	} = await cache.getBalances()

	if (isConnected && (_isExpired || !_isCached || force)) {
		const balances = await fetchBalancesFromServer()

		// we don't want to cache error responses
		if (balances.error) {
			return balances
		}

		await cache.setBalances(balances.value)
		return balances
	}

	return {
		error: false,
		value: {
			schillers: schillers.value,
			dining: dining.value,
			print: print.value,
			daily: daily.value,
			weekly: weekly.value,
			plan: '',
		},
	}
}

async function fetchBalancesFromServer(): Promise<BalancesOrErrorType> {
	const result = await fetch(ONECARD_DASHBOARD, {credentials: 'include'})
	const page = await result.text()

	if (page.includes('Please Sign In')) {
		return {error: true, value: new Error('not logged in!')}
	}

	const dom = parseHtml(page)

	return parseBalancesFromDom(dom)
}

function parseBalancesFromDom(dom: mixed): BalancesOrErrorType {
	// .accountrow is the name of the row, and it's immediate sibling is a cell with id=value
	let elements = cssSelect('.dashboard > p, .dashboard > ul > li', dom)
		.map(getTrimmedTextWithSpaces)
		.map(rowIntoNamedAmount)
		.filter(Boolean)

	const namedValues = fromPairs(elements)
	const schillers = namedValues.schillers

	const dining = namedValues.dining
	const daily = namedValues.daily
	const weekly = namedValues.weekly

	return {
		error: false,
		value: {
			schillers: !schillers ? null : schillers,
			dining: !dining ? null : dining,
			print: null,
			daily: !daily ? null : daily,
			weekly: !weekly ? null : weekly,
			plan: '',
		},
	}
}

const lookupHash: Map<RegExp, string> = new Map([
	[/schillers/i, 'schillers'],
	[/dining/i, 'dining'],
	[/meals.*day/i, 'daily'],
	[/meals.*week/i, 'weekly'],
])

function rowIntoNamedAmount(row: string): ?[string, string] {
	const chunks = row.split(' ')
	const name = chunks.slice(0, -1).join(' ')
	const amount = chunks[chunks.length - 1]

	// We have a list of regexes that check the row names for keywords.
	// Those keywords are associated with the actual key names.
	for (const [lookup, key] of lookupHash.entries()) {
		if (lookup.test(name)) {
			return [key, amount]
		}
	}
}
