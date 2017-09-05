// @flow
/**
 * All About Olaf
 * KSTO page
 */

import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
  Image,
} from 'react-native'
import * as c from '../components/colors'
import Icon from 'react-native-vector-icons/Ionicons'
import {Touchable} from '../components/touchable'
import {TabBarIcon} from '../components/tabbar-icon'
import {trackedOpenUrl} from '../components/open-url'

const image = require('../../../images/streaming/krlx.png')

export default class KSTOView extends React.PureComponent {
  static navigationOptions = {
    tabBarLabel: 'KRLX',
    tabBarIcon: TabBarIcon('radio'),
  }

  openWebsite = () => {
    trackedOpenUrl({url: 'http://live.krlx.org', id: 'krlx-stream'})
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <Image source={image} style={styles.logo} />
          </View>
          <Touchable
            style={buttonStyles.button}
            hightlight={false}
            onPress={this.openWebsite}
          >
            <View style={buttonStyles.buttonWrapper}>
              <Icon style={buttonStyles.icon} name="ios-play" />
              <Text style={buttonStyles.action}>Listen to KRLX</Text>
            </View>
          </Touchable>
          <Text selectable={true} style={styles.subheading}>
            88.1 KRLX-FM is the radio station at Carleton College.
            Independent and completely student-run since its origin
            in 1948, KRLX broadcasts 24 hours a day during the academic
            year, with over 200 student participants each term.
          </Text>
        </View>
      </ScrollView>
    )
  }
}

const viewport = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wrapper: {
    padding: 10,
  },
  logo: {
    maxWidth: viewport.width / 1.2,
    maxHeight: viewport.height / 2.0,
  },
  subheading: {
    marginTop: 5,
  },
})

const buttonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: c.denim,
    width: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  icon: {
    color: c.white,
    fontSize: 30,
  },
  action: {
    color: c.white,
    paddingLeft: 10,
    paddingTop: 7,
    fontWeight: '900',
  },
})
