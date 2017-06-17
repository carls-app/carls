// @flow
/**
 * All About Olaf
 * Menus page
 */

import React from 'react'
import {StackNavigator} from 'react-navigation'
import {TabNavigator} from '../components/tabbed-view'
import {TabBarIcon} from '../components/tabbar-icon'

import {BonAppHostedMenu} from './menu-bonapp'
import {GitHubHostedMenu} from './menu-github'
import {
  StavHallMenuView,
  TheCageMenuView,
  ThePauseMenuView,
  CafeIndex,
} from './stolaf-menus'
// import {BonAppPickerView} from './dev-bonapp-picker'

const StOlafMenuPicker = StackNavigator(
  {
    CafeIndex: {screen: CafeIndex},
    ThePauseMenuView: {screen: ThePauseMenuView},
    TheCageMenuView: {screen: TheCageMenuView},
    StavHallMenuView: {screen: StavHallMenuView},
  },
  {
    headerMode: 'none',
  },
)

export const MenusView = TabNavigator(
  {
    BurtonMenuScreen: {
      screen: ({navigation}) =>
        <BonAppHostedMenu
          navigation={navigation}
          name="burton"
          cafeId="35"
          loadingMessage={['Searching for Schiller…']}
        />,
      navigationOptions: {
        tabBarLabel: 'Burton',
        tabBarIcon: TabBarIcon('trophy'),
      },
    },

    LDCMenuScreen: {
      screen: ({navigation}) =>
        <BonAppHostedMenu
          navigation={navigation}
          name="ldc"
          cafeId="36"
          loadingMessage={['Tracking down empty seats…']}
        />,
      navigationOptions: {
        tabBarLabel: 'LDC',
        tabBarIcon: TabBarIcon('water'),
      },
    },

    SaylesMenuScreen: {
      screen: ({navigation}: TopLevelViewPropsType) =>
        <BonAppHostedMenu
          navigation={navigation}
          name="sayles"
          cafeId="34"
          loadingMessage={[
            'Engaging in people-watching…',
            'Checking the mail…',
          ]}
        />,
      navigationOptions: {
        title: 'Sayles Hill',
        tabBarIcon: TabBarIcon('cafe'),
      },
    },

    WeitzMenuScreen: {
      screen: ({navigation}) =>
        <BonAppHostedMenu
          navigation={navigation}
          name="weitz"
          cafeId="458"
          loadingMessage={[
            'Observing the artwork…',
            'Previewing performances…',
          ]}
        />,
      navigationOptions: {
        tabBarLabel: 'Weitz Center',
        tabBarIcon: TabBarIcon('wine'),
      },
    },

    StOlafMenuListView: {
      screen: StOlafMenuPicker,
      navigationOptions: {
        title: 'St. Olaf',
        tabBarIcon: TabBarIcon('menu'),
      },
    },

    // BonAppDevToolView: {screen: BonAppPickerView},
  },
  {
    navigationOptions: {
      title: 'Menus',
    },
  },
)
