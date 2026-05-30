'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const SIDI_BELABBES = { lat: 35.1948, lng: 0.6401 }

const styles = {
  container: { ...theme.container, padding: '24px 16px' } as const,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: theme.colors.ink, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' } as const,
  title: { ...theme.typography.displaySm, color: theme.colors.ink, textAlign: 'center' as const, marginTop: 8 } as const,
  description: { color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, textAlign: 'center' as const, marginTop: 8, marginBottom: 24 } as const,
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: 6, marginBottom: 14 } as const,
  label: { color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, fontWeight: 500 } as const,
  input: { width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.colors.surfacePressed}`, borderRadius: theme.rounded.md, fontSize: theme.typography.bodySm.fontSize, backgroundColor: theme.colors.canvas, outline: 'none', textAlign: 'right' as const, boxSizing: 'border-box' as const } as const,
  inputError: { border: `1.5px solid ${theme.colors.error}` } as const,
  select: { width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.colors.surfacePressed}`, borderRadius: theme.rounded.md, fontSize: theme.typography.bodySm.fontSize, backgroundColor: theme.colors.canvas, outline: 'none', textAlign: 'right' as const, appearance: 'auto' as const, boxSizing: 'border-box' as const } as const,
  primaryButton: { ...theme.buttonPrimary, marginTop: 8 } as const,
  disabledButton: { ...theme.buttonPrimary, backgroundColor: theme.colors.surfacePressed, color: theme.colors.mute, cursor: 'default', marginTop: 8 } as const,
  accountToggle: { display: 'flex', gap: 8, marginBottom: 20 } as const,
  toggleOption: { flex: 1, padding: '12px', borderRadius: theme.rounded.xl, border: `2px solid ${theme.colors.surfacePressed}`, textAlign: 'center' as const, cursor: 'pointer', fontSize: theme.typography.bodySm.fontSize, fontWeight: 600, backgroundColor: theme.colors.canvas, transition: 'all 0.2s' } as const,
  toggleActive: { border: `2px solid ${theme.colors.primary}`, backgroundColor: theme.colors.canvasSoft, color: theme.colors.primary } as const,
  fileInput: { width: '100%', padding: '10px', border: `1.5px dashed ${theme.colors.primary}`, borderRadius: theme.rounded.md, fontSize: theme.typography.caption.fontSize, backgroundColor: theme.colors.canvasSoft, outline: 'none', cursor: 'pointer', boxSizing: 'border-box' as const } as const,
  errorText: { color: theme.colors.error, fontSize: theme.typography.caption.fontSize, textAlign: 'center' as const, marginTop: 4 } as const,
  successBox: { backgroundColor: theme.colors.canvasSoft, border: `1px solid ${theme.colors.primary}`, borderRadius: theme.rounded.xl, padding: 20, textAlign: 'center' as const, marginTop: 16 } as const,
  successIcon: { fontSize: 48, marginBottom: 12 } as const,
  successTitle: { color: theme.colors.primary, ...theme.typography.bodyLg, marginBottom: 8 } as const,
  successText: { color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, lineHeight: 1.6 } as const,
}

const CATEGORIES = ['فلاح', 'ورشةبناء', 'وكالةنقل']

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'choose' | 'form' | 'success'>('choose')
  const [accountType, setAccountType] = useState<'user' | 'livreur'>('user')
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirmPassword: '', address: '', category: '', driverPermit: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [driverLocation, setDriverLocation] = useState(SIDI_BELABBES)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (step !== 'form' || accountType !== 'livreur' || !mapRef.current || mapInstance.current) return
    let cancelled = false
    ;(async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !mapRef.current) return
      const defaultPos = SIDI_BELABBES
      const pos = await new Promise<{ lat: number; lng: number }>((resolve) => {
        if (!navigator.geolocation) return resolve(defaultPos)
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => resolve(defaultPos),
          { timeout: 5000, enableHighAccuracy: false },
        )
      })
      setDriverLocation(pos)
      if (cancelled || !mapRef.current) return
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
        setDriverLocation({ lat: p.lat, lng: p.lng })
      })
      map.on('click', (e: any) => {
        marker.setLatLng([e.latlng.lat, e.latlng.lng])
        setDriverLocation({ lat: e.latlng.lat, lng: e.latlng.lng })
      })
      markerRef.current = marker
      mapInstance.current = map
    })()
    return () => { cancelled = true; if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null } }
  }, [accountType, step])

  const handleChange = (field: string, value: string) => setForm({ ...form, [field]: value })

  const validate = () => {
    if (!form.name || !form.phone || !form.email || !form.password) return 'يرجى ملء جميع الحقول المطلوبة'
    if (form.password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    if (form.password !== form.confirmPassword) return 'كلمة المرور غير متطابقة'
    if (accountType === 'user' && !form.category) return 'يرجى اختيار الفئة'
    if (accountType === 'livreur' && !form.driverPermit) return 'يرجى إرفاق رخصة القيادة'
    return ''
  }

  const handleRegister = async () => {
    setError('')
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
          accountType,
          address: form.address,
          category: accountType === 'user' ? form.category : undefined,
          driverPermit: accountType === 'livreur' ? form.driverPermit : undefined,
          lat: accountType === 'livreur' ? driverLocation.lat : undefined,
          lng: accountType === 'livreur' ? driverLocation.lng : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        return
      }
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`)
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'choose') {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => router.back()}>←</button>
        <h1 style={styles.title}>إنشاء حساب جديد</h1>
        <p style={styles.description}>اختر نوع الحساب</p>

        <div style={styles.accountToggle}>
          <div
            style={{ ...styles.toggleOption, ...(accountType === 'user' ? styles.toggleActive : {}) }}
            onClick={() => setAccountType('user')}
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>👤</div>
            <div>مستخدم</div>
            <div style={{ fontSize: theme.typography.caption.fontSize, color: theme.colors.body, fontWeight: 400 }}>أطلب المحروقات</div>
          </div>
          <div
            style={{ ...styles.toggleOption, ...(accountType === 'livreur' ? styles.toggleActive : {}) }}
            onClick={() => setAccountType('livreur')}
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>🚚</div>
            <div>موزع (Livreur)</div>
            <div style={{ fontSize: theme.typography.caption.fontSize, color: theme.colors.body, fontWeight: 400 }}>توصيل المحروقات</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button style={{ flex: 1, ...theme.buttonPrimary }} onClick={() => setStep('form')}>متابعة</button>
          <button style={{ flex: 1, ...theme.buttonSecondary, border: `1.5px solid ${theme.colors.primary}` }} onClick={() => router.push('/login')}>لدي حساب بالفعل</button>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✅</div>
          <div style={styles.successTitle}>تم إنشاء الحساب بنجاح!</div>
          <div style={styles.successText}>
            حسابك جاهز للاستخدام. يمكنك الآن تسجيل الدخول.
          </div>
          <button style={{ ...styles.primaryButton, marginTop: 20 }} onClick={() => router.push('/login')}>الذهاب إلى تسجيل الدخول</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => setStep('choose')}>←</button>
      <h1 style={styles.title}>
        {accountType === 'user' ? 'مستخدم جديد' : 'موزع جديد'}
      </h1>
      <p style={styles.description}>يرجى إدخال معلوماتك</p>

      <div style={styles.inputGroup}>
        <label style={styles.label}>الاسم الكامل *</label>
        <input style={styles.input} type="text" placeholder="أدخل اسمك الكامل" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>رقم الهاتف *</label>
        <input style={styles.input} type="tel" placeholder="05 XX XX XX XX" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>البريد الإلكتروني *</label>
        <input style={styles.input} type="email" placeholder="example@email.com" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>كلمة المرور *</label>
        <input style={styles.input} type="password" placeholder="********" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>تأكيد كلمة المرور *</label>
        <input style={styles.input} type="password" placeholder="********" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
      </div>

      {accountType === 'user' && (
        <div style={styles.inputGroup}>
          <label style={styles.label}>الفئة *</label>
          <select style={styles.select} value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
            <option value="">-- اختر الفئة --</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      )}

      {accountType === 'livreur' && (
        <>
          <div style={styles.inputGroup}>
            <label style={styles.label}>رخصة القيادة *</label>
            <input
              style={styles.fileInput}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = () => handleChange('driverPermit', reader.result as string)
                  reader.readAsDataURL(file)
                }
              }}
            />
            {form.driverPermit && (
              <span style={{ color: theme.colors.primary, fontSize: theme.typography.caption.fontSize }}>✓ تم إرفاق الملف</span>
            )}
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>موقعك على الخريطة</label>
            <div ref={mapRef} style={{ width: '100%', height: 220, borderRadius: theme.rounded.xl, overflow: 'hidden' }} />
            <span style={{ color: theme.colors.body, fontSize: theme.typography.caption.fontSize }}>انقر على الخريطة أو اسحب العلامة لتحديد موقعك</span>
          </div>
        </>
      )}

      <div style={styles.inputGroup}>
        <label style={styles.label}>العنوان</label>
        <input style={styles.input} type="text" placeholder="أدخل عنوانك (اختياري)" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
      </div>

      {error && <div style={styles.errorText}>{error}</div>}

      <button
        style={loading ? styles.disabledButton : styles.primaryButton}
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
      </button>
    </div>
  )
}
