// @flow
/**
 * KRLX page
 */

import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Dimensions,
} from 'react-native'
import {TabBarIcon} from '../components/tabbar-icon'
import {Button} from '../components/button'
import * as c from '../components/colors'

function openWebsite() {
  Linking.openURL('https://www.stolaf.edu/multimedia/play/embed/ksto.html')
    .catch(() => {})
}

export default function KRLXView() {
  return (
    <View style={styles.container}>
      <Text selectable={true} style={styles.heading}>
        Carleton College Radio
      </Text>
      <Text selectable={true} style={styles.heading}>KRLX 88.1 FM</Text>
      <Button onPress={openWebsite} title="Listen to KRLX" />
      <Text selectable={true} style={styles.subheading}>
        88.1 KRLX-FM is the radio station at Carleton College.
        Independent and completely student-run since its origin
        in 1948, KRLX broadcasts 24 hours a day during the academic
        year, with over 200 student participants each term.
      </Text>
    </View>
  )
}
KRLXView.navigationOptions = {
  tabBarLabel: 'KRLX',
  tabBarIcon: TabBarIcon('radio'),
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 15,
  },
  heading: {
    marginTop: 5,
    color: c.kstoPrimaryDark,
    fontSize: 25,
  },
  subheading: {
    marginTop: 5,
  },
})
