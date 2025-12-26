/**
 * Convert HSL string format "220 13% 16%" to hex color
 */
export function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(' ').map((v) => parseFloat(v.replace('%', '')))
  
  const hDecimal = h / 360
  const sDecimal = s / 100
  const lDecimal = l / 100

  let r: number, g: number, b: number

  if (sDecimal === 0) {
    r = g = b = lDecimal
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal
    const p = 2 * lDecimal - q

    r = hue2rgb(p, q, hDecimal + 1 / 3)
    g = hue2rgb(p, q, hDecimal)
    b = hue2rgb(p, q, hDecimal - 1 / 3)
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Convert hex color to HSL string format "220 13% 16%"
 */
export function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')

  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  const lPercent = Math.round(l * 100)

  return `${h} ${s}% ${lPercent}%`
}

/**
 * Apply a custom theme to the document
 */
export function applyCustomTheme(colors: Record<string, string>) {
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--${cssVar}`, value)
  })
}

/**
 * Remove custom theme and revert to default
 */
export function removeCustomTheme() {
  const root = document.documentElement
  const colorKeys = [
    'background',
    'background-foreground',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
  ]
  
  colorKeys.forEach((key) => {
    root.style.removeProperty(`--${key}`)
  })
}
