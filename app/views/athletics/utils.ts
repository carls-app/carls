import moment from 'moment-timezone'
import { DateGroupedScores, DateSection, Score } from './types'
import { Constants } from './constants'

const isYesterday = (date: moment.Moment) => {
  const yesterday = moment().subtract(1, 'day').startOf('day')
  return date.isSame(yesterday, 'day')
}

const isToday = (date: moment.Moment) => {
  return date.isSame(moment().startOf('day'), 'day')
}

const isFuture = (date: moment.Moment) => {
  return date.isAfter(moment().endOf('day'))
}

export const formatDateString = (date: moment.Moment): string => {
  return date.format('dddd, MMM D')
}

export const groupScoresByDate = (scores: Score[]): DateGroupedScores[] => {
  const yesterday: Score[] = []
  const today: Score[] = []
  const upcoming: Record<string, Score[]> = {}

  scores.forEach((score) => {
    const date = moment(score.date_utc, 'M/D/YYYY h:mm:ss A')

    if (isYesterday(date)) {
      yesterday.push(score)
    } else if (isToday(date)) {
      today.push(score)
    } else if (isFuture(date)) {
      const dateString = formatDateString(date)
      if (!upcoming[dateString]) {
        upcoming[dateString] = []
      }
      upcoming[dateString].push(score)
    }
  })

  const upcomingSections = Object.keys(upcoming).map((date) => ({
    title: date as DateSection,
    data: upcoming[date],
  }))

  return [
    { title: Constants.YESTERDAY, data: yesterday },
    { title: Constants.TODAY, data: today },
    ...upcomingSections,
  ]
}
