// @flow
import * as React from 'react'
import {NoonNewsRowView} from './row'
import {reportNetworkProblem} from '../../../lib/report-network-problem'
import {SectionList, StyleSheet} from 'react-native'
import {ListSeparator, ListSectionHeader} from '../../components/list'
import {NoticeView} from '../../components/notice'
import LoadingView from '../../components/loading'
import * as c from '../../components/colors'
import groupBy from 'lodash/groupBy'
import toPairs from 'lodash/toPairs'
import qs from 'querystring'
import delay from 'delay'
import type {TopLevelViewPropsType} from '../../types'
import type {NewsBulletinType} from './types'

const groupBulletins = (bulletins: NewsBulletinType[]) => {
	const grouped = groupBy(bulletins, m => m.category)
	return toPairs(grouped).map(([key, value]) => ({title: key, data: value}))
}

const styles = StyleSheet.create({
	listContainer: {
		backgroundColor: c.white,
	},
})

type Props = TopLevelViewPropsType & {
	url: string,
}

type State = {
	bulletins: Array<NewsBulletinType>,
	loading: boolean,
	refreshing: boolean,
}

export class NoonNewsView extends React.PureComponent<Props, State> {
	state = {
		bulletins: [],
		loading: true,
		refreshing: false,
	}

	componentWillMount() {
		this.fetchData().then(() => {
			this.setState(() => ({loading: false}))
		})
	}

	refresh = async (): any => {
		const start = Date.now()
		this.setState(() => ({refreshing: true}))

		await this.fetchData()

		// wait 0.5 seconds – if we let it go at normal speed, it feels broken.
		const elapsed = Date.now() - start
		if (elapsed < 500) {
			await delay(500 - elapsed)
		}

		this.setState(() => ({refreshing: false}))
	}

	fetchData = async () => {
		let params = {
			style: 'rss',
		}

		const noonNewsURL = `${this.props.url}?${qs.stringify(params)}`
		const bulletins = await fetchXml(noonNewsURL)
			.then(resp => resp.rss.channel.item)
			.catch(err => {
				reportNetworkProblem(err)
				return []
			})

		this.setState(() => ({bulletins}))
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
