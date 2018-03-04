// @flow

import * as React from 'react'
import {StyleSheet} from 'react-native'
import * as c from '../components/colors'
import {SearchBar} from '../components/searchbar'
import sortBy from 'lodash/sortBy'
import type {Building} from './types'
import {Overlay} from './overlay'
import {BuildingList} from './building-list'

type Props = {
	buildings: Array<Building>,
	onSelect: string => any,
}

type State = {
	query: string,
	overlaySize: 'min' | 'mid' | 'max',
}

export class BuildingPicker extends React.Component<Props, State> {
	state = {
		query: '',
		overlaySize: 'min',
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

		let matches = this.state.query
			? this.props.buildings.filter(b =>
					b.name.toLowerCase().startsWith(this.state.query),
				)
			: this.props.buildings

		matches = sortBy(matches, m => m.name)

		return (
			<Overlay
				onSizeChange={this.onOverlaySizeChange}
				renderCollapsed={() => <React.Fragment>{search}</React.Fragment>}
				renderExpanded={() => (
					<React.Fragment>
						{search}
						<BuildingList
							buildings={matches}
							onSelect={this.onSelectBuilding}
						/>
					</React.Fragment>
				)}
				size={overlaySize}
			/>
		)
	}
}

const styles = StyleSheet.create({
	searchBox: {
		marginHorizontal: 6,
	},
})
