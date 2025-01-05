import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import {Tabs} from 'expo-router'

export default function TabLayout(): React.JSX.Element {
	return (
		<Tabs screenOptions={{headerShown: false}}>
			<Tabs.Screen
				name="burton"
				options={{
					title: 'Burton',
					tabBarIcon: ({color}) => (
						<FontAwesome6 size={28} name="ice-cream" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="ldc"
				options={{
					title: 'LDC',
					tabBarIcon: ({color}) => (
						<FontAwesome6 size={28} name="carrot" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="sayles"
				options={{
					title: 'Sayles Hill',
					tabBarIcon: ({color}) => (
						<FontAwesome6 size={28} name="mug-hot" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="weitz"
				options={{
					title: 'Weitz Center',
					tabBarIcon: ({color}) => (
						<FontAwesome6 size={28} name="utensils" color={color} />
					),
				}}
			/>			
		</Tabs>
	)
}
