// @flow
import * as React from 'react'
import {NoonNewsRowView} from './row'
import {reportNetworkProblem} from '../../../lib/report-network-problem'
import {View, Text, SectionList, StyleSheet} from 'react-native'
import {ListSeparator, ListSectionHeader} from '../../components/list'
import {NoticeView} from '../../components/notice'
import LoadingView from '../../components/loading'
import * as c from '../../components/colors'
import groupBy from 'lodash/groupBy'
import toPairs from 'lodash/toPairs'
import delay from 'delay'
import {parseHtml, cssSelect} from '../../../lib/html'
import Icon from 'react-native-vector-icons/Ionicons'
import {openUrl} from '../../components/open-url'
import bugsnag from '../../../bugsnag'
import type {TopLevelViewPropsType} from '../../types'
import type {NewsBulletinType, PDFBulletinType} from './types'

const groupBulletins = (bulletins: NewsBulletinType[]) => {
	const grouped = groupBy(bulletins, m => m.category)
	return toPairs(grouped).map(([key, value]) => ({title: key, data: value}))
}

const styles = StyleSheet.create({
	listContainer: {
		backgroundColor: c.white,
	},
	footer: {
		paddingTop: 10,
		paddingBottom: 15,
	},
	footerText: {
		textAlign: 'center',
		fontSize: 15,
		color: c.infoBlue,
	},
})

const iconStyles = StyleSheet.create({
	icon: {
		textAlign: 'center',
		fontSize: 25,
		color: c.infoBlue,
	},
})

type Props = TopLevelViewPropsType & {
	url: string,
}

type State = {
	bulletins: Array<NewsBulletinType>,
	loading: boolean,
	pdfBulletin: PDFBulletinType,
	refreshing: boolean,
}

export class NoonNewsView extends React.PureComponent<Props, State> {
	state = {
		bulletins: [],
		loading: true,
		pdfBulletin: [],
		refreshing: false,
	}

	async componentWillMount() {
		await Promise.all([
			// load bulletin feed
			this.fetchData().catch(error => {
				bugsnag.notify(error)
				return null
			}),
			// scrape latest pdf info
			this.fetchPDF().then(() => {
				this.setState(() => ({loading: false}))
			}),
		])
	}

	refresh = async (): any => {
		const start = Date.now()
		this.setState(() => ({refreshing: true}))

		await this.fetchData()
		await this.fetchPDF()

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		const elapsed = Date.now() - start
		if (elapsed < 500) {
			await delay(500 - elapsed)
		}

		this.setState(() => ({refreshing: false}))
	}

	fetchData = async () => {
		const bulletins = await fetchXml(this.props.url)
			.then(resp => resp.rss.channel.item)
			.catch(err => {
				reportNetworkProblem(err)
				return []
			})

		this.setState(() => ({bulletins}))
	}

	fetchPDF = async () => {
		const url = this.props.pdfUrl
		const page = await fetch(url)
			.then(r => r.text())
			.catch(err => {
				reportNetworkProblem(err)
				return []
			})

		const dom = parseHtml(page)
		const node = cssSelect('.assets > ul > li > div > a > strong', dom)[0]
		const pdfName = node.children[0].data.replace(/^NNB +/, '')
		const pdfUrl = node.children[0].parent.parent.attribs.href
		const fullUrl = `https://apps.carleton.edu${pdfUrl}`

		const pdfBulletin = {
			name: pdfName,
			link: fullUrl,
		}

		this.setState(() => ({pdfBulletin}))
	}

	renderFooter = () => {
		const footerText = `View last published PDF\n${this.state.pdfBulletin.name}`
		const message = (
			<Text
				onPress={() => openUrl(this.state.pdfBulletin.link)}
				style={styles.footerText}
				suppressHighlighting={true}
			>
				{footerText}
			</Text>
		)

		const icon = (
			<Icon
				name="ios-link"
				onPress={() => openUrl(this.state.pdfBulletin.link)}
				style={iconStyles.icon}
			/>
		)

		return (
			<View style={styles.footer}>
				{icon}
				{message}
			</View>
		)
	}

	renderSectionHeader = ({section: {title}}: any) => (
		<ListSectionHeader title={title} />
	)

	renderItem = ({item}: {item: NewsBulletinType}) => (
		<NoonNewsRowView bulletin={item} />
	)

	keyExtractor = (item: NewsBulletinType, index: number) => index.toString()

	render() {
		if (this.state.loading) {
			return <LoadingView />
		}

		const groupedData = groupBulletins(this.state.bulletins)
		return (
			<SectionList
				ItemSeparatorComponent={ListSeparator}
				ListEmptyComponent={<NoticeView text="No bulletins." />}
				ListFooterComponent={this.renderFooter}
				data={groupedData}
				keyExtractor={this.keyExtractor}
				onRefresh={this.refresh}
				refreshing={this.state.refreshing}
				renderItem={this.renderItem}
				renderSectionHeader={this.renderSectionHeader}
				sections={groupedData}
				style={styles.listContainer}
			/>
		)
	}
}
