// @flow

export const icons = {
	penguin: require('./about/CarlsTrans.png'),
	// windmill: require('../ios/AllAboutOlaf/windmill-icon/windmill.png'),
}

export const defaultIcon = icons.penguin

// eslint-disable camelcase
export const iosToNamedIconsMap: {[key: string]: $Keys<typeof icons>} = {
	// icon_type_windmill: 'windmill',
	default: 'penguin',
}
// eslint-enable camelcase

export function lookup(iosIconName: $Keys<typeof iosToNamedIconsMap>): number {
	const iconName = iosToNamedIconsMap[iosIconName]
	if (!iconName) {
		return defaultIcon
	}

	const icon = icons[iconName]
	if (!icon) {
		return defaultIcon
	}

	return icon
}
