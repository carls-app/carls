// @flow

import {HomeView} from '../views/home'
import {BuildingHoursDetailView} from '../views/building-hours/detail'
import {
	BuildingHoursProblemReportView,
	BuildingHoursScheduleEditorView,
	BuildingHoursView,
} from '../views/building-hours'
import CalendarView from '../views/calendar'
import {EventDetail as EventDetailView} from '@frogpond/event-list'
import {ContactsDetailView, ContactsView} from '../views/contacts'
import {
	DictionaryDetailView,
	DictionaryEditorView,
	DictionaryView,
} from '../views/dictionary'
import {FaqView} from '../views/faqs'
import {HelpView} from '../views/help'
import {JobDetailView} from '../views/sis'
import {
	OlafStavMenuView,
	OlafPauseMenuView,
	OlafCageMenuView,
	OlafCafeIndex,
	MenusView,
} from '../views/menus'
import {BonAppPickerView} from '../views/menus/dev-bonapp-picker'
import {MenuItemDetailView} from '@frogpond/food-menu/food-item-detail'
import NewsView from '../views/news'
import {
	SettingsView,
	IconSettingsView,
	CreditsView,
	DebugView,
	LegalView,
	PrivacyView,
	APITestView,
} from '../views/settings'
import SISView from '../views/sis'
import {
	SumoUpcomingView,
	KRLXScheduleView,
	KSTOScheduleView,
	RadioTabView,
} from '../views/streaming'
import {StudentOrgsDetailView, StudentOrgsView} from '../views/student-orgs-carls'
import TransportationView, {
	BusMap as BusMapView,
	OtherModesDetailView,
} from '../views/transportation'
import {
	ConvocationsView,
	ArchivedConvocationDetailView,
	UpcomingConvocationsDetailView,
} from '../views/convocations'
import {MapView, MapReporterView} from '../views/map-carls'

export const routes = {
	HomeView: {screen: HomeView},
	APITestView: {screen: APITestView},
	BonAppPickerView: {screen: BonAppPickerView},
	BuildingHoursDetailView: {screen: BuildingHoursDetailView},
	BuildingHoursProblemReportView: {screen: BuildingHoursProblemReportView},
	ArchivedConvocationDetailView: {screen: ArchivedConvocationDetailView},
	BuildingHoursScheduleEditorView: {screen: BuildingHoursScheduleEditorView},
	BuildingHoursView: {screen: BuildingHoursView},
	BusMapView: {screen: BusMapView},
	CalendarView: {screen: CalendarView},
	ContactsDetailView: {screen: ContactsDetailView},
	ContactsView: {screen: ContactsView},
	ConvocationsView: {screen: ConvocationsView},
	CreditsView: {screen: CreditsView},
	DebugView: {screen: DebugView},
	DictionaryDetailView: {screen: DictionaryDetailView},
	DictionaryEditorView: {screen: DictionaryEditorView},
	DictionaryView: {screen: DictionaryView},
	EventDetailView: {screen: EventDetailView},
	FaqView: {screen: FaqView},
	HelpView: {screen: HelpView},
	IconSettingsView: {screen: IconSettingsView},
	JobDetailView: {screen: JobDetailView},
	MapView: {screen: MapView},
	MapReporterView: {screen: MapReporterView},
	KRLXScheduleView: {screen: KRLXScheduleView},
	KSTOScheduleView: {screen: KSTOScheduleView},
	LegalView: {screen: LegalView},
	MenuItemDetailView: {screen: MenuItemDetailView},
	MenusView: {screen: MenusView},
	NewsView: {screen: NewsView},
	OlafCafeIndex: {screen: OlafCafeIndex},
	OlafCageMenuView: {screen: OlafCageMenuView},
	OlafPauseMenuView: {screen: OlafPauseMenuView},
	OlafStavMenuView: {screen: OlafStavMenuView},
	OtherModesDetailView: {screen: OtherModesDetailView},
	PrivacyView: {screen: PrivacyView},
	RadioTabView: {screen: RadioTabView},
	SettingsView: {screen: SettingsView},
	SISView: {screen: SISView},
	StudentOrgsDetailView: {screen: StudentOrgsDetailView},
	StudentOrgsView: {screen: StudentOrgsView},
	SumoUpcomingView: {screen: SumoUpcomingView},
	TransportationView: {screen: TransportationView},
	UpcomingConvocationsDetailView: {screen: UpcomingConvocationsDetailView},
}
