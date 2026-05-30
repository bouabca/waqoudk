'use client'

import { theme } from '@/lib/theme'

interface PriceDisplayProps {
  price: number
  label?: string
  size?: 'small' | 'large'
}

export default function PriceDisplay({ price, label, size = 'large' }: PriceDisplayProps) {
  const isLarge = size === 'large'

  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: isLarge ? '16px 0' : '8px 0',
    fontFamily: theme.fontFamily.text,
  }

  const labelStyle: React.CSSProperties = {
    fontSize: isLarge ? 14 : 12,
    color: theme.colors.body,
    marginBottom: isLarge ? 8 : 4,
    fontWeight: 500,
  }

  const priceStyle: React.CSSProperties = {
    fontSize: isLarge ? 36 : 24,
    fontWeight: 700,
    color: theme.colors.primary,
    lineHeight: 1.2,
  }

  const currencyStyle: React.CSSProperties = {
    fontSize: isLarge ? 16 : 12,
    fontWeight: 500,
    color: theme.colors.primary,
    marginRight: 4,
  }

  return (
    <div style={containerStyle}>
      {label && <div style={labelStyle}>{label}</div>}
      <div style={priceStyle}>
        {price.toLocaleString('ar-DZ')}
        <span style={currencyStyle}>د.ج</span>
      </div>
    </div>
  )
}
