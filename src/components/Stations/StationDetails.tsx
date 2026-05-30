'use client'

import Card from '../Common/Card'
import Button from '../Common/Button'
import { theme } from '@/lib/theme'

interface FuelType {
  name: string
  price: number
  available: boolean
}

interface StationDetailsProps {
  name: string
  address: string
  phone?: string
  isOpen: boolean
  openingHours?: string
  fuelTypes: FuelType[]
  rating?: number
  onSelect?: () => void
}

export default function StationDetails({
  name,
  address,
  phone,
  isOpen,
  openingHours,
  fuelTypes,
  rating,
  onSelect,
}: StationDetailsProps) {
  const headerStyle: React.CSSProperties = {
    marginBottom: 16,
  }

  const nameStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.ink,
    marginBottom: 4,
  }

  const addressStyle: React.CSSProperties = {
    fontSize: 13,
    color: theme.colors.body,
    marginBottom: 8,
  }

  const openBadgeStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: theme.rounded.pill,
    backgroundColor: isOpen ? theme.colors.canvasSoft : '#F8F9FA',
    color: isOpen ? theme.colors.ink : '#383D41',
    display: 'inline-block',
    marginBottom: 8,
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.ink,
    marginBottom: 12,
    marginTop: 16,
  }

  const fuelRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottom: `1px solid ${theme.colors.canvasSoft}`,
  }

  const fuelNameStyle: React.CSSProperties = {
    fontSize: 14,
    color: theme.colors.ink,
    fontWeight: 500,
  }

  const fuelPriceStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.ink,
  }

  const currencyStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: theme.colors.mute,
    marginRight: 2,
  }

  const unavailableStyle: React.CSSProperties = {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: 500,
  }

  const ratingContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    direction: 'ltr',
  }

  const phoneStyle: React.CSSProperties = {
    fontSize: 13,
    color: theme.colors.ink,
    fontWeight: 500,
    marginBottom: 4,
    display: 'block',
  }

  const hoursStyle: React.CSSProperties = {
    fontSize: 13,
    color: theme.colors.body,
    marginBottom: 4,
  }

  return (
    <Card padding="20px">
      <div style={headerStyle}>
        <div style={nameStyle}>{name}</div>
        <div style={addressStyle}>{address}</div>
        <span style={openBadgeStyle}>{isOpen ? 'مفتوح الآن' : 'مغلق'}</span>
        {rating !== undefined && (
          <div style={ratingContainerStyle}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ color: i < Math.round(rating) ? theme.colors.warning : theme.colors.surfacePressed, fontSize: 14 }}>
                ★
              </span>
            ))}
          </div>
        )}
        {phone && <span style={phoneStyle}>{phone}</span>}
        {openingHours && !isOpen && <div style={hoursStyle}>{openingHours}</div>}
      </div>

      <div style={sectionTitle}>أنواع الوقود</div>
      {fuelTypes.map((fuel, index) => (
        <div key={index} style={fuelRowStyle}>
          <span style={fuelNameStyle}>{fuel.name}</span>
          {fuel.available ? (
            <span style={fuelPriceStyle}>
              {fuel.price.toLocaleString('ar-DZ')}
              <span style={currencyStyle}>د.ج</span>
            </span>
          ) : (
            <span style={unavailableStyle}>غير متوفر</span>
          )}
        </div>
      ))}

      <div style={{ marginTop: 24 }}>
        <Button onClick={onSelect} fullWidth disabled={!isOpen}>
          {isOpen ? 'اختيار هذه المحطة' : 'المحطة مغلقة حالياً'}
        </Button>
      </div>
    </Card>
  )
}
