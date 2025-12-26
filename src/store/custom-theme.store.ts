import merge from 'lodash/merge'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { CustomTheme, ICustomThemeContext } from '@/types/customTheme'

const initialCustomThemes: CustomTheme[] = []

export const useCustomThemeStore = createWithEqualityFn<ICustomThemeContext>()(
  subscribeWithSelector(
    persist(
      devtools(
        immer((set, get) => ({
          customThemes: initialCustomThemes,
          activeCustomTheme: null,

          addCustomTheme: (theme: CustomTheme) => {
            set((state) => {
              state.customThemes.push(theme)
            })
          },

          updateCustomTheme: (id: string, theme: Partial<CustomTheme>) => {
            set((state) => {
              const index = state.customThemes.findIndex((t) => t.id === id)
              if (index !== -1) {
                state.customThemes[index] = { ...state.customThemes[index], ...theme }
              }
            })
          },

          deleteCustomTheme: (id: string) => {
            set((state) => {
              state.customThemes = state.customThemes.filter((t) => t.id !== id)
              if (state.activeCustomTheme === id) {
                state.activeCustomTheme = null
              }
            })
          },

          setActiveCustomTheme: (id: string | null) => {
            set((state) => {
              state.activeCustomTheme = id
            })
          },

          getCustomTheme: (id: string) => {
            return get().customThemes.find((t) => t.id === id)
          },

          exportTheme: (id: string) => {
            const theme = get().customThemes.find((t) => t.id === id)
            if (!theme) return null
            return JSON.stringify(theme, null, 2)
          },

          importTheme: (themeJson: string) => {
            try {
              const theme = JSON.parse(themeJson) as CustomTheme
              // Generate new ID to avoid conflicts
              const newTheme = { ...theme, id: `custom-${Date.now()}` }
              set((state) => {
                state.customThemes.push(newTheme)
              })
              return newTheme
            } catch (error) {
              console.error('Failed to import theme:', error)
              return null
            }
          },
        })),
        {
          name: 'custom_theme_store',
        },
      ),
      {
        name: 'custom_theme_store',
        version: 1,
        merge: (persistedState, currentState) => {
          return merge(currentState, persistedState)
        },
      },
    ),
  ),
)

export const useCustomTheme = () => useCustomThemeStore((state) => state)
