// @flow

import * as React from 'react'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'
import {CccCalendarView} from '../calendar/calendar-ccc'

import {RadioControllerView} from './radio'
import * as logos from '../../../images/streaming'

export {KSTOScheduleView, KRLXScheduleView} from './radio'

export default TabNavigator(
	{
		WeeklyMovieView: {
			screen: ({navigation}) => (
				<CccCalendarView
					calendarId="/v1/calendar/sumo"
					eventMapper={event => ({
						...event,
						title: event.title.replace(/^SUMO: /, ''),
						config: {
							...event.config,
							endTime: false,
						},
					})}
					navigation={navigation}
					poweredBy={{
						title: 'Powered by SUMO',
						href: 'https://apps.carleton.edu/student/orgs/sumo/',
					}}
				/>
			),
			navigationOptions: {
				tabBarLabel: 'SUMO',
				tabBarIcon: TabBarIcon('film'),
			},
		},
		KRLXRadioView: {
			screen: ({navigation}) => (
				<RadioControllerView
					image={logos.krlx}
					navigation={navigation}
					playerUrl="http://live.krlx.org"
					scheduleViewName="KRLXScheduleView"
					source={{
						useEmbeddedPlayer: false,
						embeddedPlayerUrl: 'http://live.krlx.org',
						streamSourceUrl: 'http://radio.krlx.org/mp3/high_quality',
					}}
					stationName="88.1 KRLX-FM"
					stationNumber="+15072224127"
					title="Carleton College Radio"
				/>
			),
			navigationOptions: {
				tabBarLabel: 'KRLX',
				tabBarIcon: TabBarIcon('microphone'),
			},
		},
		KSTORadioView: {
			screen: ({navigation}) => (
				<RadioControllerView
					image={logos.ksto}
					navigation={navigation}
					playerUrl="https://www.stolaf.edu/multimedia/play/embed/ksto.html"
					scheduleViewName="KSTOScheduleView"
					source={{
						useEmbeddedPlayer: true,
						embeddedPlayerUrl:
							'https://www.stolaf.edu/multimedia/play/embed/ksto.html',
						streamSourceUrl: '',
					}}
					stationName="KSTO 93.1 FM"
					stationNumber="+15077863602"
					title="St. Olaf College Radio"
				/>
			),
			navigationOptions: {
				tabBarLabel: 'KSTO',
				tabBarIcon: TabBarIcon('radio'),
			},
		},
	},
	{
		navigationOptions: {
			title: 'Streaming Media',
		},
	},
)
