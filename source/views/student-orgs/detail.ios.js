// @flow
import * as React from 'react'
import {ScrollView, Text, View, StyleSheet} from 'react-native'
import moment from 'moment'
import {Cell, Section, TableView} from 'react-native-tableview-simple'
import * as c from '../components/colors'
import type {StudentOrgType} from './types'
import type {TopLevelViewPropsType} from '../types'
import {openUrl} from '../components/open-url'
import {cleanOrg} from './util'

const styles = StyleSheet.create({
	name: {
		textAlign: 'center',
		marginTop: 20,
		marginBottom: 15,
		paddingHorizontal: 5,
		color: c.black,
		fontSize: 32,
		fontWeight: '300',
	},
	meetings: {
		flex: 1,
		paddingVertical: 8,
		fontSize: 16,
	},
	description: {
		paddingTop: 13,
		paddingBottom: 13,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: c.white,
	},
	descriptionText: {
		fontSize: 16,
	},
	footer: {
		fontSize: 10,
		color: c.iosDisabledText,
		textAlign: 'center',
	},
	lastUpdated: {
		paddingBottom: 10,
	},
	poweredBy: {
		paddingBottom: 20,
	},
})

type Props = TopLevelViewPropsType & {
	navigation: {state: {params: {org: StudentOrgType}}},
}

export class StudentOrgsDetailView extends React.PureComponent<Props> {
	static navigationOptions = ({navigation}: any) => {
		const {org} = navigation.state.params
		return {
			title: org.name,
		}
	}

	render() {
		const {
			name: orgName,
			//category,
			website,
			contacts,
			description,
		} = cleanOrg(this.props.navigation.state.params.org)

		return (
			<ScrollView>
				<TableView>
					<Text selectable={true} style={styles.name}>
						{orgName}
					</Text>

					{/* 					{category ? (
						<Section header="CATEGORY">
							<Cell cellStyle="Basic" title={category} />
						</Section>
					) : null} */}

					{website ? (
						<Section header="WEBSITE">
							<Cell
								accessory="DisclosureIndicator"
								cellStyle="Basic"
								onPress={() => openUrl(website)}
								title={website}
							/>
						</Section>
					) : null}

					{contacts.length && contacts != null ? (
						<Section header="CONTACT">
							{contacts.map((c, i) => (
								<Cell key={i} cellStyle="Basic" title={c} />
							))}
						</Section>
					) : null}

					{description ? (
						<Section header="DESCRIPTION">
							<View style={styles.description}>
								<Text style={styles.descriptionText}>{description}</Text>
							</View>
						</Section>
					) : null}

					<Text selectable={true} style={[styles.footer, styles.poweredBy]}>
						Powered by the Carleton Student Orgs Database
					</Text>
				</TableView>
			</ScrollView>
		)
	}
}
