'use client'

import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const styles = {
  container: { ...theme.container } as const,
  header: { backgroundColor: theme.colors.primary, padding: '32px 16px 24px', textAlign: 'center' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8 } as const,
  logoRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } as const,
  logoIcon: { width: 36, height: 36, fontSize: 24 } as const,
  logoText: { ...theme.typography.displayMd, color: theme.colors.onPrimary } as const,
  subtitle: { ...theme.typography.bodySm, color: theme.colors.onPrimary, opacity: 0.9 } as const,
  desc: { ...theme.typography.bodySm, color: theme.colors.body, textAlign: 'center' as const, lineHeight: 1.6, padding: '16px 16px 0' } as const,
  locationBadge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 12, color: theme.colors.primary, fontSize: 13, fontWeight: 500, fontFamily: theme.fontFamily.text } as const,
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px', direction: 'rtl' as const } as const,
  gridItem: { backgroundColor: theme.colors.canvasSoft, borderRadius: theme.rounded.xl, padding: '16px 12px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none', width: '100%' } as const,
  iconBox: { width: 44, height: 44, borderRadius: theme.rounded.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 } as const,
  gridLabel: { color: theme.colors.ink, fontSize: 12, fontWeight: 500, textAlign: 'center' as const, fontFamily: theme.fontFamily.text } as const,
  badge: { fontSize: 10, color: theme.colors.primary, fontWeight: 600, fontFamily: theme.fontFamily.text } as const,
  ctaButton: { ...theme.buttonPrimary, width: '100%', marginTop: 8 } as const,
  secondaryButton: { ...theme.buttonSecondary, width: '100%', marginTop: 8 } as const,
  secondaryLink: { display: 'block', textAlign: 'center' as const, color: theme.colors.primary, fontSize: 13, marginTop: 16, marginBottom: 24, fontFamily: theme.fontFamily.text } as const,
  footer: { padding: '16px', display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' as const, marginBottom: 32 } as const,
  trustItem: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4, fontSize: 11, color: theme.colors.body, fontFamily: theme.fontFamily.text } as const,
}

const navItems = [
  { icon: '🚛', label: 'تحقق من طلب', badge: '24/7', color: theme.colors.canvasSoft },
  { icon: '📍', label: 'مراسلة قرب منك', badge: '100%', color: '#E3F2FD' },
  { icon: '🚗', label: 'عرض سيارات متاحة', badge: '31 / دج', color: '#FFF3E0' },
  { icon: '⚙️', label: 'قائمة المزيد', badge: 'سيدي بلعباس', color: '#F3E5F5' },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>🌿</span>
          <span style={styles.logoText}>وقودك</span>
        </div>
        <div style={styles.subtitle}>مرحبا بك في وقودك</div>
      </div>

      <p style={styles.desc}>
        وقودك هو تطبيق توصيل المحروقات إلى باب منزلك أو سيارتك أينما كنت. اطلب الآن واستمتع بخدمة سريعة وآمنة.
      </p>

      <div style={styles.locationBadge}>
        <span>📍</span>
        <span>سيدي بلعباس فقط</span>
      </div>

      <div style={styles.grid}>
        {navItems.map((item, i) => (
          <button key={i} style={styles.gridItem} onClick={() => router.push('/login')}>
            <div style={{ ...styles.iconBox, backgroundColor: item.color }}>{item.icon}</div>
            <span style={styles.gridLabel}>{item.label}</span>
            <span style={styles.badge}>{item.badge}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
          <button style={styles.ctaButton} onClick={() => router.push('/request-fuel')}>
          طلب مازوت الآن
        </button>
        <button style={styles.secondaryButton} onClick={() => router.push('/register')}>
          إنشاء حساب جديد
        </button>
        <a href="/register" style={styles.secondaryLink}>لست لديك حساب؟ المحل الآن</a>
      </div>

      <div style={styles.footer}>
        <div style={styles.trustItem}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <span>دفع آمن</span>
        </div>
        <div style={styles.trustItem}>
          <span style={{ fontSize: 18 }}>🚚</span>
          <span>توصيل سريع</span>
        </div>
        <div style={styles.trustItem}>
          <span style={{ fontSize: 18 }}>⭐</span>
          <span>خدمة موثوقة</span>
        </div>
        <div style={styles.trustItem}>
          <span style={{ fontSize: 18 }}>📞</span>
          <span>دعم 24/7</span>
        </div>
      </div>
    </div>
  )
}
