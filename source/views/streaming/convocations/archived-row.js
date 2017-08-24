// @flow

import React from 'react'
import {StyleSheet} from 'react-native'
import {ListRow, Detail, Title} from '../../components/list'

const styles = StyleSheet.create({
  row: {
    paddingTop: 5,
    paddingBottom: 5,
  },
})

export class ArchivedConvocationRow extends React.PureComponent {
  props: {
    event: ParsedPodcastEpisode,
    onPress: ParsedPodcastEpisode => any,
  }

  _onPress = () => this.props.onPress(this.props.event)

  render() {
    const {event} = this.props

    let annotation = ''
    if (event.enclosure && event.enclosure.type) {
      if (event.enclosure.type.startsWith('audio/')) {
        annotation = '🎧'
      } else if (event.enclosure.type.startsWith('video/')) {
        annotation = '📺'
      }
    }

    return (
      <ListRow
        contentContainerStyle={styles.row}
        arrowPosition="center"
        onPress={this._onPress}
      >
        <Title>{annotation} {event.title}</Title>
        <Detail lines={4}>{event.description}</Detail>
      </ListRow>
    )
  }
}
