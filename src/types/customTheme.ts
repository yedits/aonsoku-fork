export interface ThemeColors {
  background: string
  backgroundForeground: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
}

export interface CustomTheme {
  id: string
  name: string
  colors: ThemeColors
  createdAt: number
  updatedAt: number
}

export interface ICustomThemeContext {
  customThemes: CustomTheme[]
  activeCustomTheme: string | null
  addCustomTheme: (theme: CustomTheme) => void
  updateCustomTheme: (id: string, theme: Partial<CustomTheme>) => void
  deleteCustomTheme: (id: string) => void
  setActiveCustomTheme: (id: string | null) => void
  getCustomTheme: (id: string) => CustomTheme | undefined
  exportTheme: (id: string) => string | null
  importTheme: (themeJson: string) => CustomTheme | null
}
