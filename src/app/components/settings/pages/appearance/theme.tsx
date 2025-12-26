import clsx from 'clsx'
import { Check, Minus, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ContentItemTitle } from '@/app/components/settings/section'
import { ThemeCreatorDialog } from '@/app/components/theme-creator/theme-creator-dialog'
import { appThemes } from '@/app/observers/theme-observer'
import { useTheme } from '@/store/theme.store'
import { useCustomTheme } from '@/store/custom-theme.store'
import { Theme } from '@/types/themeContext'
import { CustomTheme } from '@/types/customTheme'
import { Button } from '@/app/components/ui/button'
import { toast } from 'react-toastify'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog'

export function ThemeSettingsPicker() {
  const { t } = useTranslation()
  const { theme: currentTheme, setTheme } = useTheme()
  const { customThemes, deleteCustomTheme, activeCustomTheme, setActiveCustomTheme } = useCustomTheme()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const applyCustomTheme = (theme: CustomTheme) => {
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      root.style.setProperty(`--${cssVar}`, value)
    })
    setActiveCustomTheme(theme.id)
    toast.success(`Applied theme: ${theme.name}`)
  }

  const handleDeleteTheme = (id: string) => {
    deleteCustomTheme(id)
    setDeleteConfirm(null)
    toast.success('Theme deleted')
  }

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <ContentItemTitle>{t('theme.label')}</ContentItemTitle>
        <ThemeCreatorDialog />
      </div>

      {/* Built-in Themes */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Built-in Themes</h3>
        <div className="w-full grid grid-cols-4 gap-3">
          {appThemes.map((theme) => {
            const isActive = theme === currentTheme && !activeCustomTheme

            return (
              <div key={theme} onClick={() => {
                setTheme(theme)
                setActiveCustomTheme(null)
              }}>
                <ThemePlaceholder theme={theme} />
                <ThemeTitle theme={theme} isActive={isActive} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom Themes */}
      {customThemes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Your Custom Themes</h3>
          <div className="w-full grid grid-cols-4 gap-3">
            {customThemes.map((theme) => {
              const isActive = activeCustomTheme === theme.id

              return (
                <div key={theme.id} className="group relative">
                  <div onClick={() => applyCustomTheme(theme)}>
                    <CustomThemePlaceholder theme={theme} />
                    <CustomThemeTitle theme={theme} isActive={isActive} />
                  </div>
                  
                  {/* Action Buttons - Show on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(theme.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Theme</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this theme? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteTheme(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function ThemePlaceholder({ theme }: { theme: Theme }) {
  return (
    <div className={theme}>
      <div className="bg-background aspect-square border border-border rounded overflow-hidden flex cursor-pointer hover:border-primary transition-colors">
        <div className="w-1/3 h-full bg-background border-r border-border flex flex-col p-1 gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full h-1/5 bg-accent rounded-[2px]" />
          ))}
        </div>
        <div className="w-full h-full bg-background-foreground flex flex-col gap-1 p-1 *:w-full *:h-1/4 *:rounded-[2px]">
          <div className="bg-accent" />
          <div className="bg-primary" />
          <div className="bg-muted" />
          <div className="bg-secondary" />
        </div>
      </div>
    </div>
  )
}

function CustomThemePlaceholder({ theme }: { theme: CustomTheme }) {
  const { colors } = theme
  
  return (
    <div>
      <div 
        className="aspect-square border-2 border-border rounded overflow-hidden flex cursor-pointer hover:border-primary transition-colors"
        style={{ backgroundColor: `hsl(${colors.background})` }}
      >
        <div 
          className="w-1/3 h-full border-r flex flex-col p-1 gap-1"
          style={{ 
            backgroundColor: `hsl(${colors.background})`,
            borderColor: `hsl(${colors.border})`
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="w-full h-1/5 rounded-[2px]" 
              style={{ backgroundColor: `hsl(${colors.accent})` }}
            />
          ))}
        </div>
        <div className="w-full h-full flex flex-col gap-1 p-1">
          <div 
            className="w-full h-1/4 rounded-[2px]" 
            style={{ backgroundColor: `hsl(${colors.accent})` }}
          />
          <div 
            className="w-full h-1/4 rounded-[2px]" 
            style={{ backgroundColor: `hsl(${colors.primary})` }}
          />
          <div 
            className="w-full h-1/4 rounded-[2px]" 
            style={{ backgroundColor: `hsl(${colors.muted})` }}
          />
          <div 
            className="w-full h-1/4 rounded-[2px]" 
            style={{ backgroundColor: `hsl(${colors.secondary})` }}
          />
        </div>
      </div>
    </div>
  )
}

type ThemeTitleProps = {
  isActive: boolean
  theme: Theme
}

export function ThemeTitle({ isActive, theme }: ThemeTitleProps) {
  const { t } = useTranslation()

  return (
    <span
      className={clsx(
        'mt-2 flex items-center gap-1',
        !isActive && 'text-muted-foreground/70',
      )}
    >
      <Check
        size={16}
        strokeWidth={2}
        className={clsx(!isActive && 'hidden')}
        aria-hidden="true"
      />
      <Minus
        size={16}
        strokeWidth={2}
        className={clsx(isActive && 'hidden')}
        aria-hidden="true"
      />
      <span className="text-xs font-medium">{t(`theme.${theme}`)}</span>
    </span>
  )
}

function CustomThemeTitle({ isActive, theme }: { isActive: boolean; theme: CustomTheme }) {
  return (
    <span
      className={clsx(
        'mt-2 flex items-center gap-1',
        !isActive && 'text-muted-foreground/70',
      )}
    >
      <Check
        size={16}
        strokeWidth={2}
        className={clsx(!isActive && 'hidden')}
        aria-hidden="true"
      />
      <Minus
        size={16}
        strokeWidth={2}
        className={clsx(isActive && 'hidden')}
        aria-hidden="true"
      />
      <span className="text-xs font-medium">{theme.name}</span>
    </span>
  )
}
