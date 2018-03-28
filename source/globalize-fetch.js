// @flow

import {parseString as parseXmlCb} from 'xml2js'
import promisify from 'pify'
const parseXml = promisify(parseXmlCb)
import {AAO_USER_AGENT} from './user-agent'

global.rawFetch = global.fetch

function status(response) {
	if (response.status >= 200 && response.status < 300) {
		return response
	} else {
		let error = new Error(response.statusText) // attach the original response to the thrown error
		;(error: any).response = response
		throw error
	}
}

function json(response) {
	return response.json()
}

async function xml(response) {
	const body = await response.text()
	return parseXml(body, {explicitArray: true})
}

// make fetch() calls throw if the server returns a non-200 status code
global.fetch = function(input, opts: {[key: string]: any} = {}) {
	if (opts) {
		opts.headers = opts.headers || new Headers({})

		if (!opts.headers.has('User-Agent')) {
			opts.headers.set('User-Agent', AAO_USER_AGENT)
		}
	}

	return global.rawFetch(input, opts).then(status)
}

// add a global fetchJson wrapper
global.fetchJson = (...args: any[]) => fetch(...args).then(json)

// add a global fetchXml wrapper
global.fetchXml = (...args: any[]) => fetch(...args).then(xml)
