// @flow
import * as React from 'react'
import {ScrollView, View, Text, StyleSheet} from 'react-native'
import {CellTextField} from '../../components/cells/textfield'
import {ButtonCell} from '../../components/cells/button'
import {TableView, Section} from 'react-native-tableview-simple'
import {submitReport} from './submit'
import * as c from '../../components/colors'

type State = {
	dictionaryEntry: WordType,
}

export class DictionaryEditorView extends React.PureComponent<Props> {
	static navigationOptions = () => {
		return {
			title: 'Suggest an Edit',
		}
	}

	state = {
		dictionaryEntry: this.props.navigation.state.params.word,
	}

	submit = () => {
		submitReport(
			this.props.navigation.state.params.word,
			this.state.dictionaryEntry,
		)
	}

	render() {
		const item = this.props.navigation.state.params.word
		return (
			<ScrollView>
				<View style={styles.helpWrapper}>
					<Text style={styles.helpTitle}>Thanks for spotting a problem!</Text>
					<Text style={styles.helpDescription}>
						If you could tell us what the word and definition should be,
						we&rsquo;d greatly appreciate it.
					</Text>
				</View>

				<TableView>
					<Section header="WORD">
						<TitleCell onChange={this.editTitle} text={item.word ? item.word.trim() : ''} />
					</Section>

					<Section header="DEFINITION">
						<DefinitionCell
							onChange={this.editTitle}
							text={item.definition ? item.definition.trim() : ''}
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

type TextFieldProps = {text: string, onChange: string => any}

const TitleCell = ({text, onChange = () => {}}: TextFieldProps) => (
	<CellTextField
		autoCapitalize="words"
		hideLabel={true}
		onChangeText={onChange}
		onSubmitEditing={onChange}
		placeholder="Title"
		returnKeyType="done"
		value={text}
	/>
)

const DefinitionCell = ({text, onChange = () => {}}: TextFieldProps) => (
	<CellTextField
		autoCapitalize="sentences"
		hideLabel={true}
		multiline={true}
		onChangeText={onChange}
		onSubmitEditing={onChange}
		placeholder="Definition"
		returnKeyType="done"
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
