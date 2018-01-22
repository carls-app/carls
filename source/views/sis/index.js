// @flow

import {TabNavigator} from '../components/tabbed-view'

import BalancesView from './balances'
import {StudentWorkView} from './student-work-carls'

export default TabNavigator(
	{
		BalancesView: {screen: BalancesView},
		StudentWorkView: {screen: StudentWorkView},
	},
	{
		navigationOptions: {
			title: 'The Hub',
		},
	},
)
