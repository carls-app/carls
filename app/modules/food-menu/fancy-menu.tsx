import * as React from 'react'
import {useEffect, useState} from 'react'
import {SectionList, StyleSheet} from 'react-native'
import * as c from '../colors'
import type {
	MasterCorIconMapType,
	MenuItemContainerType,
	MenuItemType,
	ProcessedMealType,
	StationMenuType,
} from './types'
import size from 'lodash/size'
import {ListSectionHeader, ListSeparator, largeListProps} from '../lists'
import type {FilterType} from '../filter'
import {applyFiltersToItem} from '../filter'
import {NoticeView} from '../notice'
import {FilterMenuToolbar as FilterToolbar} from './filter-menu-toolbar'
import {FoodItemRow} from './food-item-row'
import {chooseMeal} from './lib/choose-meal'
import {buildFilters} from './lib/build-filters'
import {useNavigation} from 'expo-router'
import type {Moment} from 'moment'

type FilterFunc = (
	filters: FilterType<MenuItemType>[],
	item: MenuItemType,
) => boolean

interface ReactProps {
	cafeMessage?: string | null
	foodItems: MenuItemContainerType
	meals: ProcessedMealType[]
	menuCorIcons: MasterCorIconMapType
	name: string
	now: Moment
	onRefresh?: () => void
	refreshing?: boolean
	applyFilters?: FilterFunc
}

type Props = ReactProps

const styles = StyleSheet.create({
	inner: {
		backgroundColor: c.separator,
	},
	message: {
		paddingVertical: 16,
	},
	contentContainer: {
		flexGrow: 1,
	},
})

const LEFT_MARGIN = 28
const Separator = () => <ListSeparator spacing={{left: LEFT_MARGIN}} />

const areSpecialsFiltered = (filters: FilterType<MenuItemType>[]): boolean =>
	Boolean(filters.find(isSpecialsFilter))

const isSpecialsFilter = (f: FilterType<MenuItemType>): boolean =>
	f.enabled && f.type === 'toggle' && f.spec.label === 'Only Show Specials'

const areDietsFiltered = (filters: FilterType<MenuItemType>[]): boolean =>
	Boolean(filters.find(isDietsFilter))

const isDietsFilter = (f: FilterType<MenuItemType>): boolean =>
	f.enabled && f.type === 'list' && f.spec.title === 'Dietary Restrictions'

const groupMenuData = (args: {
	filters: FilterType<MenuItemType>[]
	stations: StationMenuType[]
	foodItems: MenuItemContainerType
	applyFilters: FilterFunc
}): {title: string; data: MenuItemType[]}[] => {
	const {applyFilters, foodItems, stations, filters} = args

	const dietsFilterEnabled = areDietsFiltered(filters)

	const dereferenceMenuItems = (menu: StationMenuType) =>
		menu.items
			// Dereference each menu item
			.map((id) => foodItems[id])
			// Ensure that the referenced menu items exist,
			// and apply the selected filters to the items in the menu
			.filter((item): item is MenuItemType => {
				// Ensure that items with dietary data are the only
				// items being shown when a diet filter is enabled
				if (dietsFilterEnabled) {
					// TODO: does this work???
					return item && !item.cor_icon.entries
						? applyFilters(filters, item)
						: false
				}

				return item ? applyFilters(filters, item) : false
			})

	const stationMenusByLabel: [string, MenuItemType[]][] = stations.map(
		(menu: StationMenuType) => [menu.label, dereferenceMenuItems(menu)],
	)

	return stationMenusByLabel
		.filter(([_key, items]) => items.length)
		.map(([title, data]) => ({title, data}))
}

export function FancyMenu(props: Props): React.JSX.Element {
	const {now, meals, cafeMessage, foodItems, menuCorIcons} = props
	const applyFilters = props.applyFilters ?? applyFiltersToItem

	let navigation = useNavigation()

	const [filters, setFilters] = useState<FilterType<MenuItemType>[]>([])

	const meal = chooseMeal(meals, filters, now)
	const {label: mealName, stations} = meal
	const stationsByLabel = new Map(
		stations.map((station) => [station.label, station]),
	)

	const [groupedMenuData, setGroupedMenuData] = useState<
		{title: string; data: MenuItemType[]}[]
	>([])

	const anyFiltersEnabled = filters.some((f) => f.enabled)
	const specialsFilterEnabled = areSpecialsFiltered(filters)

	// reset the filters when the data changes
	useEffect(() => {
		let foodItemsArray = Object.values(foodItems)
		setFilters(buildFilters(foodItemsArray, menuCorIcons, meals, now))
	}, [foodItems, menuCorIcons, meals, now])

	// re-group the food when the data changes
	useEffect(() => {
		let grouped = groupMenuData({stations, filters, applyFilters, foodItems})
		setGroupedMenuData(grouped)
	}, [applyFilters, filters, foodItems, stations])

	let message = 'No items to show.'
	if (cafeMessage != null) {
		message = cafeMessage
	} else if (specialsFilterEnabled && stations.length === 0) {
		message =
			'No items to show. There may be no specials today. Try changing the filters.'
	} else if (anyFiltersEnabled && !size(groupedMenuData)) {
		message = 'No items to show. Try changing the filters.'
	}

	// If the requested menu has no food items, that location is closed
	const isOpen = Object.keys(foodItems).length !== 0

	const header = (
		<FilterToolbar
			date={now}
			filters={filters}
			isOpen={isOpen}
			onPopoverDismiss={(newFilter) => {
				let edited = filters.map((f) =>
					f.key === newFilter.key ? newFilter : f,
				)
				setFilters(edited)
			}}
			title={mealName}
		/>
	)

	return (
		<SectionList
			ItemSeparatorComponent={Separator}
			ListEmptyComponent={<NoticeView style={styles.message} text={message} />}
			ListHeaderComponent={header}
			contentContainerStyle={styles.contentContainer}
			extraData={filters}
			keyExtractor={(item: MenuItemType) => item.id}
			onRefresh={props.onRefresh}
			refreshing={props.refreshing}
			renderItem={({item}) => {
				return (
					<FoodItemRow
						badgeSpecials={!specialsFilterEnabled}
						corIcons={menuCorIcons}
						data={item}
						onPress={() => {
							navigation.navigate('MenuItemDetail', {item, icons: menuCorIcons})
						}}
						spacing={{left: LEFT_MARGIN}}
					/>
				)
			}}
			renderSectionHeader={(info) => {
				const title = info.section.title
				const note = stationsByLabel.get(title)?.note ?? ''

				return (
					<ListSectionHeader
						spacing={{left: LEFT_MARGIN}}
						subtitle={note}
						title={title}
					/>
				)
			}}
			sections={groupedMenuData}
			style={styles.inner}
			{...largeListProps}
		/>
	)
}
