import {setVersionInfo, setAppName, setTimezone} from '../modules/constants'

// TODO: setup sentry
// https://docs.expo.dev/guides/using-sentry/
export const SENTRY_DSN = ''

import {version, name} from '../../package.json'

setVersionInfo(version)
setAppName(name)
setTimezone('America/Chicago')
