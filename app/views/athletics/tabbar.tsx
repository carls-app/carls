import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <TouchableOpacity
          key={section}
          style={[
            styles.tab,
            selectedSection === section && styles.selectedTab,
          ]}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: c.systemBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.separator,
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
})
