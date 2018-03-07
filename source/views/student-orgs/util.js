// @flow
import type {StudentOrgType, CleanedStudentOrgType} from './types'
import {fastGetTrimmedText} from '../../lib/html'

export function cleanOrg(org: StudentOrgType): CleanedStudentOrgType {
	const description = fastGetTrimmedText(org.description)

	let website = org.website.trim()
	if (website && !/^https?:\/\//.test(website)) {
		website = `http://${website}`
	}

	return {
		name: org.name.trim(),
		contacts: org.contacts,
		category: org.categories.join(', '),
		description,
		website,
	}
}
