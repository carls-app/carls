// @flow
/**
 * All About Olaf
 * Media page
 */

import {TabNavigator} from '../components/tabbed-view'

import KRLXView from './krlx'
// import WeeklyMovieView from './movie'

export default TabNavigator(
  {
    KRLXRadioView: {screen: KRLXView},
    // WeeklyMovieView: {screen: WeeklyMovieView},
  },
  {
    navigationOptions: {
      title: 'Streaming Media',
    },
  },
)
