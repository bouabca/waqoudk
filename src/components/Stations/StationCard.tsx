'use client'

import Card from '../Common/Card'
import { theme } from '@/lib/theme'

interface StationCardProps {
  name: string
  address: string
  distance?: string
  price: number
  isOpen: boolean
  openingHours?: string
  onClick?: () => void
}

export default function StationCard({
  name,
  address,
  distance,
  price,
  isOpen,
  openingHours,
  onClick,
}: StationCardProps) {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  }

  const nameStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.ink,
    marginBottom: 4,
  }

  const openBadgeStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: theme.rounded.pill,
    backgroundColor: isOpen ? theme.colors.canvasSoft : '#F8F9FA',
    color: isOpen ? theme.colors.ink : '#383D41',
  }

  const addressStyle: React.CSSProperties = {
    fontSize: 13,
    color: theme.colors.body,
    marginBottom: 4,
  }

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTop: `1px solid ${theme.colors.canvasSoft}`,
  }

  const priceStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: theme.colors.ink,
  }

  const currencyStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: theme.colors.mute,
    marginRight: 2,
  }

  const priceLabelStyle: React.CSSProperties = {
    fontSize: 11,
    color: theme.colors.mute,
    display: 'block',
  }

  const hoursStyle: React.CSSProperties = {
    fontSize: 12,
    color: theme.colors.mute,
  }

  const distanceStyle: React.CSSProperties = {
    fontSize: 12,
    color: theme.colors.ink,
    fontWeight: 500,
  }

  return (
    <Card padding="16px" onClick={onClick}>
      <div style={headerStyle}>
        <div>
          <div style={nameStyle}>{name}</div>
          <div style={addressStyle}>{address}</div>
          {distance && <div style={distanceStyle}>{distance}</div>}
        </div>
        <span style={openBadgeStyle}>{isOpen ? 'مفتوح' : 'مغلق'}</span>
      </div>
      {openingHours && !isOpen && (
        <div style={hoursStyle}>{openingHours}</div>
      )}
      <div style={infoRowStyle}>
        <div>
          <span style={priceLabelStyle}>سعر اللتر</span>
          <span style={priceStyle}>
            {price.toLocaleString('ar-DZ')}
            <span style={currencyStyle}>د.ج</span>
          </span>
        </div>
      </div>
    </Card>
  )
}
