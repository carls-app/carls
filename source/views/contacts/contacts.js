/**
 * @flow
 * All About Olaf
 * iOS Contact page
 */

import React from 'react'
import {FlatList, View, StyleSheet} from 'react-native'
import {ListEmpty, ListFooter} from '../components/list'
import {ContactCard} from './card'
import {data} from './data'
import type {CardType} from './types'

const AAO_URL = 'https://github.com/carls-app/carls/issues/new'

const styles = StyleSheet.create({
  list: {
    paddingTop: 5,
    marginHorizontal: 5,
  },
  separator: {
    height: 5,
  },
})

const ContactsSeparator = () => <View style={styles.separator} />

export default class ContactView extends React.PureComponent {
  static navigationOptions = {
    title: 'Important Contacts',
    headerBackTitle: 'Contacts',
  }

  keyExtractor = (item: CardType) => item.title

  renderItem = ({item}: {item: CardType}) => <ContactCard {...item} />

  render() {
    return (
      <FlatList
        ItemSeparatorComponent={ContactsSeparator}
        ListEmptyComponent={<ListEmpty mode="bug" />}
        ListFooterComponent={
          <ListFooter title="Collected by the humans of CARLS" href={AAO_URL} />
        }
        style={styles.list}
        data={data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    )
  }
}
