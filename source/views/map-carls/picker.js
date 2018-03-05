// @flow

import * as React from 'react'
import {StyleSheet} from 'react-native'
import * as c from '../components/colors'
import {SearchBar} from '../components/searchbar'
import sortBy from 'lodash/sortBy'
import type {Building} from './types'
import {Overlay} from './overlay'
import {CategoryPicker} from './category-picker'
import {BuildingList} from './building-list'

type Props = {
	buildings: Array<Building>,
	onSelect: string => any,
}

type State = {
	query: string,
	overlaySize: 'min' | 'mid' | 'max',
	category: string,
}

export class BuildingPicker extends React.Component<Props, State> {
	state = {
		query: '',
		overlaySize: 'min',
		category: 'Buildings',
	}

	searchBar: any = null

	dismissKeyboard = () => {
		this.searchBar.unFocus()
	}

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
		this.setState(() => ({overlaySize: 'max'}))
	}

	onCancel = () => {
		this.dismissKeyboard()
		this.setState(() => ({overlaySize: 'mid'}))
	}

	onOverlaySizeChange = (size: 'min' | 'mid' | 'max') => {
		this.setState(state => {
			if (state.size === 'max' && state.size !== size) {
				this.dismissKeyboard()
			}
			return {overlaySize: size}
		})
	}

	onCategoryChange = (category: string) => {
		this.setState(() => ({category}))
	}

	allCategories = ['Buildings', 'Outdoors', 'Parking', 'Athletics']
	categoryLookup = {
		Buildings: 'building',
		Outdoors: 'outdoors',
		Parking: 'parking',
		Athletics: 'athletics',
	}

	render() {
		const {overlaySize} = this.state

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

		const picker =
			!this.state.query ? (
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
			<Overlay onSizeChange={this.onOverlaySizeChange} size={overlaySize}>
				{search}
				{picker}
				<BuildingList buildings={matches} onSelect={this.onSelectBuilding} />
			</Overlay>
		)
	}
}

const styles = StyleSheet.create({
	searchBox: {
		marginHorizontal: 6,
	},
})
