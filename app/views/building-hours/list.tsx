import * as React from 'react'
import {StyleSheet, SectionList} from 'react-native'
import {BuildingRow} from './row'
import {useGroupedBuildings} from './query'
import {BuildingType} from './types'

import * as c from '../../modules/colors'
import {ListSeparator, ListSectionHeader} from '../../modules/lists'
import {LoadingView, NoticeView} from '../../modules/notice'
import {useNavigation} from 'expo-router'
import {useMomentTimer} from '../../modules/timer'

export {BuildingHoursDetailView} from './detail'

const styles = StyleSheet.create({
	container: {
		backgroundColor: c.systemBackground,
		flexGrow: 1,
	},
})

export function BuildingHoursView(): React.JSX.Element {
	let navigation = useNavigation()

	let {now} = useMomentTimer({intervalMs: 60000, startOf: 'minute'})

	let {
		data = [],
		error,
		refetch,
		isLoading,
		isError,
		isRefetching,
	} = useGroupedBuildings()

	let onPressRow = React.useCallback(
		(building: BuildingType) => {
			navigation.navigate('BuildingHoursDetail', {building})
		},
		[navigation],
	)

	if (isError) {
		return (
			<NoticeView
				buttonText="Try Again"
				onPress={refetch}
				text={`A problem occured while loading: ${error}`}
			/>
		)
	}

	return (
		<SectionList
			ItemSeparatorComponent={ListSeparator}
			ListEmptyComponent={
				isLoading ? <LoadingView /> : <NoticeView text="No hours." />
			}
			contentContainerStyle={styles.container}
			keyExtractor={(item) => item.name}
			onRefresh={refetch}
			refreshing={isRefetching}
			renderItem={({item}) => (
				<BuildingRow
					info={item}
					now={now}
					onPress={() => {
						onPressRow(item)
					}}
				/>
			)}
			renderSectionHeader={({section: {title}}) => (
				<ListSectionHeader title={title} />
			)}
			sections={data}
		/>
	)
}
