// @flow

import {TabNavigator} from '@frogpond/navigation-tabs'

import {KstoStationView} from './radio/station-ksto'
import {KrlxStationView} from './radio/station-krlx'

const KrlxView = TabNavigator({
	KRLXRadioView: {screen: KrlxStationView},
	KSTORadioView: {screen: KstoStationView},
})

KrlxView.navigationOptions = {
	title: 'Radio',
}

export const RadioTabView = KrlxView
