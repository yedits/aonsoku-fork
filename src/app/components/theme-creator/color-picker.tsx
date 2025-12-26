import { useState } from 'react'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { hslToHex, hexToHsl } from '@/utils/theme-utils'

interface ColorPickerProps {
  label: string
  value: string // HSL format: "220 13% 16%"
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(hslToHex(value))

  const handleHexChange = (hex: string) => {
    setHexValue(hex)
    const hsl = hexToHsl(hex)
    onChange(hsl)
  }

  const handleHslChange = (newValue: string) => {
    onChange(newValue)
    setHexValue(hslToHex(newValue))
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <div className="flex gap-2 mt-1">
          <div className="relative flex-1">
            <Input
              type="text"
              value={value}
              onChange={(e) => handleHslChange(e.target.value)}
              className="pr-10 font-mono text-xs"
              placeholder="220 13% 16%"
            />
            <div
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded border"
              style={{ backgroundColor: hexValue }}
            />
          </div>
          <Input
            type="color"
            value={hexValue}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-16 h-9 p-1 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
