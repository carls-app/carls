// @flow
import * as React from 'react'
import {ScrollView, View, Text, StyleSheet, TextInput} from 'react-native'
import {CellTextField} from '../../components/cells/textfield'
import {ButtonCell} from '../../components/cells/button'
import {TableView, Section} from 'react-native-tableview-simple'
import {submitReport} from './submit'
import type {Building} from '../types'
import * as c from '../../components/colors'
import type {TopLevelViewPropsType} from '../../types'

type Props = TopLevelViewPropsType & {
	navigation: {state: {params: {item: Building}}},
}

type State = {
	name: string,
	description: string,
}

export class MapReporterView extends React.PureComponent<Props, State> {
	static navigationOptions = () => {
		return {
			title: 'Suggest an Edit',
		}
	}

	static getDerivedStateFromProps(nextProps: Props) {
		let building = nextProps.navigation.state.params.building
		return {name: building.name, }
	}

	state = {
		name: this.props.navigation.state.params.building.name,
		description: '',
	}

	submit = () => {
		submitReport(this.state)
	}

	onChangeDescription = (desc: string) => {
		this.setState(() => ({description: desc}))
	}

	render() {
		let name = this.props.navigation.state.params.building.name
		let description = this.state.description

		return (
			<ScrollView
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="always"
			>
				<View style={styles.helpWrapper}>
					<Text style={styles.helpTitle}>Thanks for spotting a problem!</Text>
					<Text style={styles.helpDescription}>
						If you could tell us what the problems are, we’d
						greatly appreciate it.
					</Text>
				</View>

				<TableView>
					<Section header="NAME">
						<TitleCell text={name} />
					</Section>

					<Section header="DESCRIPTION">
						<DefinitionCell
							onChange={this.onChangeDescription}
							text={description}
						/>
					</Section>

					<Section footer="Thanks for reporting!">
						<ButtonCell onPress={this.submit} title="Submit Report" />
					</Section>
				</TableView>
			</ScrollView>
		)
	}
}

const TitleCell = ({text}) => (
	<TextInput
		editable={false}
		returnKeyType="done"
		value={text}
	/>
)

type TextFieldProps = {text: string, onChange: string => any}
const DefinitionCell = ({text, onChange = () => {}}: TextFieldProps) => (
	<CellTextField
		autoCapitalize="sentences"
		hideLabel={true}
		multiline={true}
		onChangeText={onChange}
		onSubmitEditing={onChange}
		placeholder="What's the problem?"
		returnKeyType="default"
		value={text}
	/>
)

const styles = StyleSheet.create({
	helpWrapper: {
		backgroundColor: c.white,
		borderWidth: StyleSheet.hairlineWidth,
		borderTopColor: c.iosHeaderTopBorder,
		borderBottomColor: c.iosHeaderBottomBorder,
		marginBottom: 10,
	},
	helpTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		paddingTop: 15,
		paddingHorizontal: 15,
	},
	helpDescription: {
		fontSize: 14,
		paddingTop: 5,
		paddingBottom: 15,
		paddingHorizontal: 15,
	},
})
