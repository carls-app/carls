import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { NoticeView } from '../../modules/notice'
import * as c from '../../modules/colors'
import { DateSection } from './types'
import { Constants } from './constants'
import { useFilterStore, selectShowChangeFiltersMessage } from './store'

interface EmptyListNoticeProps {
  selectedSection: DateSection
  selectedFilters: string[]
}

export const EmptyListNotice = ({
  selectedSection,
  selectedFilters,
}: EmptyListNoticeProps) => {
  const showChangeFiltersMessage = useFilterStore(
    selectShowChangeFiltersMessage,
  )

  let message = ''
  switch (selectedSection) {
    case Constants.YESTERDAY:
    case Constants.TODAY:
      message = `No games ${selectedSection.toLowerCase()}`
      break
    case Constants.UPCOMING:
      message = `No ${selectedSection.toLowerCase()} games`
      break
    default:
      message = `No games`
  }

  if (showChangeFiltersMessage) {
    message = `${message}. Try changing the filters?`
  }

  return (
    <NoticeView style={{ backgroundColor: c.transparent }} text={message} />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: c.secondarySystemBackground,
  },
  text: {
    color: c.label,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
})
