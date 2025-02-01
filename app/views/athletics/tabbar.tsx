import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Animated, Dimensions } from 'react-native'
import { DateSection } from './types'
import { Constants } from './constants'
import * as c from '../../modules/colors'

interface TabBarProps {
  selectedSection: DateSection | 'Filter'
  onSelectSection: (section: DateSection | 'Filter') => void
}

export function TabBar({
  selectedSection,
  onSelectSection,
}: TabBarProps): React.JSX.Element {
  const sections: (DateSection | 'Filter')[] = [
    Constants.YESTERDAY,
    Constants.TODAY,
    Constants.UPCOMING,
    Constants.FILTER,
  ]

  const handlePress = (section: DateSection | 'Filter') => {
    if (section !== selectedSection) {
      onSelectSection(section)
    }
  }

  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const index = sections.indexOf(selectedSection)
    Animated.spring(animatedValue, {
      toValue: index,
      useNativeDriver: false,
    }).start()
  }, [selectedSection])

  const tabWidth = Dimensions.get('window').width / sections.length
  const translateX = animatedValue.interpolate({
    inputRange: [0, sections.length - 1],
    outputRange: [0, tabWidth * (sections.length - 1)],
  })

  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <TouchableOpacity
          key={section}
          style={styles.tab}
          onPress={() => handlePress(section)}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.tabText,
              selectedSection === section && styles.selectedTabText,
            ]}
          >
            {section}
          </Text>
        </TouchableOpacity>
      ))}
      <Animated.View
        style={[
          styles.animatedTabIndicator,
          { width: tabWidth, transform: [{ translateX }] },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: c.systemBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.separator,
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: c.carletonBlue,
  },
  tabText: {
    fontSize: 14,
    color: c.label,
  },
  selectedTabText: {
    fontWeight: 'bold',
    color: c.carletonBlue,
  },
  animatedTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: c.carletonBlue,
  },
})
