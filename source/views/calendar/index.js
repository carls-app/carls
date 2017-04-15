// @flow
/**
 * All About Olaf
 * Calendar page
 */

import React from 'react'

import TabbedView from '../components/tabbed-view'
import {GoogleCalendarView} from './calendar-google'

export default function CalendarPage() {
  return (
    <TabbedView
      tabs={[
        {
          id: 'CarletonMasterCalendarView',
          title: 'Carleton',
          icon: 'school',
          component: () => (
            <GoogleCalendarView calendarId="c7lu6q4995afqqv43de8okj416pajcf8@import.calendar.google.com" />
          ),
        },
        {
          id: 'NorthfieldCalendarView',
          title: 'Northfield',
          icon: 'pin',
          component: () => (
            <GoogleCalendarView calendarId="thisisnorthfield%40gmail.com" />
          ),
        },
      ]}
    />
  )
}
