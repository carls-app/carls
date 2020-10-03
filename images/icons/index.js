// @flow

export const icons = {
	oscar: require('./oscar.png'),
	windmill: require('./windmill.png'),
}

export const defaultIcon = icons.oscar

// eslint-disable camelcase
export const iosToNamedIconsMap: {[key: string]: $Keys<typeof icons>} = {
	icon_type_windmill: 'windmill',
	default: 'oscar',
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
