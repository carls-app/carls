// @flow

import {TabNavigator} from '../../../modules/navigation-tabs/tabbed-view'

import StudentWorkView from './student-work-carls'
import {TheHubView} from './hub'

export {JobDetailView} from './student-work-carls/detail'

const SisView = TabNavigator({
	TheHubView: {screen: TheHubView},
	StudentWorkView: {screen: StudentWorkView},
})

SisView.navigationOptions = {
	title: 'The Hub',
}

export default SisView
