import {setApiRoot} from '../modules/api'
import {DEFAULT_URL} from '../lib/constants'

export const configureApiRoot = async () => {
	setApiRoot(new URL(DEFAULT_URL))
}
