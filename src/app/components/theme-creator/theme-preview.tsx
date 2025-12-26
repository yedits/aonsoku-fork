import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { ThemeColors } from '@/types/customTheme'
import { Play, Heart, MoreHorizontal } from 'lucide-react'

interface ThemePreviewProps {
  colors: ThemeColors
  themeName: string
}

export function ThemePreview({ colors, themeName }: ThemePreviewProps) {
  const previewStyle = {
    '--preview-background': colors.background,
    '--preview-foreground': colors.foreground,
    '--preview-card': colors.card,
    '--preview-card-foreground': colors.cardForeground,
    '--preview-primary': colors.primary,
    '--preview-primary-foreground': colors.primaryForeground,
    '--preview-secondary': colors.secondary,
    '--preview-secondary-foreground': colors.secondaryForeground,
    '--preview-muted': colors.muted,
    '--preview-muted-foreground': colors.mutedForeground,
    '--preview-accent': colors.accent,
    '--preview-accent-foreground': colors.accentForeground,
    '--preview-border': colors.border,
  } as React.CSSProperties

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Preview</h3>
      <div
        className="rounded-lg p-4 border-2"
        style={{
          backgroundColor: `hsl(${colors.background})`,
          color: `hsl(${colors.foreground})`,
          borderColor: `hsl(${colors.border})`,
          ...previewStyle,
        }}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: `hsl(${colors.border})` }}>
            <h4 className="font-semibold text-sm">{themeName}</h4>
            <button className="text-xs" style={{ color: `hsl(${colors.mutedForeground})` }}>
              Preview Mode
            </button>
          </div>

          {/* Card */}
          <div
            className="rounded-md p-3 space-y-2"
            style={{
              backgroundColor: `hsl(${colors.card})`,
              color: `hsl(${colors.cardForeground})`,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-12 h-12 rounded"
                style={{ backgroundColor: `hsl(${colors.muted})` }}
              />
              <div className="flex-1">
                <div className="text-xs font-medium">Song Title</div>
                <div className="text-xs" style={{ color: `hsl(${colors.mutedForeground})` }}>
                  Artist Name
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 rounded px-3 py-1.5 text-xs font-medium flex items-center justify-center gap-1"
                style={{
                  backgroundColor: `hsl(${colors.primary})`,
                  color: `hsl(${colors.primaryForeground})`,
                }}
              >
                <Play className="h-3 w-3" />
                Play
              </button>
              <button
                className="rounded px-3 py-1.5 text-xs"
                style={{
                  backgroundColor: `hsl(${colors.secondary})`,
                  color: `hsl(${colors.secondaryForeground})`,
                }}
              >
                <Heart className="h-3 w-3" />
              </button>
              <button
                className="rounded px-3 py-1.5 text-xs"
                style={{
                  backgroundColor: `hsl(${colors.secondary})`,
                  color: `hsl(${colors.secondaryForeground})`,
                }}
              >
                <MoreHorizontal className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Input Example */}
          <div
            className="rounded px-3 py-2 text-xs"
            style={{
              backgroundColor: `hsl(${colors.input})`,
              borderColor: `hsl(${colors.border})`,
            }}
          >
            Search...
          </div>

          {/* Muted Text */}
          <p className="text-xs" style={{ color: `hsl(${colors.mutedForeground})` }}>
            This is muted text for secondary information.
          </p>

          {/* Accent */}
          <div
            className="rounded p-2 text-xs"
            style={{
              backgroundColor: `hsl(${colors.accent})`,
              color: `hsl(${colors.accentForeground})`,
            }}
          >
            Accent element
          </div>
        </div>
      </div>
    </div>
  )
}
