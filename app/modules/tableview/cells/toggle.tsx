import * as React from 'react'
import {Switch} from 'react-native'
import {Cell} from '../index'

interface PropsType {
	label: string
	value: boolean
	onChange: (val: boolean) => void
	detail?: string
	disabled?: boolean
}

export function CellToggle(props: PropsType): React.JSX.Element {
	let {value, onChange, label, detail, disabled} = props

	let toggle = (
		<Switch
			disabled={disabled}
			onValueChange={onChange}
			value={value}
		/>
	)

	return (
		<Cell
			cellAccessoryView={toggle}
			cellStyle={detail != null ? 'Subtitle' : 'Basic'}
			detail={detail}
			title={label}
		/>
	)
}
