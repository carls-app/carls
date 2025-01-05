import { Stack } from 'expo-router'
import { sharedScreenOptions } from '../shared/screenOptions'

export default function HoursLayout() {
  return (
    <Stack>
      <Stack.Screen name="list" options={sharedScreenOptions} />
    </Stack>
  )
}
