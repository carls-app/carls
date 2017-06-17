// @flow
import React from 'react'
import {TabBarIcon} from '../components/tabbar-icon'
import {View, Platform, ScrollView, StyleSheet} from 'react-native'
import type {TopLevelViewPropsType} from '../types'
import {Row} from '../components/layout'
import {ListRow, ListSeparator, Title} from '../components/list'
import {BonAppHostedMenu} from './menu-bonapp'
import {GitHubHostedMenu} from './menu-github'

export const StavHallMenuView = ({navigation}: TopLevelViewPropsType) =>
  <BonAppHostedMenu
    navigation={navigation}
    name="stav"
    cafeId="261"
    loadingMessage={[
      'Hunting Ferndale Turkey…',
      'Tracking wild vegan burgers…',
      '"Cooking" some lutefisk…',
    ]}
  />
StavHallMenuView.navigationOptions = {
  tabBarLabel: 'Stav Hall',
  tabBarIcon: TabBarIcon('nutrition'),
}

export const TheCageMenuView = ({navigation}: TopLevelViewPropsType) =>
  <BonAppHostedMenu
    navigation={navigation}
    name="cage"
    cafeId="262"
    ignoreProvidedMenus={true}
    loadingMessage={['Checking for vegan cookies…', 'Serving up some shakes…']}
  />
TheCageMenuView.navigationOptions = {
  tabBarLabel: 'The Cage',
  tabBarIcon: TabBarIcon('cafe'),
}

export const ThePauseMenuView = ({navigation}: TopLevelViewPropsType) =>
  <GitHubHostedMenu
    navigation={navigation}
    name="pause"
    loadingMessage={['Mixing up a shake…', 'Spinning up pizzas…']}
  />
ThePauseMenuView.navigationOptions = {
  tabBarLabel: 'The Pause',
  tabBarIcon: TabBarIcon('paw'),
}

export class CafeIndex extends React.Component {
  props: TopLevelViewPropsType

  render() {
    const stolafCafes = [
      {id: 'StavHallMenuView', title: 'Burton'},
      {id: 'TheCageMenuView', title: 'LDC'},
      {id: 'ThePauseMenuView', title: 'Weitz Center'},
    ]

    return (
      <ScrollView style={styles.container}>
        {stolafCafes.map((loc: {id: string, title: string}, i, collection) =>
          <View key={i}>
            <ListRow
              onPress={() => this.props.navigation.navigate(loc.id)}
              arrowPosition="center"
            >
              <Row alignItems="center">
                <Title style={styles.rowText}>{loc.title}</Title>
              </Row>
            </ListRow>
            {i < collection.length - 1
              ? <ListSeparator spacing={{left: 15}} />
              : null}
          </View>,
        )}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  rowText: {
    paddingVertical: 6,
  },
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
})
