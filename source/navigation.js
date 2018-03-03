// @flow

import {Platform, StyleSheet} from 'react-native'
import {StackNavigator} from 'react-navigation'
import * as c from './views/components/colors'

import CalendarView, {EventDetail as EventDetailView} from './views/calendar'
import {ContactsView, ContactsDetailView} from './views/contacts'
import {DictionaryView, DictionaryDetailView} from './views/dictionary'
import {HomeView, EditHomeView} from './views/home'
import StreamingView, {
	KSTOScheduleView,
	KRLXScheduleView,
} from './views/streaming'
import {MenusView} from './views/menus'
import {FilterView} from './views/components/filter'
import NewsView from './views/news'
import SISView from './views/sis'
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
import {StudentOrgsView, StudentOrgsDetailView} from './views/student-orgs'
import {FaqView} from './views/faqs'
import HelpView from './views/help'
import {
	ConvocationsView,
	ArchivedConvocationDetailView,
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
		CreditsView: {screen: CreditsView},
		DictionaryDetailView: {screen: DictionaryDetailView},
		DictionaryView: {screen: DictionaryView},
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
		StreamingView: {screen: StreamingView},
		KSTOScheduleView: {screen: KSTOScheduleView},
		KRLXScheduleView: {screen: KRLXScheduleView},
		StudentOrgsDetailView: {screen: StudentOrgsDetailView},
		StudentOrgsView: {screen: StudentOrgsView},
		StudentWorkDetailView: {screen: StudentWorkDetailView},
		TransportationView: {screen: TransportationView},
		OtherModesDetailView: {screen: OtherModesDetailView},
		BusMapView: {screen: BusMapView},
	},
	{
		navigationOptions: {
			headerStyle: styles.header,
			headerTintColor: c.white,
		},
		cardStyle: styles.card,
	},
)
