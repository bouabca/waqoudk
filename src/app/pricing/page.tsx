'use client'

import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const styles = {
  container: { maxWidth: 430, margin: '0 auto', backgroundColor: theme.colors.canvasSoft, minHeight: '100vh', direction: 'rtl' as const, fontFamily: theme.fontFamily.text } as const,
  header: { backgroundColor: theme.colors.canvas, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.colors.surfacePressed}` } as const,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: theme.colors.ink, cursor: 'pointer', padding: 0 } as const,
  headerTitle: { fontSize: 17, fontWeight: 700, color: theme.colors.ink } as const,
  spacer: { width: 22 } as const,
  body: { padding: 16 } as const,
  card: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 20, marginBottom: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' } as const,
  cardTitle: { fontSize: 16, fontWeight: 600, color: theme.colors.ink, marginBottom: 16 } as const,
  row: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, color: theme.colors.body, borderBottom: `1px solid ${theme.colors.canvasSoft}` } as const,
  label: { color: theme.colors.body } as const,
  value: { fontWeight: 500 } as const,
  totalBox: { backgroundColor: theme.colors.primary, borderRadius: theme.rounded.xl, padding: '20px 24px', textAlign: 'center' as const, marginBottom: 12 } as const,
  totalLabel: { color: theme.colors.onPrimary, fontSize: 13, opacity: 0.9 } as const,
  totalPrice: { color: theme.colors.onPrimary, fontSize: 28, fontWeight: 700, marginTop: 4 } as const,
  primaryButton: { ...theme.buttonPrimary, width: '100%' } as const,
}

export default function SimplePricingPage() {
  const router = useRouter()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.back()}>←</button>
        <span style={styles.headerTitle}>الأسعار</span>
        <div style={styles.spacer} />
      </div>

      <div style={styles.body}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>تفاصيل الأسعار الأساسية</div>
          <div style={styles.row}>
            <span style={styles.label}>سعر اللتر</span>
            <span style={styles.value}>31 دج</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>الحد الأدنى للطلب</span>
            <span style={styles.value}>10 لتر</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>رسوم التوصيل</span>
            <span style={styles.value}>800 دج</span>
          </div>
          <div style={{ ...styles.row, borderBottom: 'none' }}>
            <span style={styles.label}>الخدمة متاحة في</span>
            <span style={styles.value}>سيدي بلعباس</span>
          </div>
        </div>

        <div style={styles.totalBox}>
          <div style={styles.totalLabel}>السعر التقريبي</div>
          <div style={styles.totalPrice}>31 / دج</div>
        </div>

        <button style={styles.primaryButton} onClick={() => router.push('/home')}>اطلب الآن</button>
      </div>
    </div>
  )
}
