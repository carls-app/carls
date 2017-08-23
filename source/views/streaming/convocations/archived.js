// @flow

import React from 'react'
import {TabBarIcon} from '../../components/tabbar-icon'
import {StyleSheet, SectionList, ScrollView} from 'react-native'
import * as c from '../../components/colors'
import toPairs from 'lodash/toPairs'
import type {TopLevelViewPropsType} from '../../types'
import type {EventType} from '../calendar/types'
import groupBy from 'lodash/groupBy'
import moment from 'moment-timezone'
import {ListSeparator, ListSectionHeader} from '../../components/list'
import {NoticeView} from '../../components/notice'
import bugsnag from '../../../bugsnag'
import {tracker} from '../../../analytics'
import delay from 'delay'
import LoadingView from '../../components/loading'
import {ListRow, Detail, Title} from '../../components/list'

export class ArchivedConvocationsView extends React.PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Past Convos',
    tabBarIcon: TabBarIcon('recording'),
  }

  render() {
    return (
      <ReasonCalendarView2
        navigation={this.props.navigation}
        calendarUrl="https://apps.carleton.edu/events/convocations/"
      />
    )
  }
}

type PodcastEpisode = {
  title: string,
  description: string,
  pubDate: string,
  enclosure: {
    $: {
      url: string,
      length: string,
      type: string,
    },
  },
}

type ParsedPodcastEpisode = {
  title: string,
  description: string,
  pubDate: moment,
  enclosure: {
    url: string,
    length: string,
    type: string,
  },
}

export class ReasonCalendarView2 extends React.Component {
  props: {calendarUrl: string, calendarProps?: any} & TopLevelViewPropsType

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

  convertEvents(data: PodcastEpisode[]): ParsedPodcastEpisode[] {
    return data.map(event => {
      return {
        ...event,
        pubDate: moment(event.pubDate),
        enclosure: event.enclosure ? event.enclosure.$ : null,
      }
    })
  }

  fetch = (url): Array<PodcastEpisode> =>
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
      events: this.convertEvents(data),
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

  groupEvents = (events: EventType[]): any => {
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
        ListEmptyComponent={<NoticeView text="No convocations." />}
        style={styles.container}
        sections={this.groupEvents(this.state.events)}
        keyExtractor={this.keyExtractor}
        refreshing={this.state.refreshing}
        onRefresh={this.state.onRefresh}
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
  row: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  '🎧': {
    width: 200,
    height: 100,
  },
  '📺': {
    width: 200,
    height: 100,
  },
})

import Video from 'react-native-video'
class ArchivedConvocationRow extends React.PureComponent {
  props: {
    event: ParsedPodcastEpisode,
    onPress: ParsedPodcastEpisode => any,
  }

  _onPress = () => this.props.onPress(this.props.event)

  render() {
    const {event} = this.props

    let annotation = event.enclosure.type.startsWith('audio/')
      ? '🎧'
      : event.enclosure.type.startsWith('video/') ? '📺' : ''

    return (
      <ListRow
        contentContainerStyle={styles.row}
        arrowPosition="center"
        onPress={this._onPress}
      >
        <Title>{annotation} {event.title}</Title>
        {/*<Detail>{event.pubDate.calendar()}</Detail>*/}
        <Detail>{event.description}</Detail>
      </ListRow>
    )
  }
}

export class ArchivedConvocationDetailView extends React.PureComponent {
  props: {navigation: {state: {params: {event: ParsedPodcastEpisode}}}}

  render() {
    const {navigation: {state: {params: {event}}}} = this.props
    const annotation = event.enclosure.type.startsWith('audio/')
      ? '🎧'
      : event.enclosure.type.startsWith('video/') ? '📺' : ''
    const style = styles[annotation]
    console.warn(event.enclosure.url)
    return (
      <ScrollView>
        <Title>{event.title}</Title>

        {event.enclosure
          ? <Video
              source={{uri: event.enclosure.url}}
              style={style}
              controls={true}
              playInBackground={true}
              playWhenInactive={true}
            />
          : ''}
      </ScrollView>
    )
  }
}
