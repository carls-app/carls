// @flow
import type {StudentOrgType} from './types'
import {fastGetTrimmedText} from '../../lib/html'

export function cleanOrg(org: StudentOrgType): StudentOrgType {
	const description = fastGetTrimmedText(org.description)

	let website = org.website.trim()
	if (website && !/^https?:\/\//.test(website)) {
		website = `http://${website}`
	}

	return {
		name: org.name.trim(),
		contacts: org.contacts,
		categories: org.categories,
		description,
		website,
		socialLinks: org.socialLinks,
	}
}
