// @flow
/**
 * All About Olaf
 * iOS SIS page
 */

import {TabNavigator} from '../components/tabbed-view'

import BalancesView from './balances'
import {StudentWorkView} from './student-work-carls'
// import CoursesView from './courses'
// import SearchView from './search'

export default TabNavigator(
  {
    BalancesView: {screen: BalancesView},
    StudentWorkView: {screen: StudentWorkView},
    // CoursesView: {screen: CoursesView},
    // CourseSearchView: {screen: CourseSearchView},
  },
  {
    navigationOptions: {
      title: 'The Hub',
    },
  },
)
