import { useState, useEffect } from 'react'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { Slider } from '@/app/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover'
import { hslToHex, hexToHsl } from '@/utils/theme-utils'
import { Button } from '@/app/components/ui/button'
import { ColorWheel } from './color-wheel'

interface ColorPickerProps {
  label: string
  value: string // HSL format: "220 13% 16%"
  onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [hexValue, setHexValue] = useState(hslToHex(value))
  const [hslValues, setHslValues] = useState(() => {
    const parts = value.split(' ')
    return {
      h: parseInt(parts[0]) || 0,
      s: parseInt(parts[1]) || 0,
      l: parseInt(parts[2]) || 0,
    }
  })
  const [pasteValue, setPasteValue] = useState('')

  useEffect(() => {
    const parts = value.split(' ')
    const newHsl = {
      h: parseInt(parts[0]) || 0,
      s: parseInt(parts[1]) || 0,
      l: parseInt(parts[2]) || 0,
    }
    setHslValues(newHsl)
    setHexValue(hslToHex(value))
  }, [value])

  const handleHexChange = (hex: string) => {
    setHexValue(hex)
    const hsl = hexToHsl(hex)
    onChange(hsl)
  }

  const handleHslChange = (type: 'h' | 's' | 'l', newValue: number) => {
    const newHsl = { ...hslValues, [type]: newValue }
    setHslValues(newHsl)
    const hslString = `${newHsl.h} ${newHsl.s}% ${newHsl.l}%`
    onChange(hslString)
    setHexValue(hslToHex(hslString))
  }

  const handleWheelChange = (h: number, s: number, l: number) => {
    const newHsl = { h, s, l }
    setHslValues(newHsl)
    const hslString = `${h} ${s}% ${l}%`
    onChange(hslString)
    setHexValue(hslToHex(hslString))
  }

  const handlePaste = () => {
    const trimmed = pasteValue.trim()
    // Try hex format first
    if (trimmed.startsWith('#')) {
      handleHexChange(trimmed)
      setPasteValue('')
    } else {
      // Try HSL format
      onChange(trimmed)
      setPasteValue('')
    }
  }

  return (
    <div className="space-y-3">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      <div className="flex gap-3 items-start">
        {/* Color Preview and Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-20 h-20 p-1 rounded-lg border-2 hover:border-primary transition-colors flex-shrink-0"
              style={{ backgroundColor: hexValue }}
            >
              <div className="w-full h-full rounded-md" style={{ backgroundColor: hexValue }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex justify-center">
                <ColorWheel
                  hue={hslValues.h}
                  saturation={hslValues.s}
                  lightness={hslValues.l}
                  onChange={handleWheelChange}
                  size={240}
                />
              </div>
              
              {/* Lightness slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">Lightness</Label>
                  <span className="text-xs font-mono text-muted-foreground">{hslValues.l}%</span>
                </div>
                <Slider
                  value={[hslValues.l]}
                  onValueChange={([v]) => handleHslChange('l', v)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Paste input */}
              <div className="space-y-2">
                <Label className="text-xs">Paste Hex or HSL</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={pasteValue}
                    onChange={(e) => setPasteValue(e.target.value)}
                    placeholder="#FF0000 or 220 13% 16%"
                    className="text-xs font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handlePaste()
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handlePaste}
                    disabled={!pasteValue.trim()}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* HSL Sliders */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Hue */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">Hue</Label>
              <span className="text-xs font-mono text-muted-foreground">{hslValues.h}°</span>
            </div>
            <Slider
              value={[hslValues.h]}
              onValueChange={([v]) => handleHslChange('h', v)}
              max={360}
              step={1}
              className="w-full"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">Saturation</Label>
              <span className="text-xs font-mono text-muted-foreground">{hslValues.s}%</span>
            </div>
            <Slider
              value={[hslValues.s]}
              onValueChange={([v]) => handleHslChange('s', v)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Lightness */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground">Lightness</Label>
              <span className="text-xs font-mono text-muted-foreground">{hslValues.l}%</span>
            </div>
            <Slider
              value={[hslValues.l]}
              onValueChange={([v]) => handleHslChange('l', v)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* HSL String Display */}
      <div>
        <Label className="text-xs text-muted-foreground">HSL Value</Label>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 font-mono text-xs"
          placeholder="220 13% 16%"
        />
      </div>
    </div>
  )
}
