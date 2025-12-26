import { SVGProps } from 'react'
import { cn } from '@/lib/utils'

type AppIconProps = Omit<SVGProps<SVGImageElement>, 'width' | 'height'> & {
  size?: number
}

export function AppIcon({ size = 48, className, ...props }: AppIconProps) {
  return (
    <img
      src="/resources/icons/yedits-YE-logo-colour-old1.webp"
      alt="yedits.net"
      width={size}
      height={size}
      className={cn('rounded', className)}
      {...props}
    />
  )
}
