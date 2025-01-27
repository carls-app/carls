import React, { useCallback, useMemo } from 'react'
import { SectionList, StyleSheet, View, Text } from 'react-native'
import moment from 'moment-timezone'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { LoadingView, NoticeView } from '../../modules/notice'
import * as c from '../../modules/colors'

import { useAthleticsGrouped } from './query'
import { AthleticsRow } from './row'
import { TabBar } from './tabbar'
import { DateSection, Score } from './types'
import { Constants } from './constants'
import { formatDateString } from './utils'

export const AthleticsListView = () => {
  const [selectedSection, setSelectedSection] = React.useState<DateSection>(
    Constants.TODAY,
  )

  const {
    data = [],
    error,
    refetch,
    isLoading,
    isError,
  } = useAthleticsGrouped()

  let insets = useSafeAreaInsets()

  const currentSection = useMemo(() => {
    switch (selectedSection) {
      case Constants.UPCOMING:
        const upcomingData = data
          .filter(
            (section) =>
              ![Constants.YESTERDAY, Constants.TODAY].includes(section.title),
          )
          .flatMap((section) => section.data)
        return { title: Constants.UPCOMING, data: upcomingData }
      default:
        return data.find((section) => section.title === selectedSection)
    }
  }, [selectedSection, data])

  const renderSectionHeader = useCallback(
    ({ section: { title } }: { section: { title: string } }) => {
      switch (selectedSection) {
        case Constants.YESTERDAY:
          return null
        default:
          return <Text style={styles.sectionHeader}>{title}</Text>
      }
    },
    [selectedSection],
  )

  const renderItem = useCallback(
    ({ item }: { item: Score }) => (
      <AthleticsRow
        data={[item]}
        includePrefix={selectedSection === Constants.UPCOMING}
      />
    ),
    [selectedSection],
  )

  const renderSectionList = useCallback(
    (sections: { title: string; data: Score[] }[]) => (
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.sectionListContent}
        contentInset={{ top: 0, bottom: insets.bottom }}
      />
    ),
    [renderItem, renderSectionHeader],
  )

  const getSections = useCallback(() => {
    if (selectedSection === Constants.UPCOMING) {
      const upcomingSections = currentSection?.data.reduce(
        (acc, score) => {
          const date = moment(score.date_utc, 'M/D/YYYY h:mm:ss A')
          const dateString = formatDateString(date)
          if (!acc[dateString]) {
            acc[dateString] = []
          }
          acc[dateString].push(score)
          return acc
        },
        {} as Record<string, Score[]>,
      )

      return Object.keys(upcomingSections || {})
        .map((date) => ({
          title: date,
          data: upcomingSections?.[date] || [],
        }))
        .filter((section) => (section.data ?? []).length)
    }

    if (selectedSection === Constants.YESTERDAY) {
      const finalized = currentSection?.data.filter(
        (score) => score.result !== '',
      )
      return finalized?.length ? [{ title: '', data: finalized }] : []
    }

    if (selectedSection === Constants.TODAY) {
      const ongoing = currentSection?.data.filter(
        (score) => score.status.indicator === 'O',
      )
      const finalized = currentSection?.data.filter(
        (score) => score.status.indicator !== 'O' && score.result !== '',
      )
      const upcoming = currentSection?.data.filter(
        (score) => score.status.indicator !== 'O' && score.result === '',
      )

      return [
        { title: Constants.ONGOING, data: ongoing ?? [] },
        { title: Constants.FINALIZED, data: finalized ?? [] },
        { title: Constants.UPCOMING, data: upcoming ?? [] },
      ].filter((section) => section.data.length)
    }

    return []
  }, [selectedSection, currentSection])

  const sections = useMemo(() => getSections(), [getSections])

  if (isError) {
    return (
      <NoticeView
        buttonText="Try again?"
        onPress={refetch}
        text={`A problem occurred while loading: ${String(error)}`}
      />
    )
  }

  if (isLoading) {
    return <LoadingView />
  }

  if (!data.length) {
    return <NoticeView text="Oops! We didn＇t find any data." />
  }

  return (
    <View style={styles.container}>
      <TabBar
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
      />
      {renderSectionList(sections)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.secondarySystemBackground,
  },
  sectionListContent: {
    padding: 10,
  },
  sectionHeader: {
    backgroundColor: c.secondarySystemBackground,
    color: c.label,
    padding: 5,
    paddingHorizontal: 10,
  },
})
