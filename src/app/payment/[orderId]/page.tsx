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
  methodCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 16, marginBottom: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' } as const,
  methodTitle: { fontSize: 15, fontWeight: 600, color: theme.colors.ink, marginBottom: 12 } as const,
  methodOption: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: `1px solid ${theme.colors.canvasSoft}` } as const,
  radio: { width: 20, height: 20, borderRadius: '50%', border: `2px solid ${theme.colors.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as const,
  radioInner: { width: 12, height: 12, borderRadius: '50%', backgroundColor: theme.colors.primary } as const,
  methodLabel: { color: theme.colors.ink, fontSize: 14 } as const,
  breakdownCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 16, marginBottom: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' } as const,
  breakdownRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: theme.colors.body } as const,
  breakdownLabel: { color: theme.colors.body } as const,
  breakdownValue: { fontWeight: 500 } as const,
  totalRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: 8, borderTop: `1px solid ${theme.colors.surfacePressed}`, fontSize: 16, fontWeight: 700, color: theme.colors.ink } as const,
  primaryButton: { ...theme.buttonPrimary, width: '100%', marginTop: 8 } as const,
}

interface PaymentData {
  total: number
  itemPrice: number
  deliveryFee: number
  discount: number
  method: string
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string
  const [data, setData] = useState<PaymentData | null>(null)

  useEffect(() => {
    if (!orderId) return
    fetch(`/api/orders/${orderId}/payment`)
      .then((res) => res.ok ? res.json() : null)
      .then(setData)
      .catch(() => {})
  }, [orderId])

  const d = data || { total: 6700, itemPrice: 6200, deliveryFee: 800, discount: 300, method: 'الدفع عند الاستلام' }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.back()}>←</button>
        <span style={styles.headerTitle}>الدفع</span>
        <div style={styles.spacer} />
      </div>

      <div style={styles.body}>
        <div style={styles.methodCard}>
          <div style={styles.methodTitle}>طريقة الدفع</div>
          <div style={styles.methodOption}>
            <div style={styles.radio}><div style={styles.radioInner} /></div>
            <span style={styles.methodLabel}>الدفع عند الاستلام</span>
          </div>
          <div style={styles.methodOption}>
            <div style={{ ...styles.radio, borderColor: theme.colors.surfacePressed }} />
            <span style={{ ...styles.methodLabel, color: theme.colors.body }}>تحويل بنكي</span>
          </div>
        </div>

        <div style={styles.breakdownCard}>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel}>سعر المنتج</span>
            <span style={styles.breakdownValue}>{d.itemPrice.toLocaleString()} دج</span>
          </div>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel}>رسوم التوصيل</span>
            <span style={styles.breakdownValue}>{d.deliveryFee.toLocaleString()} دج</span>
          </div>
          <div style={styles.breakdownRow}>
            <span style={styles.breakdownLabel}>الخصم</span>
            <span style={{ ...styles.breakdownValue, color: theme.colors.error }}>-{d.discount.toLocaleString()} دج</span>
          </div>
          <div style={styles.totalRow}>
            <span>المجموع</span>
            <span style={{ color: theme.colors.primary }}>{d.total.toLocaleString()} دج</span>
          </div>
        </div>

        <button style={styles.primaryButton} onClick={() => router.push('/home')}>حفظ</button>
      </div>
    </div>
  )
}
