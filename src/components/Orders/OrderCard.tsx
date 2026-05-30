'use client'

import { theme } from '@/lib/theme'
import Badge from '../Common/Badge'
import Card from '../Common/Card'

const t = theme

interface OrderCardProps {
  orderNumber: string
  status: 'pending' | 'in_progress' | 'delivered' | 'cancelled'
  price: number
  driverName?: string
  driverRating?: number
  onClick?: () => void
}

function StarRating({ rating }: { rating: number }) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 2,
    direction: 'ltr',
  }

  return (
    <div style={containerStyle}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < Math.round(rating) ? t.colors.warning : t.colors.surfacePressed, fontSize: 12 }}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function OrderCard({
  orderNumber,
  status,
  price,
  driverName,
  driverRating,
  onClick,
}: OrderCardProps) {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  }

  const orderNumStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 700,
    color: t.colors.ink,
    fontFamily: t.fontFamily.text,
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  }

  const priceStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: t.colors.primary,
  }

  const currencyStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    color: t.colors.body,
    marginRight: 2,
  }

  const driverSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTop: `1px solid ${t.colors.canvasSoft}`,
  }

  const driverNameTextStyle: React.CSSProperties = {
    fontSize: 13,
    color: t.colors.body,
    fontWeight: 500,
    fontFamily: t.fontFamily.text,
  }

  return (
    <Card padding="16px" onClick={onClick}>
      <div style={headerStyle}>
        <span style={orderNumStyle}>طلب #{orderNumber}</span>
        <Badge status={status} />
      </div>
      <div style={rowStyle}>
        <span style={{ fontSize: 13, color: t.colors.body, fontFamily: t.fontFamily.text }}>المجموع</span>
        <span style={priceStyle}>
          {price.toLocaleString('ar-DZ')}
          <span style={currencyStyle}>د.ج</span>
        </span>
      </div>
      {driverName && (
        <div style={driverSectionStyle}>
          <span style={driverNameTextStyle}>{driverName}</span>
          {driverRating !== undefined && <StarRating rating={driverRating} />}
        </div>
      )}
    </Card>
  )
}
