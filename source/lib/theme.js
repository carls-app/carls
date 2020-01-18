// @flow

import {Platform} from 'react-native'
import tinycolor from 'tinycolor2'
import {carletonBlueLight, black, white} from './colors'
import {firstReadable} from '@frogpond/colors'
import {type AppTheme} from '@frogpond/app-theme'

/**
 * The primary color of the app.
 */
export const accent = carletonBlueLight

// When you change this for iOS, you also need to update the RGB values in
// `/ios/AllAboutOlaf/LaunchScreen.storyboard`; you'll need to edit
// <color key="backgroundColor"/> and <color key="tintColor"/> in <view>,
// and <color key="tintColor"/> and <color key="barTintColor"/> in <navigationBar/>.
export const navigationBackground = Platform.select({
	ios: accent,
	android: accent,
})
export const navigationForeground = firstReadable(navigationBackground, [
	black,
	white,
])

export const buttonBackground = accent
export const buttonForeground = firstReadable(buttonBackground, [black, white])

export const toolbarButtonBackground = buttonBackground
export const toolbarButtonForeground = buttonForeground

export const iosPushButtonCellBackground = white
export const iosPushButtonCellForeground = firstReadable(
	iosPushButtonCellBackground,
	[accent, black, white],
)

// Background color when the switch is turned on.
export const switchTintOn = Platform.select({
	ios: accent,
	// don't set on Android so the platform can pick the right shades from the theming system
	android: undefined,
})
// Border color on iOS and background color on Android when the switch is turned off.
export const switchTintOff = undefined
// Color of the foreground switch grip. If this is set on iOS, the switch grip will lose its drop shadow.
export const switchThumbTint = Platform.select({
	// don't set on ios so we keep the drop shadow
	ios: undefined,
	// don't set on Android so the platform can pick the right shades from the theming system
	android: undefined,
})

export const androidListHeaderBackground = white
export const androidListHeaderForeground = firstReadable(
	androidListHeaderBackground,
	[accent, black, white],
)

export const androidTabBarBackground = accent
export const androidTabBarForeground = firstReadable(androidTabBarBackground, [
	accent,
	black,
	white,
])

// not used in the gui; just used for calculations
const iosTabBarBackground = '#F7F7F7'
export const iosTabBarActiveColor = carletonBlueLight

export const androidStatusBarColor = tinycolor(navigationBackground)
	.darken(20)
	.toRgbString()

export const statusBarStyle = Platform.select({
	ios: tinycolor.isReadable('#000', navigationBackground)
		? 'dark-content'
		: 'light-content',
	android: tinycolor.isReadable('#000', androidStatusBarColor)
		? 'dark-content'
		: 'light-content',
})

export const themeObject: AppTheme = {
	accent,
	navigationBackground,
	navigationForeground,
	buttonBackground,
	buttonForeground,
	toolbarButtonBackground,
	toolbarButtonForeground,
	iosPushButtonCellBackground,
	iosPushButtonCellForeground,
	switchTintOn,
	switchTintOff,
	switchThumbTint,
	androidListHeaderBackground,
	androidListHeaderForeground,
	androidTabBarBackground,
	androidTabBarForeground,
	iosTabBarBackground,
	iosTabBarActiveColor,
	androidStatusBarColor,
	statusBarStyle,
}
