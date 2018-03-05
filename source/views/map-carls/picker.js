// @flow

import * as React from 'react'
import {StyleSheet} from 'react-native'
import * as c from '../components/colors'
import {SearchBar} from '../components/searchbar'
import sortBy from 'lodash/sortBy'
import type {Building} from './types'
import {CategoryPicker} from './category-picker'
import {BuildingList} from './building-list'

type Props = {
	buildings: Array<Building>,
	onSelect: string => any,
	overlaySize: 'min' | 'mid' | 'max',
	onFocus: () => any,
	onCancel: () => any,
}

type State = {
	query: string,
	category: string,
}

export class BuildingPicker extends React.Component<Props, State> {
	state = {
		query: '',
		category: 'Buildings',
	}

	componentWillReceiveProps(nextProps: Props) {
		const thisSize = this.props.overlaySize
		const nextSize = nextProps.overlaySize

		if (thisSize !== nextSize && thisSize === 'max') {
			this.dismissKeyboard()
		}
	}

	searchBar: any = null

	dismissKeyboard = () => this.searchBar.unFocus()

	onSearch = (text: ?string) => {
		let query = text || ''
		this.setState(() => ({query: query.toLowerCase()}))
	}

	performSearch = (text: string) => {
		// Android clear button returns an object
		if (typeof text !== 'string') {
			return this.onSearch(null)
		}

		return this.onSearch(text)
	}

	onSelectBuilding = (id: string) => this.props.onSelect(id)

	onFocus = () => {
		this.props.onFocus()
	}

	onCancel = () => {
		this.dismissKeyboard()
		this.props.onCancel()
	}

	onOverlaySizeChange = (size: 'min' | 'mid' | 'max') => {
		this.setState(state => {
			if (state.size === 'max' && state.size !== size) {
				this.dismissKeyboard()
			}
		})
	}

	onCategoryChange = (category: string) => this.setState(() => ({category}))

	allCategories = ['Buildings', 'Outdoors', 'Parking', 'Athletics']
	categoryLookup = {
		Buildings: 'building',
		Outdoors: 'outdoors',
		Parking: 'parking',
		Athletics: 'athletics',
	}

	render() {
		const search = (
			<SearchBar
				getRef={ref => (this.searchBar = ref)}
				onCancel={this.onCancel}
				onChangeText={this.performSearch}
				onFocus={this.onFocus}
				onSearchButtonPress={this.dismissKeyboard}
				placeholder="Search for a place"
				style={styles.searchBox}
				textFieldBackgroundColor={c.iosGray}
			/>
		)

		const picker = !this.state.query ? (
			<CategoryPicker
				categories={this.allCategories}
				onChange={this.onCategoryChange}
				selected={this.state.category}
			/>
		) : null

		let matches = this.state.query
			? this.props.buildings.filter(b =>
					b.name.toLowerCase().startsWith(this.state.query),
				)
			: this.props.buildings

		if (!this.state.query) {
			const selectedCategory = this.categoryLookup[this.state.category]
			matches = matches.filter(b => b.categories[selectedCategory])
		}

		matches = sortBy(matches, m => m.name)

		return (
			<React.Fragment>
				{search}
				{picker}
				<BuildingList buildings={matches} onSelect={this.onSelectBuilding} />
			</React.Fragment>
		)
	}
}

const styles = StyleSheet.create({
	searchBox: {
		marginHorizontal: 6,
	},
})
