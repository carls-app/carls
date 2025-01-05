import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import {Tabs} from 'expo-router'
import {sharedTabScreenOptions} from '../shared/screenOptions'

export default function TabLayout(): React.JSX.Element {
	return (
		<Tabs screenOptions={sharedTabScreenOptions}>
			<Tabs.Screen
				name="express"
				options={{
					title: 'Express Bus',
					tabBarIcon: ({color}) => (
						<FontAwesome6 size={28} name="bus" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="blue-line"
				options={{
					title: 'Blue Line',
					tabBarIcon: ({color}) => (
						<FontAwesome6 size={28} name="bus-simple" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="other-modes"
				options={{
					title: 'Other Modes',
					tabBarIcon: ({color}) => (
						<FontAwesome6 size={28} name="ship" color={color} />
					),
				}}
			/>
		</Tabs>
	)
}
