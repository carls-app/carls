// @flow

import * as c from './components/colors'

export type ViewType =
	| {
			type: 'view',
			view: string,
			title: string,
			icon: string,
			foreground: 'light' | 'dark',
			tint: string,
			gradient?: [string, string],
		}
	| {
			type: 'url',
			view: string,
			url: string,
			title: string,
			icon: string,
			foreground: 'light' | 'dark',
			tint: string,
			gradient?: [string, string],
		}

export const allViews: ViewType[] = [
	{
		type: 'view',
		view: 'MenusView',
		title: 'Menus',
		icon: 'bowl',
		foreground: 'light',
		tint: c.emerald,
		gradient: c.grassToLime,
	},
	{
		type: 'view',
		view: 'SISView',
		title: 'SIS',
		icon: 'fingerprint',
		foreground: 'dark',
		tint: c.goldenrod,
		gradient: c.yellowToGoldDark,
	},
	{
		type: 'view',
		view: 'BuildingHoursView',
		title: 'Building Hours',
		icon: 'clock',
		foreground: 'light',
		tint: c.wave,
		gradient: c.lightBlueToBlueDark,
	},
	{
		type: 'view',
		view: 'CalendarView',
		title: 'Calendar',
		icon: 'calendar',
		foreground: 'light',
		tint: c.coolPurple,
		gradient: c.magentaToPurple,
	},
	{
		type: 'url',
		url: 'https://www.stolaf.edu/personal/index.cfm',
		view: 'DirectoryView',
		title: 'Directory',
		icon: 'v-card',
		foreground: 'light',
		tint: c.indianRed,
		gradient: c.redToPurple,
	},
	{
		type: 'view',
		view: 'StreamingView',
		title: 'Streaming Media',
		icon: 'video',
		foreground: 'light',
		tint: c.denim,
		gradient: c.lightBlueToBlueLight,
	},
	{
		type: 'view',
		view: 'NewsView',
		title: 'News',
		icon: 'news',
		foreground: 'light',
		tint: c.eggplant,
		gradient: c.purpleToIndigo,
	},
	{
		type: 'url',
		url: 'https://www.myatlascms.com/map/index.php?id=294',
		view: 'MapView',
		title: 'Campus Map',
		icon: 'map',
		foreground: 'light',
		tint: c.coffee,
		gradient: c.navyToNavy,
	},
	{
		type: 'view',
		view: 'ContactsView',
		title: 'Important Contacts',
		icon: 'phone',
		foreground: 'light',
		tint: c.crimson,
		gradient: c.orangeToRed,
	},
	{
		type: 'view',
		view: 'TransportationView',
		title: 'Transportation',
		icon: 'address',
		foreground: 'light',
		tint: c.cardTable,
		gradient: c.grayToDarkGray,
	},
	{
		type: 'view',
		view: 'DictionaryView',
		title: 'Campus Dictionary',
		icon: 'open-book',
		foreground: 'light',
		tint: c.olive,
		gradient: c.pinkToHotpink,
	},
	{
		type: 'view',
		view: 'StudentOrgsView',
		title: 'Student Orgs',
		icon: 'globe',
		foreground: 'dark',
		tint: c.periwinkle,
		gradient: c.tealToSeafoam,
	},
	{
		type: 'url',
		url: 'https://moodle.stolaf.edu/',
		view: 'MoodleView',
		title: 'Moodle',
		icon: 'graduation-cap',
		foreground: 'dark',
		tint: c.cantaloupe,
		gradient: c.yellowToGoldLight,
	},
	{
		type: 'view',
		view: 'HelpView',
		title: 'Report A Problem',
		icon: 'help',
		foreground: 'light',
		tint: c.lavender,
		gradient: c.seafoamToGrass,
	},
]

export const allViewNames = allViews.map(v => v.view)
