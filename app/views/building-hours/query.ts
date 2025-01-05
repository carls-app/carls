import {client} from '../../modules/api'
import {useQuery, UseQueryResult} from '@tanstack/react-query'
import {groupBy} from 'lodash'
import {BuildingType} from './types'

export const keys = {
	all: ['buildings'] as const,
}

export function useGroupedBuildings(): UseQueryResult<
	{title: string; data: BuildingType[]}[],
	unknown
> {
	return useQuery({
		queryKey: keys.all,
		queryFn: async ({signal}) => {
			let response = await client.get('spaces/hours', {signal}).json()
			return (response as {data: BuildingType[]}).data
		},
		select: (buildings) => {
			let grouped = groupBy(buildings, (b) => b.category || 'Other')
			let groupedBuildings = Object.entries(grouped).map(([key, value]) => ({
				title: key,
				data: value,
			}))

			return groupedBuildings
		},
	})
}
