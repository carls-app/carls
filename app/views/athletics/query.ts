import { client } from '../../modules/api'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { groupBy, toPairs } from 'lodash'
import { AthleticsResponse, AthleticsData, GroupedScores } from './types'
import { groupScoresByDate } from './utils'

export const keys = {
  all: ['games'] as const,
}

let athleticsUrl =
  'http://athletics.carleton.edu/services/scores_chris.aspx?format=json'

export function useAthleticsGrouped(): UseQueryResult<GroupedScores[]> {
  return useQuery({
    queryKey: keys.all,
    queryFn: async ({ signal }) => {
      // TODO: move this to the proxy server (which is why we have an undefined prefixUrl)
      let response = await client
        .get(athleticsUrl, { signal, prefixUrl: undefined })
        .json()
      return (response as { scores: AthleticsResponse[] }).scores
    },
    select: groupScoresByDate,
  })
}
