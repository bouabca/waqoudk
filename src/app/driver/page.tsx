'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const SIDI_BELABBES = { lat: 35.1948, lng: 0.6401 }

const styles = {
  container: { ...theme.container, backgroundColor: theme.colors.canvasSoft } as React.CSSProperties,
  header: { backgroundColor: theme.colors.ink, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  headerTitle: { color: theme.colors.onPrimary, fontSize: 18, fontWeight: 700 } as React.CSSProperties,
  headerSub: { color: theme.colors.onPrimary, fontSize: 12, opacity: 0.8, cursor: 'pointer' } as React.CSSProperties,
  tabs: { display: 'flex', backgroundColor: theme.colors.canvas, borderBottom: `1px solid ${theme.colors.surfacePressed}`, overflowX: 'auto' as const } as React.CSSProperties,
  tab: { padding: '12px 14px', textAlign: 'center' as const, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: theme.colors.body, borderBottom: '2px solid transparent', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  tabActive: { color: theme.colors.ink, borderBottom: `2px solid ${theme.colors.ink}` } as React.CSSProperties,
  list: { padding: '12px 16px', display: 'flex', flexDirection: 'column' as const, gap: 10 } as React.CSSProperties,
  orderCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: '14px 16px', boxShadow: theme.shadow.level3 } as React.CSSProperties,
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } as React.CSSProperties,
  orderNumber: { color: theme.colors.ink, fontSize: 14, fontWeight: 600 } as React.CSSProperties,
  statusBadge: { padding: '4px 10px', borderRadius: theme.rounded.pill, fontSize: 11, fontWeight: 600 } as React.CSSProperties,
  orderMeta: { display: 'flex', flexDirection: 'column' as const, gap: 4, marginBottom: 10 } as React.CSSProperties,
  metaRow: { color: theme.colors.body, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties,
  metaLabel: { color: theme.colors.mute, fontSize: 11, fontWeight: 500 } as React.CSSProperties,
  actions: { display: 'flex', gap: 8, marginTop: 8 } as React.CSSProperties,
  approveBtn: { ...theme.buttonPrimary, flex: 1, padding: '10px', fontSize: 13, fontWeight: 600 } as React.CSSProperties,
  rejectBtn: { ...theme.buttonSecondary, flex: 1, padding: '10px', fontSize: 13, fontWeight: 600, color: theme.colors.error, border: `1.5px solid ${theme.colors.error}`, boxShadow: 'none' } as React.CSSProperties,
  completeBtn: { ...theme.buttonPrimary, flex: 1, padding: '10px', fontSize: 13, fontWeight: 600 } as React.CSSProperties,
  callBtn: { ...theme.buttonSubtle, padding: '10px 16px', fontSize: 13, fontWeight: 600 } as React.CSSProperties,
  empty: { textAlign: 'center' as const, color: theme.colors.body, fontSize: 14, padding: 48 } as React.CSSProperties,
  section: { padding: '16px', display: 'flex', flexDirection: 'column' as const, gap: 14 } as React.CSSProperties,
  sectionTitle: { color: theme.colors.ink, fontSize: 16, fontWeight: 700 } as React.CSSProperties,
  reviewCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: '14px 16px', boxShadow: theme.shadow.level3 } as React.CSSProperties,
  starRow: { display: 'flex', gap: 2, alignItems: 'center', marginBottom: 6 } as React.CSSProperties,
  starFilled: { color: '#FFB800', fontSize: 16 } as React.CSSProperties,
  starEmpty: { color: theme.colors.surfacePressed, fontSize: 16 } as React.CSSProperties,
  reviewText: { color: theme.colors.body, fontSize: 13, lineHeight: 1.5 } as React.CSSProperties,
  reviewMeta: { color: theme.colors.mute, fontSize: 11, marginTop: 6 } as React.CSSProperties,
  avgRating: { fontSize: 36, fontWeight: 700, color: theme.colors.ink } as React.CSSProperties,
  avgLabel: { color: theme.colors.body, fontSize: 13 } as React.CSSProperties,
  input: { width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.colors.surfacePressed}`, borderRadius: theme.rounded.md, fontSize: theme.typography.bodySm.fontSize, backgroundColor: theme.colors.canvas, outline: 'none', textAlign: 'right' as const, boxSizing: 'border-box' as const } as React.CSSProperties,
  label: { color: theme.colors.body, fontSize: 13, fontWeight: 500 } as React.CSSProperties,
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: 6 } as React.CSSProperties,
  dangerBtn: { ...theme.buttonSecondary, padding: '12px', fontSize: 14, fontWeight: 600, color: theme.colors.error, border: `1.5px solid ${theme.colors.error}`, boxShadow: 'none', marginTop: 8 } as React.CSSProperties,
  successMsg: { backgroundColor: theme.colors.canvasSofter, color: theme.colors.primary, padding: '10px', borderRadius: theme.rounded.md, fontSize: 13, textAlign: 'center' as const } as React.CSSProperties,
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FFF3E0', text: '#FFA000' },
  approved: { bg: '#E3F2FD', text: '#2196F3' },
  in_progress: { bg: theme.colors.canvasSoft, text: theme.colors.ink },
  completed: { bg: '#E8F5E9', text: '#4CAF50' },
  cancelled: { bg: theme.colors.canvasSoft, text: theme.colors.mute },
}

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  approved: 'تم الموافقة',
  in_progress: 'قيد التوصيل',
  completed: 'تم التسليم',
  cancelled: 'ملغي',
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: size, color: s <= rating ? '#FFB800' : theme.colors.surfacePressed }}>
          ★
        </span>
      ))}
    </div>
  )
}

interface Order {
  id: string
  orderNumber: string
  status: string
  quantity: number
  totalPrice: number
  category: string | null
  address: string | null
  lat: number | null
  lng: number | null
  isRated: boolean
  rating: number | null
  review: string | null
  completedAt: string | null
  createdAt: string
  user: { id: string; name: string; phone: string; address: string | null; category: string | null }
}

export default function DriverDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'ratings' | 'profile'>('pending')
  const [user, setUser] = useState<any>(null)
  const [profileName, setProfileName] = useState('')
  const [profileLat, setProfileLat] = useState(SIDI_BELABBES.lat)
  const [profileLng, setProfileLng] = useState(SIDI_BELABBES.lng)
  const [profileMessage, setProfileMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (!d?.user || d.user.accountType !== 'livreur') {
        router.push('/login')
        return
      }
      setUser(d.user)
      setProfileName(d.user.name || '')
      if (d.user.lat != null && d.user.lng != null) {
        setProfileLat(d.user.lat)
        setProfileLng(d.user.lng)
      }
    })
    fetchOrders()
  }, [])

  useEffect(() => {
    if (activeTab !== 'profile' || !mapRef.current || mapInstance.current || user?.accountType !== 'livreur') return
    let cancelled = false
    ;(async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !mapRef.current) return
      const pos = { lat: profileLat, lng: profileLng }
      const map = L.map(mapRef.current).setView([pos.lat, pos.lng], 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
      const icon = L.divIcon({
        className: '',
        html: '<div style="background:#000;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:16px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">📍</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      })
      const marker = L.marker([pos.lat, pos.lng], { draggable: true, icon }).addTo(map)
      marker.on('dragend', () => {
        const p = marker.getLatLng()
        setProfileLat(p.lat)
        setProfileLng(p.lng)
      })
      map.on('click', (e: any) => {
        marker.setLatLng([e.latlng.lat, e.latlng.lng])
        setProfileLat(e.latlng.lat)
        setProfileLng(e.latlng.lng)
      })
      markerRef.current = marker
      mapInstance.current = map
    })()
    return () => { cancelled = true; if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null } }
  }, [activeTab, user])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/drivers/orders')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch {}
  }

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/drivers/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) fetchOrders()
    } catch {}
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setProfileMessage('')
    try {
      const res = await fetch('/api/drivers/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName, lat: profileLat, lng: profileLng }),
      })
      const data = await res.json()
      if (res.ok) {
        setProfileMessage('تم تحديث الملف الشخصي ✓')
        setUser((prev: any) => ({ ...prev, name: profileName }))
      } else {
        setProfileMessage(data.error || 'حدث خطأ')
      }
    } catch {
      setProfileMessage('حدث خطأ في الاتصال')
    }
    setSaving(false)
  }

  const filtered = activeTab === 'pending' ? orders.filter(o => o.status === 'pending' || o.status === 'approved' || o.status === 'in_progress') : orders

  const completedWithRatings = orders.filter(o => o.status === 'completed' && o.isRated && o.rating != null)
  const avgRating = completedWithRatings.length > 0
    ? completedWithRatings.reduce((s, o) => s + o.rating!, 0) / completedWithRatings.length
    : 0

  const pendingActiveCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length
  const ratedCount = completedWithRatings.length

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.headerTitle}>🚚 لوحة الموزع</div>
          <div style={styles.headerSub} onClick={() => setActiveTab('profile')}>{user?.name || ''}</div>
        </div>
        <button style={{ background: 'none', border: 'none', color: theme.colors.onPrimary, fontSize: 22, cursor: 'pointer' }} onClick={() => router.push('/home')}>☰</button>
      </div>

      <div style={styles.tabs}>
        <div style={{ ...styles.tab, ...(activeTab === 'pending' ? styles.tabActive : {}) }} onClick={() => setActiveTab('pending')}>
          النشطة ({pendingActiveCount})
        </div>
        <div style={{ ...styles.tab, ...(activeTab === 'all' ? styles.tabActive : {}) }} onClick={() => setActiveTab('all')}>
          الكل ({orders.length})
        </div>
        <div style={{ ...styles.tab, ...(activeTab === 'ratings' ? styles.tabActive : {}) }} onClick={() => setActiveTab('ratings')}>
          التقييمات ({ratedCount})
        </div>
        <div style={{ ...styles.tab, ...(activeTab === 'profile' ? styles.tabActive : {}) }} onClick={() => setActiveTab('profile')}>
          الملف الشخصي
        </div>
      </div>

      {activeTab === 'ratings' && (
        <div style={styles.section}>
          {ratedCount === 0 ? (
            <div style={styles.empty}>
              ⭐ لا توجد تقييمات بعد<br />
              <span style={{ fontSize: 12 }}>ستظهر التقييمات بعد إتمام الطلبات</span>
            </div>
          ) : (
            <>
              <div style={{ ...styles.reviewCard, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={styles.avgRating}>{avgRating.toFixed(1)}</div>
                  <div style={styles.starRow}><StarRating rating={Math.round(avgRating)} /></div>
                  <div style={styles.avgLabel}>{ratedCount} تقييم</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...styles.avgLabel, marginBottom: 8 }}>توزيع التقييمات</div>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = completedWithRatings.filter(o => o.rating === star).length
                    const pct = ratedCount > 0 ? (count / ratedCount) * 100 : 0
                    return (
                      <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: theme.colors.body, width: 30 }}>{star} ★</span>
                        <div style={{ flex: 1, height: 6, backgroundColor: theme.colors.surfacePressed, borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#FFB800', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 10, color: theme.colors.mute, width: 20 }}>{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              {orders.filter(o => o.status === 'completed' && o.isRated).map((order) => (
                <div key={order.id} style={styles.reviewCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ color: theme.colors.ink, fontSize: 13, fontWeight: 600 }}>{order.user.name}</span>
                    <StarRating rating={order.rating || 0} />
                  </div>
                  {order.review && <div style={styles.reviewText}>{order.review}</div>}
                  <div style={styles.reviewMeta}>
                    {order.orderNumber} · {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-DZ') : ''}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div style={{ ...styles.section, gap: 16 }}>
          <div style={styles.sectionTitle}>تعديل الملف الشخصي</div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>الاسم</label>
            <input
              style={styles.input}
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="اسمك الكامل"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>موقعك على الخريطة</label>
            <div ref={mapRef} style={{ width: '100%', height: 240, borderRadius: theme.rounded.xl, overflow: 'hidden' }} />
            <span style={{ color: theme.colors.body, fontSize: theme.typography.caption.fontSize }}>
              انقر على الخريطة أو اسحب العلامة لتحديد موقعك
            </span>
          </div>

          {profileMessage && (
            <div style={profileMessage.includes('✓') ? styles.successMsg : { ...styles.successMsg, color: theme.colors.error }}>
              {profileMessage}
            </div>
          )}

          <button
            style={saving ? { ...styles.approveBtn, backgroundColor: theme.colors.surfacePressed, color: theme.colors.mute, cursor: 'default' } : styles.approveBtn}
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>

          <div style={{ borderTop: `1px solid ${theme.colors.surfacePressed}`, marginTop: 8, paddingTop: 16 }}>
            <div style={{ ...styles.sectionTitle, marginBottom: 8, color: theme.colors.error }}>المخاطر</div>
            <button style={styles.dangerBtn} onClick={handleLogout}>
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}

      {(activeTab === 'pending' || activeTab === 'all') && (
        <div style={styles.list}>
          {filtered.length === 0 && (
            <div style={styles.empty}>
              🚚 لا توجد طلبات حالياً<br />
              <span style={{ fontSize: 12 }}>ستظهر الطلبات الجديدة هنا</span>
            </div>
          )}
          {filtered.map((order) => {
            const sc = statusColors[order.status] || statusColors.pending
            return (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <span style={styles.orderNumber}>{order.orderNumber}</span>
                  <span style={{ ...styles.statusBadge, backgroundColor: sc.bg, color: sc.text }}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                <div style={styles.orderMeta}>
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>العميل:</span>
                    <span>{order.user.name}</span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>الهاتف:</span>
                    <span>{order.user.phone}</span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>الكمية:</span>
                    <span>{order.quantity} لتر</span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>الفئة:</span>
                    <span>{order.category || 'غير محدد'}</span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>السعر:</span>
                    <span style={{ color: theme.colors.ink, fontWeight: 600 }}>{order.totalPrice.toLocaleString()} دج</span>
                  </div>
                </div>

                <div style={styles.actions}>
                  {(order.status === 'pending') && (
                    <>
                      <button style={styles.approveBtn} onClick={() => updateStatus(order.id, 'approved')}>موافقة</button>
                      <button style={styles.rejectBtn} onClick={() => updateStatus(order.id, 'cancelled')}>رفض</button>
                    </>
                  )}
                  {(order.status === 'approved') && (
                    <>
                      <button style={styles.completeBtn} onClick={() => updateStatus(order.id, 'in_progress')}>بدأ التوصيل</button>
                      <button style={styles.callBtn} onClick={() => window.location.href = `tel:${order.user.phone}`}>📞 اتصال</button>
                    </>
                  )}
                  {(order.status === 'in_progress') && (
                    <>
                      <button style={styles.completeBtn} onClick={() => updateStatus(order.id, 'completed')}>تم التسليم</button>
                      <button style={styles.callBtn} onClick={() => window.location.href = `tel:${order.user.phone}`}>📞 اتصال</button>
                    </>
                  )}
                  {(order.status === 'completed' || order.status === 'cancelled') && (
                    <button style={{ ...styles.approveBtn, backgroundColor: theme.colors.body, cursor: 'default', flex: 1 }}>تم</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
