// @flow

export type StudentOrgType = {
	contacts: Array<string>,
	description: string,
	categories: Array<string>,
	website: string,
	name: string,
}

export type CleanedStudentOrgType = {
	contacts: Array<string>,
	description: string,
	category: string,
	website: string,
	name: string,
}
