import * as React from 'react'
import { Touchable } from '../touchable'
import * as c from '../colors'
import { commonStyles, rightButtonStyles } from './styles'
import { useRouter } from 'expo-router'
import Ionicon from '@expo/vector-icons/Ionicons'

export function OpenSettingsButton(): React.JSX.Element {
  const router = useRouter()

  return (
    <Touchable
      accessibilityLabel="Open Settings"
      accessibilityRole="button"
      accessible={true}
      borderless={true}
      highlight={false}
      onPress={() => {
        router.navigate('../settings')
      }}
      style={commonStyles.button}
      testID="button-open-settings"
    >
      <Ionicon
        name="cog"
        style={[rightButtonStyles.icon, { color: c.white }]}
      />
    </Touchable>
  )
}
