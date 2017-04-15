/* eslint-disable camelcase */
/**
 * @flow
 * All About Olaf
 * News page
 */

import NewsContainer from './news-container'

import React from 'react'

import type {TopLevelViewPropsType} from '../types'
import TabbedView from '../components/tabbed-view'

export default function NewsPage({navigator, route}: TopLevelViewPropsType) {
  return (
    <TabbedView
      tabs={[
        {
          id: 'CarletonNewsView',
          title: 'Carleton',
          icon: 'school',
          component: () => (
            <NewsContainer
              navigator={navigator}
              route={route}
              mode="rss"
              url="https://apps.carleton.edu/media_relations/feeds/blogs/news"
              name="Carleton"
            />
          ),
        },
        {
          id: 'CarletonianNewsView',
          title: 'The Carletonian',
          icon: 'paper',
          component: () => (
            <NewsContainer
              navigator={navigator}
              route={route}
              mode="rss"
              url="https://apps.carleton.edu/carletonian/feeds/blogs/tonian"
              name="The Carletonian"
            />
          ),
        },
        {
          id: 'KrlxNewsView',
          title: 'KRLX',
          icon: 'radio',
          component: () => (
            <NewsContainer
              navigator={navigator}
              route={route}
              mode="wp-json"
              url="https://www.krlx.org/wp-json/wp/v2/posts/"
              query={{per_page: 10, _embed: true}}
              name="KRLX"
            />
          ),
        },
      ]}
    />
  )
}
