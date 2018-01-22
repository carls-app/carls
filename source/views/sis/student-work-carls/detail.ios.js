// @flow
import React from 'react'
import {ScrollView} from 'react-native'
import {Cell, Section, TableView} from 'react-native-tableview-simple'
import openUrl from '../../components/open-url'
import type {FullJobType} from './types'
import {SelectableCell} from './selectable'

function Title({job}: {job: FullJobType}) {
	return (
		<Section header="JOB">
			<Cell
				cellStyle="Subtitle"
				title={job.title}
				detail={job.offCampus ? 'Off-Campus' : 'On-Campus'}
			/>
		</Section>
	)
}

function Information({job}: {job: FullJobType}) {
	const department = job.department ? (
		<Cell cellStyle="RightDetail" title="Department" detail={job.department} />
	) : null

	const opens = (
		<Cell cellStyle="RightDetail" title="Date Open" detail={job.dateOpen} />
	)

	const term = job.duringTerm ? (
		<Cell cellStyle="Basic" title="Position Available During Term" />
	) : null

	const brk = job.duringBreak ? (
		<Cell cellStyle="Basic" title="Position Available During Break" />
	) : null

	return (
		<Section header="INFORMATION">
			{department}
			{opens}
			{term}
			{brk}
		</Section>
	)
}

function Description({text}: {text: string}) {
	return (
		<Section header="DESCRIPTION">
			<SelectableCell text={text} />
		</Section>
	)
}

function Links({links}: {links: Array<string>}) {
	return links.length ? (
		<Section header="LINKS">
			{links.map(url => (
				<Cell
					key={url}
					title={url}
					accessory="DisclosureIndicator"
					onPress={() => openUrl(url)}
				/>
			))}
		</Section>
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
				<TableView>
					<Title job={job} />
					<Information job={job} />
					<Description text={job.description} />
					<Links links={job.links} />
				</TableView>
			</ScrollView>
		)
	}
}
