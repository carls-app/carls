// @flow

import * as React from 'react'
import {StyleSheet, SectionList} from 'react-native'
import * as c from '../../components/colors'
import {trackMenuFilters} from '../../../analytics'
import {type TopLevelViewPropsType} from '../../types'
import type momentT from 'moment'
import type {
	MenuItemType,
	MasterCorIconMapType,
	ProcessedMealType,
	MenuItemContainerType,
	StationMenuType,
} from '../types'
import size from 'lodash/size'
import values from 'lodash/values'
import {ListSeparator, ListSectionHeader} from '../../components/list'
import {applyFiltersToItem, type FilterType} from '../../components/filter'
import {NoticeView} from '../../components/notice'
import {FilterMenuToolbar as FilterToolbar} from './filter-menu-toolbar'
import {FoodItemRow} from './food-item-row'
import {chooseMeal} from '../lib/choose-meal'
import {buildFilters} from '../lib/build-filters'

type ReactProps = TopLevelViewPropsType & {
	cafeMessage?: ?string,
	foodItems: MenuItemContainerType,
	meals: ProcessedMealType[],
	menuCorIcons: MasterCorIconMapType,
	name: string,
	now: momentT,
	onRefresh?: ?() => any,
	refreshing?: ?boolean,
}

type State = {
	filters: FilterType[],
}

type DefaultProps = {
	applyFilters: (filters: FilterType[], item: MenuItemType) => boolean,
}

type Props = ReactProps & DefaultProps

const styles = StyleSheet.create({
	inner: {
		backgroundColor: c.white,
	},
	message: {
		paddingVertical: 16,
	},
})

const LEFT_MARGIN = 28
const Separator = () => <ListSeparator spacing={{left: LEFT_MARGIN}} />

type GroupMenuDataArgs = {
	stations: Array<StationMenuType>,
	applyFilters: (filters: FilterType[], item: MenuItemType) => boolean,
	foodItems: MenuItemContainerType,
	filters: FilterType[],
}

function groupMenuData(args: GroupMenuDataArgs) {
	const {applyFilters, foodItems, filters, stations} = args

	const derefrenceMenuItems = menu =>
		menu.items
			// Dereference each menu item
			.map(id => foodItems[id])
			// Ensure that the referenced menu items exist,
			// and apply the selected filters to the items in the menu
			.filter(item => item && applyFilters(filters, item))

	const menusWithItems = stations
		// We're grouping the menu items in a [label, Array<items>] tuple.
		.map(menu => [menu.label, derefrenceMenuItems(menu)])
		// We only want to show stations with at least one item in them
		.filter(([_, items]) => items.length)
		// We need to map the tuples into objects for SectionList
		.map(([title, data]) => ({title, data}))

	return menusWithItems
}

function areSpecialsFiltered(filters: FilterType[]) {
	return Boolean(filters.find(isSpecialsFilter))
}

function isSpecialsFilter(f: FilterType) {
	return (
		f.enabled && f.type === 'toggle' && f.spec.label === 'Only Show Specials'
	)
}

export class FancyMenu extends React.Component<Props, State> {
	static defaultProps = {
		applyFilters: applyFiltersToItem,
	}

	static getDerivedStateFromProps(nextProps: Props, prevState: State) {
		if (prevState.filters.length) {
			return
		}

		const {foodItems, menuCorIcons, meals, now} = nextProps
		const newFilters = buildFilters(values(foodItems), menuCorIcons, meals, now)

		// we don't bother tracking the filters in here, since this isn't where they change
		return {filters: newFilters}
	}

	updateMenuFilters = (filters: Array<FilterType>) => {
		trackMenuFilters(this.props.name, filters)
		this.setState(() => ({filters: filters}))
	}

	openFilterView = () => {
		this.props.navigation.navigate('FilterView', {
			title: `Filter ${this.props.name} Menu`,
			initialFilters: this.state.filters,
			onChange: filters => this.updateMenuFilters(filters),
		})
	}

	renderSectionHeader = ({section: {title}}: any) => {
		const {now, meals} = this.props
		const {filters} = this.state
		const {stations} = chooseMeal(meals, filters, now)
		const menu = stations.find(m => m.label === title)

		return (
			<ListSectionHeader
				spacing={{left: LEFT_MARGIN}}
				subtitle={menu ? menu.note : ''}
				title={title}
			/>
		)
	}

	renderItem = ({item}: {item: MenuItemType}) => {
		const specialsFilterEnabled = areSpecialsFiltered(this.state.filters)
		return (
			<FoodItemRow
				badgeSpecials={!specialsFilterEnabled}
				corIcons={this.props.menuCorIcons}
				data={item}
				spacing={{left: LEFT_MARGIN}}
			/>
		)
	}

	keyExtractor = (item: MenuItemType, index: number) => index.toString()

	render() {
		const {now, meals, cafeMessage} = this.props
		const {filters} = this.state

		const {label: mealName, stations} = chooseMeal(meals, filters, now)
		const anyFiltersEnabled = filters.some(f => f.enabled)
		const specialsFilterEnabled = areSpecialsFiltered(filters)
		const groupedMenuData = groupMenuData({
			foodItems: this.props.foodItems,
			applyFilters: this.props.applyFilters,
			stations,
			filters,
		})

		let message = 'No items to show.'
		if (cafeMessage) {
			message = cafeMessage
		} else if (specialsFilterEnabled && stations.length === 0) {
			message =
				'No items to show. There may be no specials today. Try changing the filters.'
		} else if (anyFiltersEnabled && !size(groupedMenuData)) {
			message = 'No items to show. Try changing the filters.'
		}

		const messageView = <NoticeView style={styles.message} text={message} />

		const header = (
			<FilterToolbar
				date={now}
				filters={filters}
				onPress={this.openFilterView}
				title={mealName}
			/>
		)

		return (
			<SectionList
				ItemSeparatorComponent={Separator}
				ListEmptyComponent={messageView}
				ListHeaderComponent={header}
				data={filters}
				keyExtractor={this.keyExtractor}
				onRefresh={this.props.onRefresh}
				refreshing={this.props.refreshing}
				renderItem={this.renderItem}
				renderSectionHeader={this.renderSectionHeader}
				sections={(groupedMenuData: any)}
				style={styles.inner}
			/>
		)
	}
}
