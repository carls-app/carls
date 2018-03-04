// @flow

import * as React from 'react'
import {View, StyleSheet} from 'react-native'
import * as c from '../components/colors'
import {SearchBar} from '../components/searchbar'
import sortBy from 'lodash/sortBy'
import type {Building} from './types'
import {GrabberBar} from './grabber'
import {CategoryPicker} from './category-picker'
import {BuildingList} from './building-list'

type Props = {
	viewState: 'min' | 'mid' | 'max',
	buildings: Array<Building>,
	onFocus: () => any,
	onCancel: () => any,
	onSelect: string => any,
	expandMin: () => any,
	expandMid: () => any,
	expandMax: () => any,
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
		if (
			this.props.viewState === 'max' &&
			this.props.viewState !== nextProps.viewState
		) {
			this.dismissKeyboard()
		}
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
		const {viewState} = this.props

		const search = (
			<SearchBar
				getRef={ref => (this.searchBar = ref)}
				onCancel={this.props.onCancel}
				onChangeText={this.performSearch}
				onFocus={this.props.onFocus}
				onSearchButtonPress={this.dismissKeyboard}
				placeholder="Search for a place"
				style={styles.searchBox}
				textFieldBackgroundColor={c.iosGray}
			/>
		)

		const picker =
			this.state.query.length < 1 ? (
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

		if (viewState === 'min') {
			return (
				<View style={[styles.overlay, styles.overlayMin]}>
					<GrabberBar onPress={this.props.expandMid} />
					{search}
				</View>
			)
		} else if (viewState === 'mid') {
			return (
				<View style={[styles.overlay, styles.overlayMid]}>
					<GrabberBar onPress={this.props.expandMax} />
					{search}
					{picker}
					<BuildingList buildings={matches} onSelect={this.onSelectBuilding} />
				</View>
			)
		} else if (viewState === 'max') {
			return (
				<View style={[styles.overlay, styles.overlayMax]}>
					<GrabberBar onPress={this.props.expandMin} />
					{search}
					{picker}
					<BuildingList buildings={matches} onSelect={this.onSelectBuilding} />
				</View>
			)
		}
	}
}

const styles = StyleSheet.create({
	searchBox: {
		marginHorizontal: 6,
	},
	overlay: {
		backgroundColor: c.white,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		bottom: 0,
		left: 0,
		paddingHorizontal: 0,
		paddingTop: 0,
		position: 'absolute',
		right: 0,
		shadowColor: c.black,
		shadowOffset: {height: -4},
		shadowOpacity: 0.15,
		shadowRadius: 4,
		zIndex: 2,
	},
	overlayMin: {
		height: 80,
	},
	overlayMid: {
		height: 200,
	},
	overlayMax: {
		top: 20,
	},
})
