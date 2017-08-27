// @flow

import React from 'react'
import {TabBarIcon} from '../components/tabbar-icon'
import {StyleSheet, SectionList} from 'react-native'
import * as c from '../components/colors'
import toPairs from 'lodash/toPairs'
import type {TopLevelViewPropsType} from '../types'
import groupBy from 'lodash/groupBy'
import moment from 'moment-timezone'
import {ListSeparator, ListSectionHeader} from '../components/list'
import {NoticeView} from '../components/notice'
import bugsnag from '../../bugsnag'
import {tracker} from '../../analytics'
import delay from 'delay'
import LoadingView from '../components/loading'
import {ArchivedConvocationRow} from './archived-row'
import type {RawPodcastEpisode, ParsedPodcastEpisode} from './types'

export class ArchivedConvocationsView extends React.PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Past Convos',
    tabBarIcon: TabBarIcon('recording'),
  }

  props: TopLevelViewPropsType

  state: {
    events: ParsedPodcastEpisode[],
    loaded: boolean,
    refreshing: boolean,
    error: ?Error,
  } = {
    events: [],
    loaded: false,
    refreshing: true,
    error: null,
  }

  componentWillMount() {
    this.refresh()
  }

  convertEvents(data: RawPodcastEpisode[]): ParsedPodcastEpisode[] {
    return data.map(event => ({
      title: event.title,
      description: event.description,
      pubDate: moment(event.pubDate),
      enclosure: event.enclosure ? event.enclosure.$ : null,
    }))
  }

  fetch = (url: string): Array<RawPodcastEpisode> =>
    fetchXml(url).then(resp => resp.rss.channel.item)

  getEvents = async () => {
    let url =
      'https://apps.carleton.edu/events/convocations/feeds/media_files?page_id=342645'

    let data = []
    try {
      data = await this.fetch(url)
      console.log(data)
    } catch (err) {
      tracker.trackException(err.message)
      bugsnag.notify(err)
      this.setState({error: err.message})
      console.warn(err)
    }

    this.setState(() => ({
      loaded: true,
      events: this.convertEvents(data).filter(
        ep =>
          ep.enclosure &&
          ep.enclosure.type &&
          ep.enclosure.type.startsWith('video/'),
      ),
    }))
  }

  refresh = async () => {
    let start = Date.now()
    this.setState({refreshing: true})

    await this.getEvents()

    // wait 0.5 seconds – if we let it go at normal speed, it feels broken.
    let elapsed = start - Date.now()
    if (elapsed < 500) {
      await delay(500 - elapsed)
    }

    this.setState({refreshing: false})
  }

  groupEvents = (events: ParsedPodcastEpisode[]): any => {
    const grouped = groupBy(events, event =>
      event.pubDate.format('MMMM Do, YYYY'),
    )

    return toPairs(grouped).map(([title, data]) => ({title, data}))
  }

  onPressEvent = (event: ParsedPodcastEpisode) =>
    this.props.navigation.navigate('ArchivedConvocationDetailView', {event})

  renderSectionHeader = ({section: {title}}: any) =>
    // the proper type is ({section: {title}}: {section: {title: string}})
    <ListSectionHeader title={title} spacing={{left: 10}} />

  renderItem = ({item}: {item: ParsedPodcastEpisode}) =>
    <ArchivedConvocationRow onPress={this.onPressEvent} event={item} />

  keyExtractor = (item: ParsedPodcastEpisode, index: number) => index.toString()

  render() {
    if (!this.state.loaded) {
      return <LoadingView />
    }

    return (
      <SectionList
        ItemSeparatorComponent={ListSeparator}
        ListEmptyComponent={<NoticeView text="No convocations found." />}
        style={styles.container}
        sections={this.groupEvents(this.state.events)}
        keyExtractor={this.keyExtractor}
        refreshing={this.state.refreshing}
        onRefresh={this.refresh}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.white,
  },
})
