// @flow

import sax from 'sax'
import moment from 'moment'
import {type PodcastEpisode} from './types'
import {convosPodcastUrl} from './urls'

export type RawEpisode = {
	title: string,
	description: string,
	pubDate: string,
	enclosure: ?{
		url: string,
		length: string,
		type: string,
	},
}

type Args = {
	maxResults: number,
}

const parse = (xmlblob, {maxResults = 10}: Args = {}): Array<RawEpisode> => {
	const parser = sax.parser(true, {trim: true})

	let visited = 0
	let inItem = false
	let stopParsing = false

	const items = []
	let currentItem: {[key: ?string]: string} = {}
	let currentTag = null

	parser.onerror = () => {
		// clear the error
		parser.error = null
		parser.resume()
	}

	parser.onopentagstart = node => {
		if (node.name === 'item') {
			inItem = true
			currentItem = {}
		}
		currentTag = node.name
	}

	parser.onopentag = node => {
		if (node.name === 'enclosure') {
			currentItem.enclosure = node.attributes
		}
	}

	parser.onclosetag = tagName => {
		if (tagName === 'item') {
			visited += 1
			inItem = false
			items.push(currentItem)
		}

		if (visited > maxResults) {
			stopParsing = true
			parser.close()
			return
		}
	}

	parser.ontext = node => {
		if (!inItem) {
			return
		}

		if (!node.trim()) {
			return
		}

		currentItem[currentTag] = node
	}

	let charsWritten = 0
	let chunkSize = 100

	// eslint-disable-next-line no-unmodified-loop-condition
	while (charsWritten < xmlblob.length && !stopParsing) {
		// console.log(`wrote ${charsWritten} chars`)
		parser.write(xmlblob.substr(charsWritten, chunkSize))
		charsWritten += chunkSize
	}

	;((items: Array<any>): Array<RawEpisode>)

	return items.slice(0, maxResults)
}

const processConvo = (event: RawEpisode): PodcastEpisode => {
	return {
		title: event.title,
		description: event.description,
		pubDate: moment(event.pubDate),
		enclosure: event.enclosure ? event.enclosure : null,
	}
}

export const fetchConvos = async () => {
	const convosXml = await fetch(convosPodcastUrl).then(r => r.text())
	const convos = parse(convosXml)
	return convos.map(processConvo)
}
