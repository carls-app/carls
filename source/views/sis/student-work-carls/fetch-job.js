// @flow

import getUrls from 'get-urls'
import {
	parseHtml,
	cssSelect,
	getTrimmedTextWithSpaces as getText,
} from '../../../lib/html'
import type {FullJobType} from './types'

const booleanKeys = [
	'Position available during term',
	'Position available during break',
]

const paragraphicalKeys = ['Description']

export async function fetchJob(url: string): Promise<FullJobType> {
	url = url.replace(/^http:/, 'https:')
	const page = await fetch(url).then(r => r.text())
	const dom = parseHtml(page)

	const jobs = cssSelect('#jobs', dom)
	const title = cssSelect('> h3', jobs)[0]
	const details = cssSelect('> ul:first-of-type > li', jobs)

	let titleText = getText(title).trim()
	const offCampus = /^Off Campus/.test(titleText)
	if (offCampus) {
		titleText = titleText.replace(/^Off Campus: +/, '')
	}

	const detailMap: Map<string, string> = details.reduce((coll, listEl) => {
		let [key, ...value] = listEl.children
		key = getText(key).replace(/:$/, '')

		if (booleanKeys.includes(key)) {
			value = true
		} else if (paragraphicalKeys.includes(key)) {
			value = cssSelect('p', listEl)
				.map(getText)
				.join('\n\n')
				.trim()
		} else {
			value = getText(value).trim()
		}

		coll.set(key, value)

		return coll
	}, new Map())

	const description = detailMap.get('Description') || ''
	const links = Array.from(getUrls(description))

	return {
		title: titleText,
		offCampus: offCampus,
		department: detailMap.get('Department or Office'),
		dateOpen: detailMap.get('Date Open') || 'Unknown',
		duringTerm: Boolean(detailMap.get('Position available during term')),
		duringBreak: Boolean(detailMap.get('Position available during break')),
		description: detailMap.get('Description') || '',
		links: links,
	}
}
