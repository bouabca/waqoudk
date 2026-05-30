'use client'

import { theme } from '@/lib/theme'
import Badge from '../Common/Badge'
import Card from '../Common/Card'
import DriverCard from './DriverCard'
import OrderProgress from './OrderProgress'

const t = theme

interface OrderItem {
  name: string
  quantity: number
  unitPrice: number
}

interface OrderDetailsProps {
  orderNumber: string
  status: 'pending' | 'in_progress' | 'delivered' | 'cancelled'
  currentStep: number
  items: OrderItem[]
  total: number
  deliveryFee: number
  discount: number
  stationName: string
  stationAddress: string
  driverName?: string
  driverRating?: number
  driverPhone?: string
  createdAt: string
}

export default function OrderDetails({
  orderNumber,
  status,
  currentStep,
  items,
  total,
  deliveryFee,
  discount,
  stationName,
  stationAddress,
  driverName,
  driverRating,
  driverPhone,
  createdAt,
}: OrderDetailsProps) {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: t.colors.ink,
    marginBottom: 12,
    fontFamily: t.fontFamily.text,
  }

  const orderNumStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: t.colors.ink,
    fontFamily: t.fontFamily.text,
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
  }

  const labelText: React.CSSProperties = {
    fontSize: 13,
    color: t.colors.body,
    fontFamily: t.fontFamily.text,
  }

  const valueText: React.CSSProperties = {
    fontSize: 13,
    color: t.colors.ink,
    fontWeight: 500,
    fontFamily: t.fontFamily.text,
  }

  const dividerStyle: React.CSSProperties = {
    height: 1,
    backgroundColor: t.colors.canvasSoft,
    marginTop: 8,
    marginBottom: 8,
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

  const dateTextStyle: React.CSSProperties = {
    fontSize: 12,
    color: t.colors.mute,
    fontFamily: t.fontFamily.text,
  }

  return (
    <div>
      <Card padding="16px" style={{ marginBottom: 16 }}>
        <div style={headerStyle}>
          <span style={orderNumStyle}>طلب #{orderNumber}</span>
          <Badge status={status} />
        </div>
        <div style={rowStyle}>
          <span style={labelText}>تاريخ الطلب</span>
          <span style={dateTextStyle}>{createdAt}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelText}>محطة التزويد</span>
          <span style={valueText}>{stationName}</span>
        </div>
      </Card>

      <Card padding="16px" style={{ marginBottom: 16 }}>
        <div style={sectionTitle}>المنتجات</div>
        {items.map((item, i) => (
          <div key={i} style={rowStyle}>
            <span style={labelText}>
              {item.name} × {item.quantity}
            </span>
            <span style={valueText}>
              {(item.quantity * item.unitPrice).toLocaleString('ar-DZ')}
              <span style={currencyStyle}>د.ج</span>
            </span>
          </div>
        ))}
        <div style={dividerStyle} />
        <div style={rowStyle}>
          <span style={labelText}>المجموع الفرعي</span>
          <span style={valueText}>
            {total.toLocaleString('ar-DZ')}
            <span style={currencyStyle}>د.ج</span>
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelText}>رسوم التوصيل</span>
          <span style={valueText}>
            +{deliveryFee.toLocaleString('ar-DZ')}
            <span style={currencyStyle}>د.ج</span>
          </span>
        </div>
        {discount > 0 && (
          <div style={rowStyle}>
            <span style={{ ...labelText, color: t.colors.success }}>الخصم</span>
            <span style={{ ...valueText, color: t.colors.success }}>
              -{discount.toLocaleString('ar-DZ')}
              <span style={currencyStyle}>د.ج</span>
            </span>
          </div>
        )}
        <div style={dividerStyle} />
        <div style={rowStyle}>
          <span style={{ ...labelText, fontWeight: 700 }}>المجموع الكلي</span>
          <span style={priceStyle}>
            {(total + deliveryFee - discount).toLocaleString('ar-DZ')}
            <span style={currencyStyle}>د.ج</span>
          </span>
        </div>
      </Card>

      {driverName && (
        <Card padding="16px" style={{ marginBottom: 16 }}>
          <div style={sectionTitle}>السائق</div>
          <DriverCard
            name={driverName}
            rating={driverRating || 0}
            phone={driverPhone}
          />
        </Card>
      )}

      <Card padding="16px" style={{ marginBottom: 16 }}>
        <div style={sectionTitle}>حالة الطلب</div>
        <OrderProgress currentStep={currentStep} />
      </Card>
    </div>
  )
}
