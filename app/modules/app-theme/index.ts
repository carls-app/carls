// import type {ThemingType} from '@callstack/react-theme-provider'
// import {createTheming} from '@callstack/react-theme-provider'
// import {useTheme} from 'expo-router'
// export {CombinedLightTheme, CombinedDarkTheme} from './paper'

export interface AppTheme {
	accent: string
	androidListHeaderBackground: string
	androidListHeaderForeground: string
	androidStatusBarColor: string
	androidTabBarBackground: string
	androidTabBarForeground: string
	buttonBackground: string
	buttonForeground: string
	iosPushButtonCellBackground: string
	iosPushButtonCellForeground: string
	iosTabBarActiveColor: string
	iosTabBarBackground: string
	navigationBackground: string
	navigationForeground: string
	statusBarStyle: 'dark-content' | 'light-content'
	switchThumbTint?: string
	switchTintOff?: string
	switchTintOn?: string
	toolbarButtonBackground: string
	toolbarButtonForeground: string
}

// export {useTheme}
