// @flow
import React from 'react'
import {ScrollView} from 'react-native'
import {Cell, Section, TableView} from 'react-native-tableview-simple'
import openUrl from '../../components/open-url'
import type {FullJobType} from './types'
import {SelectableCell} from './selectable'

type Props = {
	job: FullJobType,
}

export class JobDetailView extends React.PureComponent<Props> {
	render() {
		const {job} = this.props

		const infoCells = [
			job.department ? (
				<Cell
					key="department"
					cellStyle="RightDetail"
					detail={job.department}
					title="Department"
				/>
			) : null,
			job.dateOpen ? (
				<Cell
					key="dateOpen"
					cellStyle="RightDetail"
					detail={job.dateOpen}
					title="Date Open"
				/>
			) : null,
			job.duringTerm ? (
				<Cell
					key="duringTerm"
					cellStyle="RightDetail"
					detail="During Term"
					title="Position Available"
				/>
			) : null,
			job.duringBreak ? (
				<Cell
					key="duringBreak"
					cellStyle="RightDetail"
					detail="During Break"
					title="Position Available"
				/>
			) : null,
		].filter(Boolean)

		return (
			<ScrollView>
				<TableView>
					<Section header="JOB">
						<Cell
							cellStyle="Subtitle"
							detail={job.offCampus ? 'Off-Campus' : 'On-Campus'}
							title={job.title}
						/>
					</Section>

					<Section header="INFORMATION">{infoCells}</Section>

					<Section header="DESCRIPTION">
						<SelectableCell text={job.description} />
					</Section>

					{job.links.length ? (
						<Section header="LINKS">
							{job.links.map(url => (
								<Cell
									key={url}
									accessory="DisclosureIndicator"
									onPress={() => openUrl(url)}
									title={url}
								/>
							))}
						</Section>
					) : null}
				</TableView>
			</ScrollView>
		)
	}
}
