// @flow

import jsYaml from 'js-yaml'
import type {WordType} from '../types'
import {sendEmail} from '../../components/send-email'
import querystring from 'querystring'
import {GH_NEW_ISSUE_URL} from '../../../globals'
import wrap from 'wordwrap'

export function submitReport(current: WordType, suggestion: WordType) {
	// calling trim() on these to remove the trailing newlines
	const before = stringifyDictionaryEntry(current).trim()
	const after = stringifyDictionaryEntry(suggestion).trim()

	const body = makeEmailBody(before, after, current.word)

	return sendEmail({
		to: ['rives@stolaf.edu'],
		subject: `[dictionary] Suggestion for ${current.word}`,
		body,
	})
}

function makeEmailBody(before: string, after: string, title: string): string {
	return `
Hi! Thanks for letting us know about a dictionary change.

Please do not change anything below this line.

------------

Project maintainers: ${makeIssueLink(before, after, title)}

${makeHtmlBody(before, after)}
`
}

const makeMarkdownBody = (before, after) =>
	`
## Before:

\`\`\`yaml
${before}
\`\`\`

## After:

\`\`\`yaml
${after}
\`\`\`
`

const makeHtmlBody = (before, after) => `
<p>Before:</p>
<pre><code>${before}</code></pre>

<p>After:</p>
<pre><code>${after}</code></pre>
`

function makeIssueLink(before: string, after: string, title: string): string {
	const q = querystring.stringify({
		'labels[]': 'data/dictionary',
		title: `Dictionary update for ${title}`,
		body: makeMarkdownBody(before, after),
	})
	return `${GH_NEW_ISSUE_URL}?${q}`
}

export function stringifyDictionaryEntry(entry: WordType): string {
	// let js-yaml handle dumping the word, just in case
	let initialData = jsYaml.safeDump({word: entry.word}, {flowLevel: 4})

	let definition = `definition: |
${wrap(2, 80)(entry.definition)}
`

	return `${initialData}${definition}`
}
