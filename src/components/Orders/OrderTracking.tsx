'use client'

import { theme } from '@/lib/theme'
import OrderProgress from './OrderProgress'
import DriverCard from './DriverCard'
import Badge from '../Common/Badge'
import Card from '../Common/Card'

const t = theme

interface OrderTrackingProps {
  orderNumber: string
  status: 'pending' | 'in_progress' | 'delivered' | 'cancelled'
  currentStep: number
  driverName?: string
  driverRating?: number
  driverPhone?: string
  total: number
  estimatedDelivery?: string
}

export default function OrderTracking({
  orderNumber,
  status,
  currentStep,
  driverName,
  driverRating,
  driverPhone,
  total,
  estimatedDelivery,
}: OrderTrackingProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '8px 0',
  }

  const orderLabelStyle: React.CSSProperties = {
    fontSize: 14,
    color: t.colors.body,
    marginBottom: 4,
    fontFamily: t.fontFamily.text,
  }

  const orderNumStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    color: t.colors.ink,
    marginBottom: 8,
    fontFamily: t.fontFamily.text,
  }

  const priceStyle: React.CSSProperties = {
    fontSize: 14,
    color: t.colors.primary,
    fontWeight: 700,
    fontFamily: t.fontFamily.text,
  }

  const estimatedStyle: React.CSSProperties = {
    fontSize: 12,
    color: t.colors.mute,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: t.fontFamily.text,
  }

  return (
    <div style={containerStyle}>
      <Card padding="16px">
        <div style={headerStyle}>
          <div style={orderLabelStyle}>رقم الطلب</div>
          <div style={orderNumStyle}>#{orderNumber}</div>
          <Badge status={status} />
          <div style={priceStyle}>
            {total.toLocaleString('ar-DZ')} د.ج
          </div>
        </div>
      </Card>

      <OrderProgress currentStep={currentStep} />

      {estimatedDelivery && (
        <div style={estimatedStyle}>
          وقت التوصيل المتوقع: {estimatedDelivery}
        </div>
      )}

      {driverName && (
        <Card padding="16px">
          <DriverCard
            name={driverName}
            rating={driverRating || 0}
            phone={driverPhone}
          />
        </Card>
      )}
    </div>
  )
}
