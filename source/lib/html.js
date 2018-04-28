// @flow
import htmlparser from 'htmlparser2'
import cssSelect from 'css-select'
import domSerializer from 'dom-serializer'
import ElementType from 'domelementtype'
export {cssSelect}

import {AllHtmlEntities} from 'html-entities'
const entities = new AllHtmlEntities()
const isTag = ElementType.isTag

export function parseHtml(string: string): Object {
	return htmlparser.parseDOM(string, {
		withDomLvl1: true,
		normalizeWhitespace: false,
		xmlMode: false,
		decodeEntities: true,
	})
}

let getOuterHTML = domSerializer
export {domSerializer as getOuterHTML}
//export {html2mdFromString as toMarkdown}

type DOMNode = Object
type DOMNodeList = Array<DOMNode>
type DOMElement = DOMNode | DOMNodeList

// from https://github.com/fb55/domutils/blob/master/lib/stringify.js
export function getText(elem: DOMElement): string {
	if (Array.isArray(elem)) return elem.map(getText).join('')
	if (isTag(elem)) return elem.name === 'br' ? '\n' : getText(elem.children)
	if (elem.type === ElementType.CDATA) return getText(elem.children)
	if (elem.type === ElementType.Text) return elem.data
	return ''
}

export function getTextWithSpaces(elem: DOMElement): string {
	if (Array.isArray(elem)) return elem.map(getText).join(' ')
	if (isTag(elem)) return elem.name === 'br' ? '\n' : getText(elem.children)
	if (elem.type === ElementType.CDATA) return getText(elem.children)
	if (elem.type === ElementType.Text) return elem.data
	return ''
}

export function getTrimmedTextWithSpaces(elem: DOMElement): string {
	return getTextWithSpaces(elem)
		.split(/\s+/)
		.join(' ')
		.trim()
}

export function removeHtmlWithRegex(str: string): string {
	return str.replace(/<[^>]*>/g, ' ')
}

export function fastGetTrimmedText(str: string): string {
	return removeHtmlWithRegex(str)
		.replace(/\s+/g, ' ')
		.trim()
}

function getInnerHTML(elem: DOMNode, opts: any) {
	return elem.children
		? elem.children.map(elem => getOuterHTML(elem, opts)).join('')
		: ''
}

// much of the following code was extracted from
// https://github.com/imcuttle/html-markdown/blob/95abc67d98c6b084877e29b85b405cd0da8ee685/lib.js#L33-L100
function jsdomText(dom) {
	let html = getInnerHTML(dom)
	if (!html) {
		return getText(dom)
	}

	html = html
		.replace(/<p.*?>(.*?)<\/p>/gim, '$1\n')
		.replace(/<div.*?>(.*?)<\/div>/gim, '$1\n')
		.replace(/<br.*?>/gim, '\n')
		.replace(/<(?:.)*?>/gm, '') // remove all html tags

	return entities.decode(html)
}

function elemsToMarkdown(domlist, baseUrl, parentTagName = '', level = 0) {
	parentTagName = parentTagName.toLowerCase()

	return domlist.reduce((markdown, dom, index) => {
		if (dom.nodeType === 8) {
			// comment node
			return markdown
		}

		if (dom.nodeType === 3) {
			// text node
			return markdown + dom.nodeValue
		}

		let part = toMarkdown(dom, baseUrl, parentTagName, index, level)
		return markdown + part
	}, '')
}

export function toMarkdown(
	dom: DOMNode,
	baseUrl: string,
	parentTagName: string = 'document',
	index: number = 0,
	level: number = 0,
) {
	let tagName = (dom.name || '').toLowerCase()
	let children = dom.children
	let existChild = children && children.length > 0

	let renderChildren = function(level) {
		return existChild
			? elemsToMarkdown(children, baseUrl, tagName, level)
			: dom.textContent
	}

	let headingRegex = /^h([\d]+)$/i
	if (headingRegex.test(tagName)) {
		return `${'#'.repeat(
			Number(tagName.replace(headingRegex, '$1')),
		)} ${renderChildren()}`
	}

	if (tagName === 'ul' || tagName === 'ol') {
		return `${renderChildren(level + (parentTagName === 'li' ? 1 : 0))}`
	}

	if (tagName === 'li') {
		let marker = parentTagName === 'ul' ? '-' : 1 + index + '.'
		return `${'   '.repeat(level)}${marker} ${renderChildren()}`
	}

	if (tagName === 'img') {
		return `![${dom.attribs.alt || ''}](${resolveLink(
			dom.attribs.src,
			baseUrl,
		)})`
	}

	if (tagName === 'p') {
		return `${renderChildren()}  `
	}

	if (tagName === 'code') {
		return '`' + renderChildren() + '`'
	}

	if (tagName === 'pre') {
		let body = jsdomText(dom)
			.replace(/^\r?\n/, '')
			.replace(/\r?\n$/, '')
		return '\n```\n' + `${body}\n` + '```\n'
	}

	if (tagName === 'a') {
		return `[${renderChildren()}](${resolveLink(dom.attribs.href, baseUrl)})`
	}

	if (tagName === 'div' || tagName === 'span') {
		return `${renderChildren()}`
	}

	if (tagName === 'strong') {
		return `**${renderChildren()}**`
	}

	if (tagName === 'em') {
		return `*${renderChildren()}*`
	}

	if (tagName === 'hr') {
		return '---'
	}

	if (tagName === 'del') {
		return `~~${renderChildren()}~~`
	}

	if (tagName === 'html' || tagName === 'body') {
		return renderChildren()
	}

	if (tagName === 'head') {
		return ''
	}

	if (tagName === 'br') {
		return '  \n'
	}

	return getOuterHTML(dom) //+'\r\n'
}

export function resolveLink(
	href: string,
	baseUrl: string,
	rootUrl: string = '',
) {
	// TODO: discover the root URL from the base URL instead of requiring it to be provided
	if (href.startsWith('/')) {
		return `${rootUrl}${href}`
	}
	if (href.startsWith('.')) {
		return `${baseUrl}${href}`
	}
	return href
}
