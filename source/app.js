/**
 * @flow
 * All About Olaf
 * Index view
 */

// Tweak the global fetch
import './globalize-fetch'
import {tracker} from './analytics'
import OneSignal from 'react-native-onesignal'

import React from 'react'
import {Navigator, BackAndroid, StyleSheet, Platform} from 'react-native'
import {Provider} from 'react-redux'
import {store} from './flux'
import * as c from './views/components/colors'
import {
  Title,
  LeftButton,
  RightButton,
  configureScene,
} from './views/components/navigation'

import CalendarView from './views/calendar'
import {ContactsView} from './views/contacts'
import {HomeView, EditHomeView} from './views/home'
import {MenusView} from './views/menus'
import {BonAppHostedMenu} from './views/menus/menu-bonapp'
import {FilterView} from './views/components/filter'
import NewsView from './views/news'
import NewsItemView from './views/news/news-item'
import {
  BuildingHoursView,
  BuildingHoursDetailView,
} from './views/building-hours'
import TransportationView from './views/transportation'
import SettingsView from './views/settings'
import SISLoginView from './views/settings/login'
import CreditsView from './views/settings/credits'
import PrivacyView from './views/settings/privacy'
import LegalView from './views/settings/legal'
import {FaqView} from './views/faqs'

import NoRoute from './views/components/no-route'

// Render a given scene
function renderScene(route, navigator) {
  let props = {route, navigator, ...(route.props || {})}
  tracker.trackScreenView(route.id)

  switch (route.id) {
    case 'HomeView':
      return <HomeView {...props} />
    case 'MenusView':
      return <MenusView {...props} />
    case 'BonAppHostedMenu':
      return <BonAppHostedMenu {...props} />
    case 'FilterView':
      return <FilterView {...props} />
    case 'CalendarView':
      return <CalendarView {...props} />
    case 'ContactsView':
      return <ContactsView {...props} />
    case 'NewsView':
      return <NewsView {...props} />
    case 'NewsItemView':
      return <NewsItemView {...props} />
    case 'BuildingHoursView':
      return <BuildingHoursView {...props} />
    case 'BuildingHoursDetailView':
      return <BuildingHoursDetailView {...props} />
    case 'TransportationView':
      return <TransportationView {...props} />
    case 'SettingsView':
      return <SettingsView {...props} />
    case 'SISLoginView':
      return <SISLoginView {...props} />
    case 'CreditsView':
      return <CreditsView {...props} />
    case 'PrivacyView':
      return <PrivacyView {...props} />
    case 'LegalView':
      return <LegalView {...props} />
    case 'EditHomeView':
      return <EditHomeView {...props} />
    case 'FaqView':
      return <FaqView {...props} />
    default:
      return <NoRoute {...props} />
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 64 : 56,
    flex: 1,
    backgroundColor: Platform.OS === 'ios'
      ? c.iosLightBackground
      : c.androidLightBackground,
  },
  navigationBar: {
    backgroundColor: '#0b5091',
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: StyleSheet.hairlineWidth},
        shadowColor: 'rgb(100, 100, 100)',
        shadowOpacity: 0.5,
        shadowRadius: StyleSheet.hairlineWidth,
      },
      android: {
        elevation: 4,
      },
    }),
  },
})

export default class App extends React.Component {
  componentDidMount() {
    tracker.trackEvent('app', 'launch')
    BackAndroid.addEventListener(
      'hardwareBackPress',
      this.registerAndroidBackButton,
    )

    OneSignal.addEventListener('received', this.onReceived)
    OneSignal.addEventListener('opened', this.onOpened)
    OneSignal.addEventListener('registered', this.onRegistered)
    OneSignal.addEventListener('ids', this.onIds)
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener(
      'hardwareBackPress',
      this.registerAndroidBackButton,
    )

    OneSignal.removeEventListener('received', this.onReceived)
    OneSignal.removeEventListener('opened', this.onOpened)
    OneSignal.removeEventListener('registered', this.onRegistered)
    OneSignal.removeEventListener('ids', this.onIds)
  }

  onReceived(notification: any) {
    console.log('Notification received:', notification)
  }

  onOpened(openResult: any) {
    console.log('Message:', openResult.notification.payload.body)
    console.log('Data:', openResult.notification.payload.additionalData)
    console.log('isActive:', openResult.notification.isAppInFocus)
    console.log('openResult:', openResult)
  }

  onRegistered(notifData: any) {
    console.log('Device is now registered for push notifications!', notifData)
  }

  onIds(device: any) {
    console.log('Device info:', device)
  }

  _navigator: Navigator

  registerAndroidBackButton = () => {
    if (this._navigator && this._navigator.getCurrentRoutes().length > 1) {
      this._navigator.pop()
      return true
    }
    return false
  }

  render() {
    return (
      <Provider store={store}>
        <Navigator
          ref={nav => this._navigator = nav}
          navigationBar={
            <Navigator.NavigationBar
              style={styles.navigationBar}
              routeMapper={{
                LeftButton,
                RightButton,
                Title,
              }}
            />
          }
          initialRoute={{
            id: 'HomeView',
            title: 'CARLS',
            index: 0,
          }}
          renderScene={renderScene}
          sceneStyle={styles.container}
          configureScene={configureScene}
        />
      </Provider>
    )
  }
}
