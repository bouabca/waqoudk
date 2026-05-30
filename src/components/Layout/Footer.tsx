'use client'

import { theme } from '@/lib/theme'

const badges = [
  { text: 'خدمة آمنة 100%', icon: '✓' },
  { text: 'توصيل سريع وموثوق', icon: '⚡' },
  { text: 'سيدي بلعباس فقط', icon: '📍' },
  { text: 'دعم محلي 24/7', icon: '📞' },
]

export default function Footer() {
  const footerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.primary,
    padding: '24px 16px',
    marginTop: 'auto',
  }

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    maxWidth: 400,
    margin: '0 auto',
  }

  const badgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: theme.colors.onDark,
    fontWeight: 500,
  }

  const iconStyle: React.CSSProperties = {
    fontSize: 16,
  }

  const copyrightStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: 11,
    color: theme.colors.onDark,
    marginTop: 16,
  }

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {badges.map((badge, index) => (
          <div key={index} style={badgeStyle}>
            <span style={iconStyle}>{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
      <div style={copyrightStyle}>© 2026 وقودك - جميع الحقوق محفوظة</div>
    </footer>
  )
}
