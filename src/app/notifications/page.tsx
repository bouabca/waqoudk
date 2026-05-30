'use client'

import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const styles = {
  container: { ...theme.container, backgroundColor: theme.colors.canvasSoft } as React.CSSProperties,
  header: { backgroundColor: theme.colors.primary, padding: '24px 16px', textAlign: 'center' as const, position: 'relative' as const } as React.CSSProperties,
  headerTitle: { color: theme.colors.onPrimary, fontSize: 18, fontWeight: 700 } as React.CSSProperties,
  headerSub: { color: theme.colors.onPrimary, fontSize: 13, opacity: 0.9, marginTop: 4 } as React.CSSProperties,
  body: { padding: 16 } as React.CSSProperties,
  priceCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 16, marginBottom: 12, boxShadow: theme.shadow.level3 } as React.CSSProperties,
  priceLabel: { color: theme.colors.body, fontSize: 13, textAlign: 'center' as const } as React.CSSProperties,
  priceValue: { color: theme.colors.ink, fontSize: 28, fontWeight: 700, textAlign: 'center' as const, marginTop: 4 } as React.CSSProperties,
  priceUnit: { color: theme.colors.body, fontSize: 13, textAlign: 'center' as const } as React.CSSProperties,
  checkCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 16, marginBottom: 12, boxShadow: theme.shadow.level3 } as React.CSSProperties,
  checkTitle: { fontSize: 14, fontWeight: 600, color: theme.colors.ink, marginBottom: 12 } as React.CSSProperties,
  checkItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 13, color: theme.colors.body } as React.CSSProperties,
  checkIcon: { width: 20, height: 20, borderRadius: '50%', backgroundColor: theme.colors.ink, color: theme.colors.onPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 } as React.CSSProperties,
  infoCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, boxShadow: theme.shadow.level3 } as React.CSSProperties,
  infoItem: { textAlign: 'center' as const, padding: '8px 0' } as React.CSSProperties,
  infoIcon: { fontSize: 24, marginBottom: 6 } as React.CSSProperties,
  infoLabel: { color: theme.colors.ink, fontSize: 12, fontWeight: 500 } as React.CSSProperties,
  infoSub: { color: theme.colors.body, fontSize: 11, marginTop: 2 } as React.CSSProperties,
}

const checks = ['توصيل سريع', 'خدمات متخصصة', 'تقييم وآراء']
const services = [
  { icon: '🚚', label: 'توصيل', sub: '30 دقيقة' },
  { icon: '🛡️', label: 'ضمان', sub: 'جودة مضمونة' },
  { icon: '⭐', label: 'تقييم', sub: '4.9 نجوم' },
  { icon: '📞', label: 'دعم', sub: '24/7' },
]

export default function NotificationsPage() {
  const router = useRouter()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ position: 'absolute', right: 16, top: 24 }}>
          <button style={{ background: 'none', border: 'none', color: theme.colors.onPrimary, fontSize: 22, cursor: 'pointer' }} onClick={() => router.back()}>←</button>
        </div>
        <div style={styles.headerTitle}>إشعارات وشروط الطريق</div>
        <div style={styles.headerSub}>جميع المعلومات التي تحتاجها</div>
      </div>

      <div style={styles.body}>
        <div style={styles.priceCard}>
          <div style={styles.priceLabel}>سعر الاشتراك الشهري</div>
          <div style={styles.priceValue}>40,000 دج</div>
          <div style={styles.priceUnit}>/ شهر</div>
        </div>

        <div style={styles.checkCard}>
          <div style={styles.checkTitle}>المميزات المشمولة</div>
          {checks.map((item, i) => (
            <div key={i} style={styles.checkItem}>
              <div style={styles.checkIcon}>✓</div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div style={styles.infoCard}>
          {services.map((svc, i) => (
            <div key={i} style={styles.infoItem}>
              <div style={styles.infoIcon}>{svc.icon}</div>
              <div style={styles.infoLabel}>{svc.label}</div>
              <div style={styles.infoSub}>{svc.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
