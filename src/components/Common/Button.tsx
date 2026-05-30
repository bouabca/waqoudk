'use client'

import { theme } from '@/lib/theme'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'subtle' | 'text'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function Button({
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  loading = false,
  onClick,
  children,
  style,
}: ButtonProps) {
  const base = {
    height: 48,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    padding: '0 24px',
    ...style,
  } as React.CSSProperties

  let variantStyle: React.CSSProperties
  switch (variant) {
    case 'secondary':
      variantStyle = { ...theme.buttonSecondary }
      break
    case 'subtle':
      variantStyle = { ...theme.buttonSubtle }
      break
    case 'text':
      variantStyle = {
        backgroundColor: 'transparent',
        color: theme.colors.ink,
        border: 'none',
        height: 'auto',
        padding: '0',
        fontFamily: theme.fontFamily.text,
        fontSize: '16px',
        fontWeight: 500,
        borderRadius: theme.rounded.none,
      }
      break
    default:
      variantStyle = { ...theme.buttonPrimary }
  }

  return (
    <button
      style={{ ...base, ...variantStyle }}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'جاري التحميل...' : children}
    </button>
  )
}
