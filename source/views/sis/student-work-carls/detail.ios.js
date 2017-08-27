// @flow
import React from 'react'
import {ScrollView} from 'react-native'
import {Cell, Section, TableView} from 'react-native-tableview-simple'
import openUrl from '../../components/open-url'
import type {FullJobType} from './types'
import getUrls from 'get-urls'
import {SelectableCell} from './selectable'

function Title({job}: {job: FullJobType}) {
  return (
    <Section header="JOB">
      <Cell
        cellStyle="Subtitle"
        title={job.title}
        detail={job.offCampus ? 'Off-Campus' : ''}
      />
    </Section>
  )
}

function Information({job}: {job: FullJobType}) {
  const department = job.department
    ? <Cell
        cellStyle="RightDetail"
        title="Department"
        detail={job.department}
      />
    : null

  const opens = (
    <Cell cellStyle="RightDetail" title="Date Open" detail={job.dateOpen} />
  )

  const term = job.duringTerm
    ? <Cell cellStyle="Basic" title="Position Available During Term" />
    : null

  const brk = job.duringBreak
    ? <Cell cellStyle="Basic" title="Position Available During Break" />
    : null

  return (
    <Section header="INFORMATION">
      {department}
      {opens}
      {term}
      {brk}
    </Section>
  )
}

function Description({job}: {job: FullJobType}) {
  return (
    <Section header="DESCRIPTION">
      <SelectableCell text={job.description} />
    </Section>
  )
}

function Links({job}: {job: FullJobType}) {
  const links = [...getUrls(job.description)]
  return links.length
    ? <Section header="LINKS">
        {links.map(url =>
          <Cell
            key={url}
            title={url}
            accessory="DisclosureIndicator"
            onPress={() => openUrl(url)}
          />,
        )}
      </Section>
    : null
}

export class JobDetailView extends React.PureComponent {
  props: {
    job: FullJobType,
  }

  render() {
    const {job} = this.props

    return (
      <ScrollView>
        <TableView>
          <Title job={job} />
          <Information job={job} />
          <Description job={job} />
          <Links job={job} />
        </TableView>
      </ScrollView>
    )
  }
}
