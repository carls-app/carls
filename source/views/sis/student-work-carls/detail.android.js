// @flow
import React from 'react'
import {Text, View, ScrollView, StyleSheet} from 'react-native'
import {Card} from '../../components/card'
import openUrl from '../../components/open-url'
import * as c from '../../components/colors'
import type {JobType} from './types'

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
	subtitle: {
		textAlign: 'center',
		marginBottom: 15,
		paddingHorizontal: 5,
		color: c.black,
		fontSize: 16,
		fontWeight: '300',
	},
	card: {
		marginBottom: 20,
	},
	cardBody: {
		color: c.black,
		paddingTop: 13,
		paddingBottom: 13,
		paddingLeft: 16,
		paddingRight: 16,
		fontSize: 16,
	},
})

function Title({job}: {job: JobType}) {
	return (
		<View>
			<Text style={styles.name}>{job.title}</Text>
			<Text style={styles.subtitle}>{job.offCampus ? 'Off-Campus' : ''}</Text>
		</View>
	)
}

function Information({job}: {job: FullJobType}) {
	const department = job.department ? (
		<Text style={styles.cardBody}>Department: {job.department}</Text>
	) : null

	const opens = <Text style={styles.cardBody}>Date Open: {job.dateOpen}</Text>

	const term = job.duringTerm ? (
		<Text style={styles.cardBody}>Position Available During Term</Text>
	) : null

	const brk = job.duringBreak ? (
		<Text style={styles.cardBody}>Position Available During Break</Text>
	) : null

	return (
		<Card header="Information" style={styles.card}>
			{department}
			{opens}
			{term}
			{brk}
		</Card>
	)
}

function Description({job}: {job: JobType}) {
	return job.description ? (
		<Card header="Description" style={styles.card}>
			<Text style={styles.cardBody}>{job.description}</Text>
		</Card>
	) : null
}

function Links({links}: {links: Array<string>}) {
	return links.length ? (
		<Card header="LINKS" style={styles.card}>
			{links.map(url => (
				<Text key={url} onPress={() => openUrl(url)} style={styles.cardBody}>
					{url}
				</Text>
			))}
		</Card>
	) : null
}

type Props = {
	job: FullJobType,
}

export class JobDetailView extends React.PureComponent<Props> {
	render() {
		const {job} = this.props

		return (
			<ScrollView>
				<Title job={job} />
				<Information job={job} />
				<Description job={job} />
				<Links links={job.links} />
			</ScrollView>
		)
	}
}
