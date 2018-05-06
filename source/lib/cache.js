// @flow
import {AsyncStorage} from 'react-native'
import moment from 'moment'

type BaseCacheResultType<T> = {
	isExpired: boolean,
	isCached: boolean,
	value: ?T,
}

type CacheResultType<T> = Promise<BaseCacheResultType<T>>

function needsUpdate(time: Date, [count, unit]: [number, string]): boolean {
	return moment(time).isBefore(moment().subtract(count, unit))
}

function annotateCacheEntry(stored) {
	// if nothing's stored, note that it's expired and not cached
	if (stored === null || stored === undefined) {
		return {isCached: false, isExpired: true, value: null}
	}

	// migration from old storage
	if (
		!('dateCached' in stored && 'timeToCache' in stored && 'value' in stored)
	) {
		return {isCached: true, isExpired: true, value: stored}
	}

	// handle AsyncStorage entries that aren't caches, like the homescreen order
	if (!stored.timeToCache) {
		return {isCached: true, isExpired: false, value: stored.value}
	}

	const date = new Date(stored.dateCached)
	const isExpired = needsUpdate(date, stored.timeToCache)
	return {isCached: true, isExpired, value: stored.value}
}

/// MARK: Utilities

function setItem(key: string, value: any, cacheTime?: [number, string]) {
	const dataToStore = {
		dateCached: new Date().toUTCString(),
		timeToCache: cacheTime,
		value: value,
	}
	return AsyncStorage.setItem(`aao:${key}`, JSON.stringify(dataToStore))
}
function getItem(key: string): CacheResultType<any> {
	return AsyncStorage.getItem(`aao:${key}`).then(stored =>
		annotateCacheEntry(JSON.parse(stored)),
	)
}

/// MARK: courses

const studentNumberKey = 'courses:student-number'
const studentNumberCacheTime = [1, 'week']
export function setStudentNumber(idNumbers: number) {
	return setItem(studentNumberKey, idNumbers, studentNumberCacheTime)
}
export function getStudentNumber(): CacheResultType<number> {
	return getItem(studentNumberKey)
}

const coursesKey = 'courses'
const coursesCacheTime = [1, 'hour']
import {type CoursesByTermType} from './courses/types'
export function setAllCourses(courses: CoursesByTermType) {
	return setItem(coursesKey, courses, coursesCacheTime)
}
export function getAllCourses(): CacheResultType<?CoursesByTermType> {
	return getItem(coursesKey)
}

/// MARK: Financials

const flexBalanceKey = 'financials:flex'
const flexBalanceCacheTime = [5, 'minutes']
export function setFlexBalance(balance: ?string) {
	return setItem(flexBalanceKey, balance, flexBalanceCacheTime)
}
export function getFlexBalance(): CacheResultType<?string> {
	return getItem(flexBalanceKey)
}

const oleBalanceKey = 'financials:ole'
const oleBalanceCacheTime = [5, 'minutes']
export function setOleBalance(balance: ?string) {
	return setItem(oleBalanceKey, balance, oleBalanceCacheTime)
}
export function getOleBalance(): CacheResultType<?string> {
	return getItem(oleBalanceKey)
}

const schillersBalanceKey = 'financials:schillers'
const schillersBalanceCacheTime = [5, 'minutes']
export function setSchillersBalance(balance: ?string) {
	return setItem(schillersBalanceKey, balance, schillersBalanceCacheTime)
}
export function getSchillersBalance(): CacheResultType<?string> {
	return getItem(schillersBalanceKey)
}

const diningBalanceKey = 'financials:diningdollars'
const diningBalanceCacheTime = [5, 'minutes']
export function setDiningBalance(balance: ?string) {
	return setItem(diningBalanceKey, balance, diningBalanceCacheTime)
}
export function getDiningBalance(): CacheResultType<?string> {
	return getItem(diningBalanceKey)
}

const printBalanceKey = 'financials:print'
const printBalanceCacheTime = [5, 'minutes']
export function setPrintBalance(balance: ?string) {
	return setItem(printBalanceKey, balance, printBalanceCacheTime)
}
export function getPrintBalance(): CacheResultType<?string> {
	return getItem(printBalanceKey)
}

const dailyMealsKey = 'meals:daily'
const dailyMealsCacheTime = [5, 'minutes']
export function setDailyMealInfo(dailyMeals: ?string) {
	return setItem(dailyMealsKey, dailyMeals, dailyMealsCacheTime)
}
export function getDailyMealInfo(): CacheResultType<?string> {
	return getItem(dailyMealsKey)
}

const weeklyMealsKey = 'meals:weekly'
const weeklyMealsCacheTime = [5, 'minutes']
export function setWeeklyMealInfo(weeklyMeals: ?string) {
	return setItem(weeklyMealsKey, weeklyMeals, weeklyMealsCacheTime)
}
export function getWeeklyMealInfo(): CacheResultType<?string> {
	return getItem(weeklyMealsKey)
}

const mealPlanKey = 'meals:plan'
const mealPlanCacheTime = [5, 'minutes']
export function setMealPlanInfo(mealPlanName: ?string) {
	return setItem(mealPlanKey, mealPlanName, mealPlanCacheTime)
}
export function getMealPlanInfo(): CacheResultType<?string> {
	return getItem(mealPlanKey)
}

const guestSwipesKey = 'meals:plan'
const guestSwipesCacheTime = [5, 'minutes']
export function setGuestSwipes(guestSwipes: ?string) {
	return setItem(guestSwipesKey, guestSwipes, guestSwipesCacheTime)
}
export function getGuestSwipes(): CacheResultType<?string> {
	return getItem(guestSwipesKey)
}

type BalancesInputType = {
	schillers: ?string,
	dining: ?string,
	print: ?string,
	daily: ?string,
	weekly: ?string,
	guestSwipes: ?string,
}
export function setBalances({
	schillers,
	dining,
	print,
	daily,
	weekly,
	guestSwipes,
}: BalancesInputType) {
	return Promise.all([
		setSchillersBalance(schillers),
		setDiningBalance(dining),
		setPrintBalance(print),
		setDailyMealInfo(daily),
		setWeeklyMealInfo(weekly),
		setGuestSwipes(guestSwipes),
	])
}

type BalancesOutputType = {
	schillers: BaseCacheResultType<?string>,
	dining: BaseCacheResultType<?string>,
	print: BaseCacheResultType<?string>,
	daily: BaseCacheResultType<?string>,
	weekly: BaseCacheResultType<?string>,
	guestSwipes: BaseCacheResultType<?string>,
	_isExpired: boolean,
	_isCached: boolean,
}
export async function getBalances(): Promise<BalancesOutputType> {
	const [schillers, dining, print, daily, weekly, guestSwipes] = await Promise.all([
		getSchillersBalance(),
		getDiningBalance(),
		getPrintBalance(),
		getDailyMealInfo(),
		getWeeklyMealInfo(),
		getGuestSwipes(),
	])

	const _isExpired =
		schillers.isExpired ||
		dining.isExpired ||
		print.isExpired ||
		daily.isExpired ||
		weekly.isExpired
	const _isCached =
		schillers.isCached ||
		dining.isCached ||
		print.isCached ||
		daily.isCached ||
		weekly.isCached

	return {schillers, dining, print, daily, weekly, guestSwipes, _isExpired, _isCached}
}

/// MARK: Help tools

const helpToolsKey = 'help:tools'
const helpToolsCacheTime = [1, 'hour']
import {type ToolOptions} from '../views/help/types'
const {data: helpData} = require('../../docs/help.json')
export function setHelpTools(tools: Array<ToolOptions>) {
	return setItem(helpToolsKey, tools, helpToolsCacheTime)
}
export function getHelpTools(): CacheResultType<?Array<ToolOptions>> {
	return getItem(helpToolsKey)
}
function fetchHelpToolsBundled(): Promise<Array<ToolOptions>> {
	return Promise.resolve(helpData)
}
function fetchHelpToolsRemote(): Promise<{data: Array<ToolOptions>}> {
	return fetchJson('https://carleton.api.frogpond.tech/v1/tools/help')
}
export async function fetchHelpTools(
	isOnline: boolean,
): Promise<Array<ToolOptions>> {
	const cachedValue = await getHelpTools()

	if (process.env.NODE_ENV === 'development') {
		return fetchHelpToolsBundled()
	}

	if (!isOnline) {
		if (cachedValue.isCached && cachedValue.value) {
			return cachedValue.value
		}
		return fetchHelpToolsBundled()
	}

	if (!cachedValue.isExpired && cachedValue.value) {
		return cachedValue.value
	}

	const request = await fetchHelpToolsRemote()
	await setHelpTools(request.data)

	return request.data
}
