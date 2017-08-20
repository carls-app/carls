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

const image = require('../../../images/streaming/ksto/ksto-logo.png')

export default class KSTOView extends React.PureComponent {
  static navigationOptions = {
    tabBarLabel: 'KRLX',
    tabBarIcon: TabBarIcon('radio'),
  }

  changeControl = () => {
    trackedOpenUrl({url: 'http://live.krlx.org', id: 'krlx-stream'})
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Logo />
          <PlayPauseButton onPress={this.changeControl} />
        </View>
      </ScrollView>
    )
  }
}

const Logo = () =>
  <View style={styles.wrapper}>
    <Image source={image} style={styles.logo} />
  </View>

class PlayPauseButton extends React.PureComponent {
  props: {
    onPress: () => any,
  }

  render() {
    const {onPress} = this.props
    return (
      <Touchable
        style={buttonStyles.button}
        hightlight={false}
        onPress={onPress}
      >
        <View style={buttonStyles.buttonWrapper}>
          <Icon style={buttonStyles.icon} name="ios-play" />
          <Text style={buttonStyles.action}>Listen</Text>
        </View>
      </Touchable>
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
