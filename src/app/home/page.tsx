'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const s = {
  container: { ...theme.container, backgroundColor: theme.colors.canvasSoft } as React.CSSProperties,
  header: { backgroundColor: theme.colors.ink, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  headerTitle: { color: theme.colors.onPrimary, fontSize: 18, fontWeight: 700 } as React.CSSProperties,
  headerSub: { color: theme.colors.onPrimary, fontSize: 12, opacity: 0.8 } as React.CSSProperties,
  menuBtn: { background: 'none', border: 'none', color: theme.colors.onPrimary, fontSize: 22, cursor: 'pointer' } as React.CSSProperties,
  tabs: { display: 'flex', backgroundColor: theme.colors.canvas, borderBottom: `1px solid ${theme.colors.surfacePressed}` } as React.CSSProperties,
  tab: { flex: 1, padding: '12px', textAlign: 'center' as const, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: theme.colors.body, borderBottom: '2px solid transparent' } as React.CSSProperties,
  tabActive: { color: theme.colors.ink, borderBottom: `2px solid ${theme.colors.ink}` } as React.CSSProperties,
  list: { padding: '12px 16px', display: 'flex', flexDirection: 'column' as const, gap: 10 } as React.CSSProperties,
  card: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: '14px 16px', boxShadow: theme.shadow.level3 } as React.CSSProperties,
  cardRow: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' } as React.CSSProperties,
  cardIcon: { width: 44, height: 44, borderRadius: theme.rounded.lg, backgroundColor: theme.colors.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: theme.colors.onPrimary, flexShrink: 0 } as React.CSSProperties,
  cardInfo: { flex: 1, minWidth: 0 } as React.CSSProperties,
  cardTitle: { color: theme.colors.ink, fontSize: 14, fontWeight: 600 } as React.CSSProperties,
  cardSub: { color: theme.colors.body, fontSize: 12, marginTop: 2 } as React.CSSProperties,
  cardArrow: { color: theme.colors.mute, fontSize: 16 } as React.CSSProperties,
  priceCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: '16px', boxShadow: theme.shadow.level3, textAlign: 'center' as const } as React.CSSProperties,
  priceLabel: { color: theme.colors.mute, fontSize: 11, fontWeight: 500 } as React.CSSProperties,
  priceValue: { color: theme.colors.ink, fontSize: 28, fontWeight: 700, marginTop: 4 } as React.CSSProperties,
  sectionTitle: { color: theme.colors.ink, fontSize: 15, fontWeight: 600, marginBottom: 10 } as React.CSSProperties,
  empty: { textAlign: 'center' as const, color: theme.colors.body, fontSize: 14, padding: 48 } as React.CSSProperties,
  loadingWrap: { ...theme.container, display: 'flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties,
  loadingText: { color: theme.colors.body, fontSize: 14 } as React.CSSProperties,
  serviceCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: '14px 16px', boxShadow: theme.shadow.level3, display: 'flex', alignItems: 'center', gap: 12 } as React.CSSProperties,
  serviceIcon: { fontSize: 20 } as React.CSSProperties,
  serviceTitle: { color: theme.colors.ink, fontSize: 13, fontWeight: 600 } as React.CSSProperties,
  serviceDesc: { color: theme.colors.body, fontSize: 11, marginTop: 1 } as React.CSSProperties,
}

interface User { id: string; name: string; phone: string; accountType: string; category?: string }

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [fuelPrice, setFuelPrice] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'account'>('home')

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) { router.push('/login'); return null }
        return res.json()
      })
      .then((data) => {
        if (!data?.user) return
        setUser(data.user)
        if (data.user.accountType === 'livreur') { router.push('/driver'); return }
      })
      .finally(() => setLoading(false))

    fetch('/api/stations')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.stations?.length) setFuelPrice(data.stations[0].currentPrice)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.loadingText}>جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <div style={s.headerTitle}>🌿 وقودك</div>
          <div style={s.headerSub}>{user?.name || ''}</div>
        </div>
        <button style={s.menuBtn} onClick={() => router.push('/notifications')}>☰</button>
      </div>

      <div style={s.tabs}>
        <div style={{ ...s.tab, ...(activeTab === 'home' ? s.tabActive : {}) }} onClick={() => setActiveTab('home')}>
          الرئيسية
        </div>
        <div style={{ ...s.tab, ...(activeTab === 'account' ? s.tabActive : {}) }} onClick={() => setActiveTab('account')}>
          الحساب
        </div>
      </div>

      {activeTab === 'home' && (
        <div style={s.list}>
          <div style={s.priceCard}>
            <div style={s.priceLabel}>سعر المحروقات</div>
            <div style={s.priceValue}>{fuelPrice ? `${fuelPrice} دج` : '---'}</div>
          </div>

          <div style={s.sectionTitle}>الخدمات</div>

          <div style={s.card} onClick={() => router.push('/request-fuel')}>
            <div style={s.cardRow}>
              <div style={s.cardIcon}>⛽</div>
              <div style={s.cardInfo}>
                <div style={s.cardTitle}>طلب وقود</div>
                <div style={s.cardSub}>اطلب المحروقات لتوصيلها لمكانك</div>
              </div>
              <div style={s.cardArrow}>←</div>
            </div>
          </div>

          <div style={s.card} onClick={() => router.push('/orders')}>
            <div style={s.cardRow}>
              <div style={{ ...s.cardIcon, backgroundColor: theme.colors.canvasSoft, color: theme.colors.ink }}>📋</div>
              <div style={s.cardInfo}>
                <div style={s.cardTitle}>طلباتي</div>
                <div style={s.cardSub}>{'تتبع طلباتك السابقة والحالية'}</div>
              </div>
              <div style={s.cardArrow}>←</div>
            </div>
          </div>

          <div style={s.card} onClick={() => router.push('/stations')}>
            <div style={s.cardRow}>
              <div style={{ ...s.cardIcon, backgroundColor: theme.colors.canvasSoft, color: theme.colors.ink }}>📍</div>
              <div style={s.cardInfo}>
                <div style={s.cardTitle}>المحطات</div>
                <div style={s.cardSub}>عرض المحطات والأسعار</div>
              </div>
              <div style={s.cardArrow}>←</div>
            </div>
          </div>

          <div style={s.card} onClick={() => router.push('/pricing')}>
            <div style={s.cardRow}>
              <div style={{ ...s.cardIcon, backgroundColor: theme.colors.canvasSoft, color: theme.colors.ink }}>💰</div>
              <div style={s.cardInfo}>
                <div style={s.cardTitle}>التسعير</div>
                <div style={s.cardSub}>تفاصيل الأسعار والاشتراكات</div>
              </div>
              <div style={s.cardArrow}>←</div>
            </div>
          </div>

          <div style={{ ...s.sectionTitle, marginTop: 8 }}>خدماتنا</div>
          <div style={s.serviceCard}>
            <div style={s.serviceIcon}>🚚</div>
            <div>
              <div style={s.serviceTitle}>توصيل سريع</div>
              <div style={s.serviceDesc}>أقل من 30 دقيقة</div>
            </div>
          </div>
          <div style={s.serviceCard}>
            <div style={s.serviceIcon}>🔒</div>
            <div>
              <div style={s.serviceTitle}>دفع آمن</div>
              <div style={s.serviceDesc}>عدة طرق دفع</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div style={s.list}>
          <div style={s.card}>
            <div style={s.cardRow}>
              <div style={{ ...s.cardIcon, borderRadius: '50%', backgroundColor: theme.colors.canvasSoft, color: theme.colors.ink, fontSize: 16 }}>
                {user?.name?.charAt(0) || '?'}
              </div>
              <div style={s.cardInfo}>
                <div style={s.cardTitle}>{user?.name || 'مستخدم'}</div>
                <div style={s.cardSub}>{user?.phone || ''}</div>
              </div>
            </div>
          </div>

          <div style={{ ...s.card, cursor: 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: theme.colors.body, fontSize: 13 }}>الفئة</span>
              <span style={{ color: theme.colors.ink, fontSize: 13, fontWeight: 600 }}>{user?.category || 'غير محدد'}</span>
            </div>
          </div>

          <button
            style={{ ...theme.buttonSecondary, width: '100%', padding: '12px', fontSize: 14, fontWeight: 600, color: theme.colors.error, border: `1.5px solid ${theme.colors.error}`, boxShadow: 'none', marginTop: 16 }}
            onClick={handleLogout}
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  )
}
