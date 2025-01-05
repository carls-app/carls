import * as React from 'react'
import {ScrollView, StyleSheet, Text} from 'react-native'
import {Column, Row} from '../layout'
import {Detail, ListRow, ListSeparator, Title} from '../lists'
import * as c from '../colors'
import map from 'lodash/map'
import {DietaryTagsDetail} from './dietary-tags-detail'
import {calculateAmount} from './lib/calculate-amount'
import size from 'lodash/size'
import {useLocalSearchParams} from 'expo-router'
import {useQuery} from '@tanstack/react-query'

export const MenuItemDetailView = (): React.JSX.Element => {
	const {itemId} = useLocalSearchParams<{itemId: string}>()

	const {data: item} = useQuery(getMenuItemOptions())

	return (
		<ScrollView>
			<Text selectable={true} style={styles.title}>
				{item.label}
			</Text>

			<DietaryTagsDetail
				corIcons={icons}
				dietary={item.cor_icon}
				style={styles.iconContainer}
			/>

			{item.description ? (
				<React.Fragment>
					<ListRow arrowPosition="none" fullWidth={false}>
						<Title>Description</Title>
						<Detail>{item.description}</Detail>
					</ListRow>
					<ListSeparator />
				</React.Fragment>
			) : null}

			{size(item.nutrition_details) > 1 ? (
				map(item.nutrition_details, (nutrition, key: number) => {
					return (
						<React.Fragment key={`${nutrition}-${key}`}>
							<ListRow arrowPosition="none" fullWidth={false}>
								<Row>
									<Column flex={1}>
										<Title>{nutrition.label}</Title>
									</Column>

									<Detail>{calculateAmount(nutrition)}</Detail>
								</Row>
							</ListRow>

							<ListSeparator />
						</React.Fragment>
					)
				})
			) : (
				<Detail style={styles.noInfo}>No nutritional information</Detail>
			)}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	title: {
		color: c.label,
		fontSize: 36,
		textAlign: 'center',
		marginHorizontal: 18,
		marginVertical: 10,
	},
	iconContainer: {
		flexDirection: 'column',
		marginHorizontal: 16,
		marginVertical: 10,
	},
	noInfo: {
		marginHorizontal: 16,
		marginVertical: 10,
	},
})
