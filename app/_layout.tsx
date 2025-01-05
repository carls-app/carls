import {Stack, useNavigationContainerRef} from 'expo-router'
import {useReactNavigationDevTools} from '@dev-plugins/react-navigation'
import {useReactQueryDevTools} from '@dev-plugins/react-query'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import * as c from './modules/colors'

const queryClient = new QueryClient({})

export default function RootLayout(): React.JSX.Element {
	const navigationRef = useNavigationContainerRef()
	useReactNavigationDevTools(navigationRef)
	useReactQueryDevTools(queryClient)

	return (
		<QueryClientProvider client={queryClient}>
			<Stack
				screenOptions={{
					headerTintColor: c.white,
					headerStyle: {backgroundColor: c.carletonBlue}
				}}>
					<Stack.Screen
						name="index"
						options={{headerTitle: 'CARLS'}}
					/>
					<Stack.Screen
						name="menus"
						options={{headerTitle: 'Menus'}}
					/>
					<Stack.Screen
						name="transportation"
						options={{headerTitle: 'Transportation'}}
					/>
					<Stack.Screen
						name="building-hours"
						options={{headerTitle: 'Building Hours'}}
					/>		
			</Stack>
		</QueryClientProvider>
	)
}
