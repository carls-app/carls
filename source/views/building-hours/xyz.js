// @flow

import moment from 'moment'
import values from 'lodash/values'
import entries from 'lodash/entries'
import partition from 'lodash/partition'
import type {BuildingType, DayOfWeekEnumType} from './types'

type XyzDayOfWeekEnumType =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun'

type TermHoursType = {|
  days: XyzDayOfWeekEnumType[],
  open: string,
  close: string,
  note?: string,
|}

type FancyPhoneNumbersType = {|
  general: number | string,
  toll_free: number | string,
  departments: Array<{name: string, number: number | string}>,
|}

type XyzBuildingType = {|
  slug: string,
  abbr: string,
  name: string,
  location: ?string,
  building: ?string,
  website: ?string,
  phone: ?(number | string | FancyPhoneNumbersType),
  email: ?string,
  access: 'public' | 'carleton',
  note?: string,
  term_hours: TermHoursType[],
|}

type XyzResponseType = {[key: string]: XyzBuildingType}

const url = 'https://sayleshill.xyz/data/buildings.json'
const data = require('../../../docs/building-hours-2.json')

export const fetchXyzHours = () => fetchJson(url).then(xyzToAao)
export const loadBackupXyzHours = () => xyzToAao(data)

function xyzToAao(jsonBody: XyzResponseType): BuildingType[] {
  return values(jsonBody).map(single)
}

function single(building: XyzBuildingType): BuildingType {
  let schedules = building.term_hours.map((set, i) =>
    convertSchedules(set, building.note, i),
  )

  // separate out the "hours" schedules from the named ones
  let [plain, other] = partition(schedules, s => s.title === 'Hours')
  if (plain.length > 1) {
    // if we have any "hours" schedules, combine them into one schedule with multiple "hours" sets
    let combined = plain.reduce((acc, current) => ({
      ...acc,
      hours: [...acc.hours, ...current.hours],
    }))
    // then, reset `schedules` to contain both our new object and the named schedules, if any
    schedules = [combined, ...other]
  }
  let blank = [{title: 'Hours', notes: '', hours: []}]
  return {
    category: lookupCategory(building),
    name: building.name,
    // subtitle: building.abbr,
    // subtitle: building.building || "",
    schedule: schedules.length ? schedules : blank,
  }
}

function convertSchedules(hours: TermHoursType, notes: ?string) {
  let retval: any = {title: hours.note || 'Hours'}
  retval.hours = [
    {
      days: hours.days.map(convertDay),
      from: to12Hour(hours.open),
      to: to12Hour(hours.close),
    },
  ]
  if (notes) {
    retval.notes = notes
  }
  return retval
}

const xyzDays = {
  mon: 'Mo',
  tue: 'Tu',
  wed: 'We',
  thu: 'Th',
  fri: 'Fr',
  sat: 'Sa',
  sun: 'Su',
}

const convertDay = (day: XyzDayOfWeekEnumType): DayOfWeekEnumType =>
  xyzDays[day]

const to12Hour = time => moment(time, 'HH:mm').format('h:mma')

function lookupCategory(building): string {
  for (let [category, slugs] of entries(categories)) {
    if (slugs.includes(building.slug)) {
      return category
    }
  }
  return 'Other'
}

const categories = {
  Dining: [
    'burton',
    'ldc',
    'ldc-express',
    'sayles-cafe',
    'sayles-cafe-eq',
    'sayles-cafe-taco',
    'sayles-cafe-late-night',
    'weitz-cafe',
    'stav',
    'stav-bag',
  ],
  'Sayles-Hill Campus Center': [
    'sayles-cafe',
    'sayles-cafe-eq',
    'sayles-cafe-taco',
    'sayles-cafe-late-night',
    'bookstore',
    'post',
    'info',
    'sao',
    'ccce',
    'career',
    'krlx',
    'record-libe',
  ],
  'Student Life and Support': [
    'gsc',
    'shac',
    'oiil',
    'ocs',
    'msc',
    'writing',
    'language',
    'doso',
    'reslife',
  ],
  Buildings: ['sayles', 'cmc', 'weitz'],
  'Information Technology Services': [
    'its',
    'its-dropoff',
    'its-libe',
    'peps',
    'idealab',
  ],
  'Laurence McKinley Gould Library': [
    'libe',
    'reference',
    'its-libe',
    'writing',
    'archives',
  ],
  Recreation: [
    'rec',
    'wall',
    'bouldering',
    'cowling',
    'cowling-pool',
    'west',
    'thorpe',
    'stadium',
  ],
  'Business and Administration': [
    'registrar',
    'mail',
    'print',
    'business',
    'business-cashier',
    'doso',
    'reslife',
  ],
  Other: ['perlman', 'camsproduction'],
}
