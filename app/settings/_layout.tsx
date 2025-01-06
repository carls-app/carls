import {Stack} from 'expo-router'
import {sharedScreenOptions} from '../shared/screenOptions'
import { CloseScreenButton } from '../modules/navigation-buttons'

export const SettingsLayout = () => (
    <Stack>
        <Stack.Screen name="settings" options={sharedScreenOptions} />
    </Stack>
)

export default SettingsLayout
