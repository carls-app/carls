// @flow
import htmlparser from 'htmlparser2'
import cssSelect from 'css-select'
import ElementType from 'domelementtype'
export {cssSelect}

const isTag = ElementType.isTag

export function parseHtml(string: string): Object {
	return htmlparser.parseDOM(string, {
		withDomLvl1: true,
		normalizeWhitespace: false,
		xmlMode: false,
		decodeEntities: true,
	})
}

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
