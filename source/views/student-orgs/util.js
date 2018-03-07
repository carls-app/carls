// @flow
import type {StudentOrgType} from './types'
import {fastGetTrimmedText} from '../../lib/html'

export function cleanOrg(org: StudentOrgType): StudentOrgType {
	const name = org.name.trim()

	const contacts = org.contacts.map(c => ({
		...c,
		title: c.trim(),
	}))

	// const category = org.category.trim()
	const description = fastGetTrimmedText(org.description)
	let website = org.website.trim()
	if (website && !/^https?:\/\//.test(website)) {
		website = `http://${website}`
	}

	return {
		...org,
		name,
		contacts,
		category,
		description,
		website,
	}
}

