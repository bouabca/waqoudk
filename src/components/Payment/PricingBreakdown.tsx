'use client'

import { theme } from '@/lib/theme'

interface PricingBreakdownProps {
  itemName: string
  quantity: number
  unitPrice: number
  deliveryFee: number
  discount?: number
}

export default function PricingBreakdown({
  itemName,
  quantity,
  unitPrice,
  deliveryFee,
  discount = 0,
}: PricingBreakdownProps) {
  const subtotal = quantity * unitPrice
  const total = subtotal + deliveryFee - discount

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontFamily: theme.fontFamily.text,
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    color: theme.colors.body,
  }

  const valueStyle: React.CSSProperties = {
    fontSize: 14,
    color: theme.colors.ink,
    fontWeight: 500,
  }

  const dividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: theme.colors.surfacePressed,
    marginTop: 4,
    marginBottom: 4,
  }

  const totalRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  }

  const totalLabelStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.ink,
  }

  const totalValueStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.primary,
  }

  const discountLabelStyle: React.CSSProperties = {
    fontSize: 14,
    color: theme.colors.primary,
  }

  const discountValueStyle: React.CSSProperties = {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 600,
  }

  const currencyStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: theme.colors.mute,
    marginRight: 2,
  }

  const primaryCurrencyStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    color: theme.colors.primary,
    marginRight: 2,
  }

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <span style={labelStyle}>{itemName} (×{quantity})</span>
        <span style={valueStyle}>
          {subtotal.toLocaleString('ar-DZ')}
          <span style={currencyStyle}>د.ج</span>
        </span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>رسوم التوصيل</span>
        <span style={valueStyle}>
          +{deliveryFee.toLocaleString('ar-DZ')}
          <span style={currencyStyle}>د.ج</span>
        </span>
      </div>
      {discount > 0 && (
        <div style={rowStyle}>
          <span style={discountLabelStyle}>الخصم</span>
          <span style={discountValueStyle}>
            -{discount.toLocaleString('ar-DZ')}
            <span style={primaryCurrencyStyle}>د.ج</span>
          </span>
        </div>
      )}
      <div style={dividerStyle} />
      <div style={totalRowStyle}>
        <span style={totalLabelStyle}>المجموع</span>
        <span style={totalValueStyle}>
          {total.toLocaleString('ar-DZ')}
          <span style={{ ...currencyStyle, color: theme.colors.primary }}>د.ج</span>
        </span>
      </div>
    </div>
  )
}
