import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface FilterState {
  selectedSports: string[]
  totalSports: number
  setSelectedSports: (sports: string[]) => void
  setTotalSports: (count: number) => void
  toggleSport: (sport: string) => void
}

export const useFilterStore = create(
  persist<FilterState>(
    (set, get) => ({
      selectedSports: ['All'],
      totalSports: 0,
      setSelectedSports: (sports) => set({ selectedSports: sports }),
      setTotalSports: (count) => set({ totalSports: count }),
      toggleSport: (sport) =>
        set((state) => {
          const isSelected = state.selectedSports.includes(sport)
          const updatedSports = isSelected
            ? state.selectedSports.filter(
                (selectedSport) => selectedSport !== sport,
              )
            : [...state.selectedSports, sport]
          return { selectedSports: updatedSports }
        }),
    }),
    {
      name: 'athletics',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)

export const selectShowChangeFiltersMessage = (state: FilterState) => {
  const filtersWithoutAll = state.selectedSports.filter(
    (filter) => filter !== 'All',
  )
  const noFiltersSelected = filtersWithoutAll.length === 0
  const allFiltersSelected = filtersWithoutAll.length === state.totalSports
  return (
    noFiltersSelected || (filtersWithoutAll.length > 0 && !allFiltersSelected)
  )
}
