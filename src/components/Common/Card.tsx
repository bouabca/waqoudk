'use client'

import { theme } from '@/lib/theme'

interface CardProps {
  children: React.ReactNode
  variant?: 'content' | 'elevated' | 'softTinted'
  padding?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export default function Card({
  children,
  variant = 'content',
  padding = theme.spacing['2xl'],
  onClick,
  style,
}: CardProps) {
  const variants: Record<string, React.CSSProperties> = {
    content: { ...theme.cardContent },
    elevated: { ...theme.cardElevated },
    softTinted: { ...theme.cardSoftTinted },
  }

  return (
    <div
      style={{
        padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s ease',
        ...variants[variant],
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
