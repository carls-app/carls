import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface FilterState {
  selectedSports: string[]
  setSelectedSports: (sports: string[]) => void
  toggleSport: (sport: string) => void
}

export const useFilterStore = create(
  persist<FilterState>(
    (set) => ({
      selectedSports: ['All'],
      setSelectedSports: (sports) => set({ selectedSports: sports }),
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
