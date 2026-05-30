'use client'

import { theme } from '@/lib/theme'

interface HeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
}

export default function Header({ title, showBack, onBack }: HeaderProps) {
  const headerStyle: React.CSSProperties = {
    height: 50,
    backgroundColor: theme.colors.canvas,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 16px',
    position: 'relative',
  }

  const titleStyle: React.CSSProperties = {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: 700,
  }

  const backButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: 16,
    background: 'none',
    border: 'none',
    color: theme.colors.ink,
    fontSize: 20,
    cursor: 'pointer',
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  return (
    <header style={headerStyle}>
      {showBack && (
        <button style={backButtonStyle} onClick={onBack}>
          →
        </button>
      )}
      <h1 style={titleStyle}>{title}</h1>
    </header>
  )
}
