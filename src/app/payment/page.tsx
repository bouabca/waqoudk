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
  methodCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 16, marginBottom: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' } as const,
  methodTitle: { fontSize: 15, fontWeight: 600, color: theme.colors.ink, marginBottom: 12 } as const,
  methodOption: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: `1px solid ${theme.colors.canvasSoft}` } as const,
  methodOptionLast: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0' } as const,
  radioSelected: { width: 20, height: 20, borderRadius: '50%', border: `2px solid ${theme.colors.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as const,
  radioInner: { width: 12, height: 12, borderRadius: '50%', backgroundColor: theme.colors.primary } as const,
  radioUnselected: { width: 20, height: 20, borderRadius: '50%', border: `2px solid ${theme.colors.surfacePressed}`, flexShrink: 0 } as const,
  methodLabel: { color: theme.colors.ink, fontSize: 14, fontWeight: 500 } as const,
  methodLabelMuted: { color: theme.colors.body, fontSize: 14 } as const,
  infoCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 16, marginBottom: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' } as const,
  infoText: { color: theme.colors.body, fontSize: 13, lineHeight: 1.6 } as const,
  primaryButton: { ...theme.buttonPrimary, width: '100%' } as const,
}

export default function SimplePaymentPage() {
  const router = useRouter()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.back()}>←</button>
        <span style={styles.headerTitle}>طرق الدفع</span>
        <div style={styles.spacer} />
      </div>

      <div style={styles.body}>
        <div style={styles.methodCard}>
          <div style={styles.methodTitle}>اختر طريقة الدفع</div>
          <div style={styles.methodOption}>
            <div style={styles.radioSelected}><div style={styles.radioInner} /></div>
            <span style={styles.methodLabel}>الدفع عند الاستلام</span>
          </div>
          <div style={styles.methodOptionLast}>
            <div style={styles.radioUnselected} />
            <span style={styles.methodLabelMuted}>تحويل بنكي</span>
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.methodTitle}>معلومات الدفع</div>
          <div style={styles.infoText}>
            يمكنك الدفع نقداً عند استلام الطلب. نوفر جميع فئات النقود لتسهيل عملية الدفع.
          </div>
        </div>

        <button style={styles.primaryButton} onClick={() => router.push('/home')}>متابعة</button>
      </div>
    </div>
  )
}
