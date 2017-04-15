// @flow
/**
 * All About Olaf
 * Menus page
 */

import React from 'react'

import type {TopLevelViewPropsType} from '../types'
import TabbedView from '../components/tabbed-view'
import {BonAppHostedMenu} from './menu-bonapp'
// import {BonAppPickerView} from './dev-bonapp-picker'

export function MenusView({navigator, route}: TopLevelViewPropsType) {
  return (
    <TabbedView
      tabs={[
        {
          id: 'BurtonMenuView',
          title: 'Burton',
          icon: 'trophy',
          component: () => (
            <BonAppHostedMenu
              navigator={navigator}
              route={route}
              name="Burton"
              cafeId="35"
              loadingMessage={[
                'Searching for Schiller…',
              ]}
            />
          ),
        },
        {
          id: 'LDCMenuView',
          title: 'LDC',
          icon: 'water',
          component: () => (
            <BonAppHostedMenu
              navigator={navigator}
              route={route}
              name="LDC"
              cafeId="36"
              loadingMessage={[
                'Tracking down empty seats…',
              ]}
            />
          ),
        },
        {
          id: 'WeitzMenuView',
          title: 'Weitz Center',
          icon: 'wine',
          component: () => (
            <BonAppHostedMenu
              navigator={navigator}
              route={route}
              name="weitz"
              cafeId="458"
              loadingMessage={['Observing the artwork…', 'Previewing performances…']}
            />
          ),
        },
        {
          id: 'SaylesMenuView',
          title: 'Sayles Hill',
          icon: 'snow',
          component: () => (
            <BonAppHostedMenu
              navigator={navigator}
              route={route}
              name="sayles"
              cafeId="34"
              loadingMessage={['Engaging in people-watching…', 'Checking the mail…']}
            />
          ),
        },
      ]}
    />
  )
}
