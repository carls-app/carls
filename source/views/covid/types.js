// @flow

export type UpdateType = {
	id: number,
	date: string,
	date_gmt: string,
	guid: GuidType,
	modified: string,
	modified_gmt: string,
	slug: string,
	status: string,
	type: string,
	link: string,
	title: TitleType,
	content: ContentType,
	excerpt: ExcerptType,
	author: number,
	featured_media: number,
	comment_status: string,
	ping_status: string,
	sticky: boolean,
	template: string,
	format: string,
	meta: any[],
	categories: number[],
	tags: any[],
	_links: LinksType,
}

export type GuidType = {
	rendered: string,
}

export type TitleType = {
	rendered: string,
}

export type ContentType = {
	rendered: string,
	protected: boolean,
}

export type ExcerptType = {
	rendered: string,
	protected: boolean,
}

export type LinksType = {
	self: SelfItemType[],
	collection: CollectionItemType[],
	about: AboutItemType[],
	author: AuthorItemType[],
	replies: RepliesItemType[],
	'version-history': VersionHistoryItemType[],
	'predecessor-version': PredecessorVersionItemType[],
	'wp:attachment': WpAttachmentItemType[],
	'wp:term': WpTermItemType[],
	curies: CuriesItemType[],
}

export type SelfItemType = {
	href: string,
}

export type CollectionItemType = {
	href: string,
}

export type AboutItemType = {
	href: string,
}

export type AuthorItemType = {
	embeddable: boolean,
	href: string,
}

export type RepliesItemType = {
	embeddable: boolean,
	href: string,
}

export type VersionHistoryItemType = {
	count: number,
	href: string,
}

export type PredecessorVersionItemType = {
	id: number,
	href: string,
}

export type WpAttachmentItemType = {
	href: string,
}

export type WpTermItemType = {
	taxonomy: string,
	embeddable: boolean,
	href: string,
}

export type CuriesItemType = {
	name: string,
	href: string,
	templated: boolean,
}
