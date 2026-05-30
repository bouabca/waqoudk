'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { theme } from '@/lib/theme'

const styles = {
  container: { maxWidth: 430, margin: '0 auto', backgroundColor: theme.colors.canvasSoft, minHeight: '100vh', direction: 'rtl' as const, fontFamily: theme.fontFamily.text } as const,
  header: { backgroundColor: theme.colors.canvas, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.colors.surfacePressed}` } as const,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: theme.colors.ink, cursor: 'pointer', padding: 0 } as const,
  headerTitle: { fontSize: 17, fontWeight: 700, color: theme.colors.ink } as const,
  spacer: { width: 22 } as const,
  body: { padding: 16 } as const,
  detailsCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 16, marginBottom: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' } as const,
  detailTitle: { fontSize: 16, fontWeight: 600, color: theme.colors.ink, marginBottom: 12 } as const,
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: theme.colors.body, borderBottom: `1px solid ${theme.colors.canvasSoft}` } as const,
  detailLabel: { color: theme.colors.body } as const,
  detailValue: { fontWeight: 500 } as const,
  totalBox: { backgroundColor: theme.colors.primary, borderRadius: theme.rounded.xl, padding: '20px 24px', textAlign: 'center' as const, marginBottom: 12 } as const,
  totalLabel: { color: theme.colors.onPrimary, fontSize: 13, opacity: 0.9 } as const,
  totalPrice: { color: theme.colors.onPrimary, fontSize: 28, fontWeight: 700, marginTop: 4 } as const,
  primaryButton: { ...theme.buttonPrimary, width: '100%' } as const,
}

interface PricingData {
  itemPrice: number
  quantity: number
  unit: string
  deliveryFee: number
  discount: number
  total: number
}

export default function PricingPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string
  const [data, setData] = useState<PricingData | null>(null)

  useEffect(() => {
    if (!orderId) return
    fetch(`/api/orders/${orderId}/pricing`)
      .then((res) => res.ok ? res.json() : null)
      .then(setData)
      .catch(() => {})
  }, [orderId])

  const d = data || { itemPrice: 6200, quantity: 20, unit: 'لتر', deliveryFee: 800, discount: 300, total: 6700 }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.back()}>←</button>
        <span style={styles.headerTitle}>تفاصيل الأسعار</span>
        <div style={styles.spacer} />
      </div>

      <div style={styles.body}>
        <div style={styles.detailsCard}>
          <div style={styles.detailTitle}>تفاصيل الأسعار</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>سعر المنتج</span>
            <span style={styles.detailValue}>{d.itemPrice.toLocaleString()} دج</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>الكمية</span>
            <span style={styles.detailValue}>{d.quantity} {d.unit}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>رسوم التوصيل</span>
            <span style={styles.detailValue}>{d.deliveryFee.toLocaleString()} دج</span>
          </div>
          <div style={{ ...styles.detailRow, borderBottom: 'none' }}>
            <span style={styles.detailLabel}>الخصم</span>
            <span style={{ ...styles.detailValue, color: theme.colors.error }}>-{d.discount.toLocaleString()} دج</span>
          </div>
        </div>

        <div style={styles.totalBox}>
          <div style={styles.totalLabel}>السعر الإجمالي</div>
          <div style={styles.totalPrice}>{d.total.toLocaleString()} دج</div>
        </div>

        <button style={styles.primaryButton} onClick={() => router.push(`/payment/${orderId}`)}>تأكيد الطلب</button>
      </div>
    </div>
  )
}
