// @flow

import {Platform, StyleSheet} from 'react-native'
import {StackNavigator} from 'react-navigation'
import * as c from './views/components/colors'

import CalendarView, {EventDetail as EventDetailView} from './views/calendar'
import {ContactsView, ContactsDetailView} from './views/contacts'
import {
	DictionaryView,
	DictionaryDetailView,
	DictionaryEditorView,
} from './views/dictionary'
import {HomeView, EditHomeView} from './views/home'
import {KSTOScheduleView, KRLXScheduleView} from './views/streaming'
import {SumoUpcomingView, RadioTabView} from './views/streaming/carls-index'
import {MenusView} from './views/menus'
import {FilterView} from './views/components/filter'
import NewsView from './views/news'
import SISView, {BigBalancesView} from './views/sis'
import {MapView} from './views/map-carls'
import {StudentWorkDetailView} from './views/sis/student-work-carls'
import {
	BuildingHoursView,
	BuildingHoursDetailView,
	BuildingHoursProblemReportView,
	BuildingHoursScheduleEditorView,
} from './views/building-hours'
import TransportationView, {
	BusMap as BusMapView,
	OtherModesDetailView,
} from './views/transportation'
import SettingsView from './views/settings'
import CreditsView from './views/settings/credits'
import PrivacyView from './views/settings/privacy'
import LegalView from './views/settings/legal'
import {IconSettingsView} from './views/settings/icon'
import {
	StudentOrgsView,
	StudentOrgsDetailView,
} from './views/student-orgs-carls'
import {FaqView} from './views/faqs'
import HelpView from './views/help'
import {
	ConvocationsView,
	ArchivedConvocationDetailView,
	UpcomingConvocationsDetailView,
} from './views/convocations'

const styles = StyleSheet.create({
	header: {
		backgroundColor: c.carletonBlue,
	},
	card: {
		...Platform.select({
			ios: {
				backgroundColor: c.iosLightBackground,
			},
			android: {
				backgroundColor: c.androidLightBackground,
			},
		}),
	},
})

export const AppNavigator = StackNavigator(
	{
		HomeView: {screen: HomeView},
		BuildingHoursDetailView: {screen: BuildingHoursDetailView},
		BuildingHoursView: {screen: BuildingHoursView},
		BuildingHoursProblemReportView: {screen: BuildingHoursProblemReportView},
		BuildingHoursScheduleEditorView: {screen: BuildingHoursScheduleEditorView},
		CalendarView: {screen: CalendarView},
		ContactsView: {screen: ContactsView},
		ContactsDetailView: {screen: ContactsDetailView},
		ConvocationsView: {screen: ConvocationsView},
		ArchivedConvocationDetailView: {screen: ArchivedConvocationDetailView},
		UpcomingConvocationsDetailView: {screen: UpcomingConvocationsDetailView},
		CreditsView: {screen: CreditsView},
		DictionaryDetailView: {screen: DictionaryDetailView},
		DictionaryView: {screen: DictionaryView},
		DictionaryEditorView: {screen: DictionaryEditorView},
		EditHomeView: {screen: EditHomeView},
		EventDetailView: {screen: EventDetailView},
		FaqView: {screen: FaqView},
		FilterView: {screen: FilterView},
		HelpView: {screen: HelpView},
		LegalView: {screen: LegalView},
		MenusView: {screen: MenusView},
		NewsView: {screen: NewsView},
		PrivacyView: {screen: PrivacyView},
		IconSettingsView: {screen: IconSettingsView},
		SettingsView: {screen: SettingsView},
		SISView: {screen: SISView},
		SumoUpcomingView: {screen: SumoUpcomingView},
		RadioTabView: {screen: RadioTabView},
		KSTOScheduleView: {screen: KSTOScheduleView},
		KRLXScheduleView: {screen: KRLXScheduleView},
		StudentOrgsDetailView: {screen: StudentOrgsDetailView},
		StudentOrgsView: {screen: StudentOrgsView},
		StudentWorkDetailView: {screen: StudentWorkDetailView},
		TransportationView: {screen: TransportationView},
		OtherModesDetailView: {screen: OtherModesDetailView},
		BusMapView: {screen: BusMapView},
		MapView: {screen: MapView},
		BigBalancesView: {screen: BigBalancesView},
	},
	{
		navigationOptions: {
			headerStyle: styles.header,
			headerTintColor: c.white,
		},
		cardStyle: styles.card,
	},
)
