import { useState } from 'react'
import { Copy, Download, Upload, Palette, Trash2, Check } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { useCustomTheme } from '@/store/custom-theme.store'
import { CustomTheme, ThemeColors } from '@/types/customTheme'
import { ColorPicker } from './color-picker'
import { ThemePreview } from './theme-preview'
import { toast } from 'react-toastify'
import { hslToHex, hexToHsl } from '@/utils/theme-utils'

const defaultColors: ThemeColors = {
  background: '224 71.4% 8.1%',
  backgroundForeground: '222 47% 11%',
  foreground: '210 20% 95%',
  card: '224 71.4% 8.1%',
  cardForeground: '210 20% 95%',
  popover: '224 71.4% 8.1%',
  popoverForeground: '210 20% 95%',
  primary: '160 84% 39%',
  primaryForeground: '210 20% 95%',
  secondary: '215 27.9% 19.9%',
  secondaryForeground: '210 20% 95%',
  muted: '215 27.9% 14.9%',
  mutedForeground: '217.9 10.6% 64.9%',
  accent: '215 27.9% 19.9%',
  accentForeground: '210 20% 95%',
  destructive: '0 62.8% 30.6%',
  destructiveForeground: '210 20% 95%',
  border: '215 27.9% 19.9%',
  input: '215 27.9% 19.9%',
  ring: '160 84% 39%',
}

const colorLabels: Record<keyof ThemeColors, string> = {
  background: 'Background',
  backgroundForeground: 'Background Foreground',
  foreground: 'Text Color',
  card: 'Card Background',
  cardForeground: 'Card Text',
  popover: 'Popover Background',
  popoverForeground: 'Popover Text',
  primary: 'Primary Color',
  primaryForeground: 'Primary Text',
  secondary: 'Secondary Color',
  secondaryForeground: 'Secondary Text',
  muted: 'Muted Background',
  mutedForeground: 'Muted Text',
  accent: 'Accent Color',
  accentForeground: 'Accent Text',
  destructive: 'Destructive/Error',
  destructiveForeground: 'Destructive Text',
  border: 'Border Color',
  input: 'Input Background',
  ring: 'Focus Ring',
}

export function ThemeCreatorDialog() {
  const [open, setOpen] = useState(false)
  const [themeName, setThemeName] = useState('My Custom Theme')
  const [colors, setColors] = useState<ThemeColors>(defaultColors)
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const {
    customThemes,
    addCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
    setActiveCustomTheme,
    activeCustomTheme,
  } = useCustomTheme()

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const theme: CustomTheme = {
      id: editingThemeId || `custom-${Date.now()}`,
      name: themeName,
      colors,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    if (editingThemeId) {
      updateCustomTheme(editingThemeId, theme)
      toast.success('Theme updated successfully!')
    } else {
      addCustomTheme(theme)
      toast.success('Theme created successfully!')
    }

    resetForm()
    setOpen(false)
  }

  const handleEdit = (theme: CustomTheme) => {
    setEditingThemeId(theme.id)
    setThemeName(theme.name)
    setColors(theme.colors)
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteCustomTheme(id)
    toast.success('Theme deleted successfully!')
  }

  const handleExport = (id: string) => {
    const json = exportTheme(id)
    if (json) {
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${customThemes.find((t) => t.id === id)?.name || 'theme'}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Theme exported successfully!')
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const json = event.target?.result as string
          const theme = importTheme(json)
          if (theme) {
            toast.success('Theme imported successfully!')
          } else {
            toast.error('Failed to import theme. Invalid format.')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleApplyTheme = (id: string) => {
    const theme = customThemes.find((t) => t.id === id)
    if (theme) {
      // Apply theme colors to CSS variables
      const root = document.documentElement
      Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        root.style.setProperty(`--${cssVar}`, value)
      })
      setActiveCustomTheme(id)
      toast.success(`Applied theme: ${theme.name}`)
    }
  }

  const resetForm = () => {
    setEditingThemeId(null)
    setThemeName('My Custom Theme')
    setColors(defaultColors)
    setShowPreview(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Palette className="h-4 w-4" />
          Theme Creator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {editingThemeId ? 'Edit Custom Theme' : 'Create Custom Theme'}
          </DialogTitle>
          <DialogDescription>
            Customize all colors to create your perfect theme. Changes are previewed in real-time.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          {/* Color Editor */}
          <ScrollArea className="flex-1 h-[500px] pr-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Enter theme name"
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                {Object.entries(colorLabels).map(([key, label]) => (
                  <ColorPicker
                    key={key}
                    label={label}
                    value={colors[key as keyof ThemeColors]}
                    onChange={(value) => handleColorChange(key as keyof ThemeColors, value)}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Preview */}
          <div className="w-80">
            <ThemePreview colors={colors} themeName={themeName} />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              resetForm()
              setOpen(false)
            }}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingThemeId ? 'Update Theme' : 'Create Theme'}
            </Button>
          </div>
        </div>

        {/* Saved Themes List */}
        {customThemes.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-semibold mb-3">Your Custom Themes</h3>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {customThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className="flex items-center justify-between p-2 rounded-md border"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: hslToHex(theme.colors.primary) }}
                      />
                      <span className="text-sm font-medium">{theme.name}</span>
                      {activeCustomTheme === theme.id && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApplyTheme(theme.id)}
                      >
                        Apply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(theme)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExport(theme.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(theme.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
