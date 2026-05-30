'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const SIDI_BELABBES = { lat: 35.1948, lng: 0.6401 }

const s = {
  container: { ...theme.container, backgroundColor: theme.colors.canvasSoft } as React.CSSProperties,
  header: { backgroundColor: theme.colors.ink, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  headerTitle: { color: theme.colors.onPrimary, fontSize: 17, fontWeight: 700 } as React.CSSProperties,
  backBtn: { background: 'none', border: 'none', color: theme.colors.onPrimary, fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1 } as React.CSSProperties,
  mapWrap: { width: '100%', height: 200, backgroundColor: theme.colors.surfacePressed } as React.CSSProperties,
  section: { padding: '16px' } as React.CSSProperties,
  label: { color: theme.colors.body, fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' } as React.CSSProperties,
  input: { backgroundColor: theme.colors.canvas, color: theme.colors.ink, borderRadius: theme.rounded.md, padding: '12px 14px', fontFamily: theme.fontFamily.text, fontSize: 14, border: `1.5px solid ${theme.colors.surfacePressed}`, outline: 'none', width: '100%', boxSizing: 'border-box' as const, textAlign: 'right' as const } as React.CSSProperties,
  card: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: '2px solid transparent', boxShadow: theme.shadow.level3 } as React.CSSProperties,
  cardSelected: { border: `2px solid ${theme.colors.ink}`, backgroundColor: theme.colors.canvasSoft } as React.CSSProperties,
  avatar: { width: 44, height: 44, borderRadius: '50%', backgroundColor: theme.colors.canvasSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: theme.colors.ink, fontWeight: 700, flexShrink: 0 } as React.CSSProperties,
  driverInfo: { flex: 1, minWidth: 0 } as React.CSSProperties,
  driverName: { color: theme.colors.ink, fontSize: 14, fontWeight: 600 } as React.CSSProperties,
  driverMeta: { color: theme.colors.body, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 } as React.CSSProperties,
  statusTag: { fontSize: 11, fontWeight: 600 } as React.CSSProperties,
  btnPrimary: { ...theme.buttonPrimary, width: '100%', padding: '14px', fontSize: 15, fontWeight: 600, marginTop: 8 } as React.CSSProperties,
  btnDisabled: { ...theme.buttonPrimary, width: '100%', padding: '14px', fontSize: 15, fontWeight: 600, marginTop: 8, opacity: 0.5 } as React.CSSProperties,
  noDrivers: { textAlign: 'center' as const, color: theme.colors.body, fontSize: 13, padding: 32 } as React.CSSProperties,
  errorText: { color: theme.colors.error, fontSize: 12, textAlign: 'center' as const, marginTop: 8 } as React.CSSProperties,
  successBox: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 24, textAlign: 'center' as const, margin: '16px', boxShadow: theme.shadow.level3 } as React.CSSProperties,
  successIcon: { fontSize: 48, marginBottom: 12 } as React.CSSProperties,
  successTitle: { color: theme.colors.ink, fontSize: 18, fontWeight: 700, marginBottom: 8 } as React.CSSProperties,
  successText: { color: theme.colors.body, fontSize: 13, lineHeight: 1.6 } as React.CSSProperties,
  successBtn: { ...theme.buttonPrimary, width: '100%', padding: '14px', fontSize: 15, fontWeight: 600, marginTop: 20 } as React.CSSProperties,
  secondaryBtn: { ...theme.buttonSecondary, width: '100%', padding: '14px', fontSize: 15, fontWeight: 600, marginTop: 8 } as React.CSSProperties,
  driverList: { display: 'flex', flexDirection: 'column' as const, gap: 8 } as React.CSSProperties,
}

interface Driver {
  id: string
  name: string
  phone: string
  rating: number
  avatar: string | null
  lat: number | null
  lng: number | null
  isAvailable: boolean
}

export default function RequestFuelPage() {
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const driverMarkersRef = useRef<any[]>([])

  const [step, setStep] = useState<'form' | 'success'>('form')
  const [quantity, setQuantity] = useState('')
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderResult, setOrderResult] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) { router.push('/login'); return null } }).catch(() => router.push('/login'))
  }, [])

  function addDriverMarkers(L: any, map: any) {
    driverMarkersRef.current.forEach((m: any) => m.remove())
    driverMarkersRef.current = []
    const seen = new Set<string>()
    drivers.forEach((driver) => {
      if (!driver.lat || !driver.lng) return
      const key = `${driver.lat},${driver.lng}`
      if (seen.has(key)) return
      seen.add(key)
      const marker = L.marker([driver.lat, driver.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="background:${theme.colors.ink};color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white">🚚</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        }),
      }).addTo(map)
      marker.bindPopup(`<div dir="rtl" style="text-align:right;font-family:Arial"><b>${driver.name}</b><br/>⭐ ${driver.rating} | 📞 ${driver.phone}<br/>${driver.isAvailable ? '🟢 متاح' : '🔴 مشغول'}</div>`)
      driverMarkersRef.current.push(marker)
    })
  }

  useEffect(() => {
    let cancelled = false

    async function init() {
      if (typeof window === 'undefined' || !mapRef.current) return
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !mapRef.current) return

      const map = L.map(mapRef.current).setView([SIDI_BELABBES.lat, SIDI_BELABBES.lng], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
      leafletRef.current = L
      mapInstance.current = map

      const res = await fetch('/api/drivers')
      const data = await res.json()
      if (cancelled) return
      setDrivers(data.drivers || [])
      addDriverMarkers(L, map)
    }

    init()
    return () => { cancelled = true; driverMarkersRef.current.forEach((m: any) => m.remove()); driverMarkersRef.current = []; if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null } }
  }, [])

  const handleSubmit = async () => {
    setError('')
    if (!quantity || Number(quantity) <= 0) { setError('يرجى إدخال الكمية'); return }
    if (!selectedDriver) { setError('يرجى اختيار موزع'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: Number(quantity),
          address: 'سيدي بلعباس',
          lat: SIDI_BELABBES.lat,
          lng: SIDI_BELABBES.lng,
          itemPrice: Number(quantity) * 31,
          deliveryFee: 500,
          discount: 0,
          driverId: selectedDriver.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'حدث خطأ'); return }
      setOrderResult(data.order)
      setStep('success')
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div style={s.container}>
        <div style={s.header}>
          <button style={s.backBtn} onClick={() => router.push('/home')}>←</button>
          <span style={s.headerTitle}>تم إنشاء الطلب</span>
          <div style={{ width: 20 }} />
        </div>
        <div style={s.successBox}>
          <div style={s.successIcon}>✅</div>
          <div style={s.successTitle}>تم إنشاء الطلب بنجاح!</div>
          <div style={s.successText}>
            رقم الطلب: {orderResult?.orderNumber}<br />
            الحالة: قيد الانتظار<br />
            الموزع: {orderResult?.driverName}<br />
            الكمية: {orderResult?.quantity} لتر<br />
            السعر: {orderResult?.totalPrice?.toLocaleString()} دج
            <br /><br />
            سيتم إشعار الموزع بالطلب. يمكنك متابعة حالة الطلب من صفحة الطلبات.
          </div>
          <button style={s.successBtn} onClick={() => router.push(`/orders/${orderResult?.id}`)}>متابعة الطلب</button>
          <button style={s.secondaryBtn} onClick={() => router.push('/home')}>العودة للرئيسية</button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => router.push('/home')}>←</button>
        <span style={s.headerTitle}>طلب وقود</span>
        <div style={{ width: 20 }} />
      </div>

      <div ref={mapRef} style={s.mapWrap} />

      <div style={s.section}>
        <label style={s.label}>الكمية (باللتر)</label>
        <input style={s.input} type="number" placeholder="أدخل الكمية" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

        <label style={{ ...s.label, marginTop: 16 }}>اختر الموزع</label>
        {drivers.length === 0 ? (
          <div style={s.noDrivers}>
            🚚 لا يوجد موزعون حالياً
          </div>
        ) : (
          <div style={s.driverList}>
            {drivers.map((driver) => (
              <div
                key={driver.id}
                style={{ ...s.card, ...(selectedDriver?.id === driver.id ? s.cardSelected : {}) }}
                onClick={() => setSelectedDriver(driver)}
              >
                <div style={s.avatar}>{driver.name.charAt(0)}</div>
                <div style={s.driverInfo}>
                  <div style={s.driverName}>{driver.name}</div>
                  <div style={s.driverMeta}>
                    <span>⭐ {driver.rating.toFixed(1)}</span>
                    <span>📞 {driver.phone}</span>
                    <span style={{ ...s.statusTag, color: driver.isAvailable ? '#2D7D3B' : '#D32F2F' }}>
                      {driver.isAvailable ? '🟢 متاح' : '🔴 مشغول'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <div style={s.errorText}>{error}</div>}

        <button
          style={loading || !selectedDriver ? s.btnDisabled : s.btnPrimary}
          onClick={handleSubmit}
          disabled={loading || !selectedDriver}
        >
          {loading ? 'جاري إنشاء الطلب...' : 'تأكيد الطلب'}
        </button>
      </div>
    </div>
  )
}
