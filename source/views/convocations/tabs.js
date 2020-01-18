// @flow

import {TabNavigator} from '@frogpond/navigation-tabs'

// import {NextConvocationView} from './next'
import {UpcomingConvocationsView} from './upcoming'
import {ArchivedConvocationsView} from './archived'

export default TabNavigator(
	{
		// NextConvocationView: {screen: NextConvocationView},
		UpcomingConvocationsView: {screen: UpcomingConvocationsView},
		ArchivedConvocationsView: {screen: ArchivedConvocationsView},
	},
	{
		navigationOptions: {
			title: 'Convocations',
		},
	},
)
