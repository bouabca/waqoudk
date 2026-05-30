'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const SUBSCRIPTIONS = [
  { category: 'فلاح', price: 30000, icon: '🌾', desc: 'اشتراك شهري للمزارعين — طلبات غير محدودة' },
  { category: 'ورشةبناء', price: 60000, icon: '🏗️', desc: 'اشتراك شهري لورش البناء — طلبات غير محدودة' },
  { category: 'وكالةنقل', price: 100000, icon: '🚛', desc: 'اشتراك شهري لوكالات النقل — طلبات غير محدودة' },
]

const styles = {
  container: { ...theme.container, backgroundColor: theme.colors.canvasSoft } as React.CSSProperties,
  header: { backgroundColor: theme.colors.ink, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  headerTitle: { color: theme.colors.onPrimary, fontSize: 17, fontWeight: 700 } as React.CSSProperties,
  backBtn: { background: 'none', border: 'none', color: theme.colors.onPrimary, fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1 } as React.CSSProperties,
  section: { padding: '16px' } as React.CSSProperties,
  card: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 20, marginBottom: 12, boxShadow: theme.shadow.level3 } as React.CSSProperties,
  cardTitle: { fontSize: 16, fontWeight: 700, color: theme.colors.ink, marginBottom: 4 } as React.CSSProperties,
  cardSub: { fontSize: 13, color: theme.colors.body, marginBottom: 16 } as React.CSSProperties,
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.colors.canvasSoft}` } as React.CSSProperties,
  priceLabel: { color: theme.colors.body, fontSize: 14 } as React.CSSProperties,
  priceValue: { color: theme.colors.ink, fontSize: 18, fontWeight: 700 } as React.CSSProperties,
  activeBadge: { backgroundColor: theme.colors.ink, color: theme.colors.onPrimary, borderRadius: theme.rounded.pill, padding: '2px 10px', fontSize: 10, fontWeight: 600 } as React.CSSProperties,
  userPlanCard: { backgroundColor: theme.colors.ink, borderRadius: theme.rounded.xl, padding: '20px', marginBottom: 16, textAlign: 'center' as const } as React.CSSProperties,
  userPlanLabel: { color: theme.colors.onPrimary, fontSize: 12, opacity: 0.7 } as React.CSSProperties,
  userPlanName: { color: theme.colors.onPrimary, fontSize: 24, fontWeight: 700, marginTop: 4 } as React.CSSProperties,
  userPlanPrice: { color: theme.colors.onPrimary, fontSize: 13, opacity: 0.9, marginTop: 4 } as React.CSSProperties,
  loadingWrap: { ...theme.container, display: 'flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
  loadingText: { color: theme.colors.body, fontSize: 14 } as React.CSSProperties,
}

export default function PricingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (!d?.user) { router.push('/login'); return }
      setUser(d.user)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingText}>جاري التحميل...</div>
      </div>
    )
  }

  const userSub = SUBSCRIPTIONS.find(s => s.category === user?.category)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => router.push('/home')}>←</button>
        <span style={styles.headerTitle}>الاشتراك</span>
        <div style={{ width: 20 }} />
      </div>

      <div style={styles.section}>
        {userSub && (
          <div style={styles.userPlanCard}>
            <div style={styles.userPlanLabel}>خطتك الحالية</div>
            <div style={styles.userPlanName}>{userSub.icon} {userSub.category}</div>
            <div style={styles.userPlanPrice}>{userSub.price.toLocaleString()} دج / شهرياً</div>
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.cardTitle}>باقات الاشتراك الشهري</div>
          <div style={styles.cardSub}>اختر باقتك واستمتع بطلبات غير محدودة</div>
          {SUBSCRIPTIONS.map((sub) => (
            <div key={sub.category} style={{ ...styles.priceRow, borderBottom: sub === SUBSCRIPTIONS[SUBSCRIPTIONS.length - 1] ? 'none' : `1px solid ${theme.colors.canvasSoft}`, opacity: sub.category === user?.category ? 1 : 0.6 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{sub.icon}</span>
                  <span style={styles.priceLabel}>{sub.category}</span>
                  {sub.category === user?.category && <span style={styles.activeBadge}>حالياً</span>}
                </div>
                <div style={{ fontSize: 11, color: theme.colors.mute, marginTop: 4 }}>{sub.desc}</div>
              </div>
              <span style={styles.priceValue}>{sub.price.toLocaleString()} دج</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
