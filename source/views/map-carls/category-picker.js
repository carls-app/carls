// @flow

import * as React from 'react'
import {View, StyleSheet, SegmentedControlIOS} from 'react-native'

type Props = {
	categories: Array<string>,
	onChange: string => any,
	selected: string,
}

type State = {
	selectedIndex: number,
}

export class CategoryPicker extends React.Component<Props, State> {
	state = {
		selectedIndex: this.props.categories.indexOf(this.props.selected),
	}

	componentWillReceiveProps(nextProps: Props) {
		const index = this.props.categories.indexOf(nextProps.selected)
		this.setState(() => ({selectedIndex: index}))
	}

	render() {
		return (
			<View style={styles.picker}>
				<SegmentedControlIOS
					onValueChange={this.props.onChange}
					selectedIndex={this.state.selectedIndex}
					values={this.props.categories}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	picker: {
		margin: 12,
	},
})
