'use client'

import { theme } from '@/lib/theme'

const t = theme

interface DriverCardProps {
  name: string
  rating: number
  phone?: string
}

export default function DriverCard({ name, rating, phone }: DriverCardProps) {
  const cardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: t.colors.canvas,
    borderRadius: t.rounded.lg,
    boxShadow: t.shadow.level3,
  }

  const avatarStyle: React.CSSProperties = {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: t.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: t.colors.onPrimary,
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  }

  const infoStyle: React.CSSProperties = {
    flex: 1,
  }

  const nameStyle: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: t.colors.ink,
    marginBottom: 4,
    fontFamily: t.fontFamily.text,
  }

  const ratingContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 2,
    direction: 'ltr',
  }

  const phoneButtonStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: t.colors.primary,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: t.colors.onPrimary,
    fontSize: 18,
    flexShrink: 0,
  }

  return (
    <div style={cardStyle}>
      <div style={avatarStyle}>
        {name.charAt(0)}
      </div>
      <div style={infoStyle}>
        <div style={nameStyle}>{name}</div>
        <div style={ratingContainerStyle}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              style={{ color: i < Math.round(rating) ? t.colors.warning : t.colors.surfacePressed, fontSize: 12 }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      {phone && (
        <a href={`tel:${phone}`} style={{ textDecoration: 'none' }}>
          <button style={phoneButtonStyle}>
            📞
          </button>
        </a>
      )}
    </div>
  )
}
