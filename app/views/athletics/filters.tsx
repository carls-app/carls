import React from 'react'
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import * as c from '../../modules/colors'
import { useFilterStore } from './store'

interface AthleticsFilterProps {
  sports: { title: string; data: string[] }[]
}

export function AthleticsFilters({
  sports,
}: AthleticsFilterProps): React.JSX.Element {
  const { selectedSports, toggleSport, setSelectedSports } = useFilterStore()

  const handleSelectAll = (section: string) => {
    const sectionSports = sports.find((s) => s.title === section)?.data || []
    const allSelected = sectionSports.every((sport) =>
      selectedSports.includes(sport),
    )
    if (allSelected) {
      setSelectedSports(
        selectedSports.filter((sport) => !sectionSports.includes(sport)),
      )
    } else {
      setSelectedSports([...new Set([...selectedSports, ...sectionSports])])
    }
  }

  return (
    <SectionList
      contentContainerStyle={styles.listContainer}
      sections={sports}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedSports.includes(item) && styles.selectedFilterButton,
          ]}
          onPress={() => toggleSport(item)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedSports.includes(item) && styles.selectedFilterButtonText,
            ]}
          >
            {item.replace(/^(Men's|Women's)\s/, '')}
          </Text>
        </TouchableOpacity>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View>
          <Text style={styles.sectionHeader}>{title}</Text>
          <TouchableOpacity
            style={[
              styles.filterButton,
              sports
                .find((s) => s.title === title)
                ?.data.every((sport) => selectedSports.includes(sport)) &&
                styles.selectedFilterButton,
            ]}
            onPress={() => handleSelectAll(title)}
          >
            <Text
              style={[
                styles.filterButtonText,
                sports
                  .find((s) => s.title === title)
                  ?.data.every((sport) => selectedSports.includes(sport)) &&
                  styles.selectedFilterButtonText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
      )}
      stickyHeaderHiddenOnScroll={true}
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    backgroundColor: c.systemGroupedBackground,
  },
  sectionHeader: {
    color: c.carletonBlue,
    backgroundColor: c.systemGroupedBackground,
    fontWeight: 'bold',
    paddingTop: 15,
  },
  filterButton: {
    backgroundColor: c.systemBackground,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: c.separator,
  },
  filterButtonText: {
    color: c.label,
    fontSize: 14,
  },
  selectedFilterButton: {
    backgroundColor: c.carletonBlue,
    borderColor: c.carletonBlue,
  },
  selectedFilterButtonText: {
    color: c.systemBackground,
    fontWeight: 'bold',
  },
})
