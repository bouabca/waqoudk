'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { theme } from '@/lib/theme'

const styles = {
  container: { ...theme.container, padding: '24px 16px' } as const,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: theme.colors.ink, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' } as const,
  title: { ...theme.typography.displaySm, color: theme.colors.ink, textAlign: 'center' as const, marginTop: 8 } as const,
  logoArea: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4, marginTop: 40, marginBottom: 32 } as const,
  logoIcon: { fontSize: 40 } as const,
  logoText: { color: theme.colors.primary, ...theme.typography.displayMd } as const,
  subtitle: { color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, textAlign: 'center' as const, lineHeight: 1.5 } as const,
  methodToggle: { display: 'flex', gap: 8, marginBottom: 20 } as const,
  methodOption: { flex: 1, padding: '10px', borderRadius: theme.rounded.xl, border: `2px solid ${theme.colors.surfacePressed}`, textAlign: 'center' as const, cursor: 'pointer', fontSize: theme.typography.bodySm.fontSize, fontWeight: 600, backgroundColor: theme.colors.canvas, transition: 'all 0.2s' } as const,
  methodActive: { border: `2px solid ${theme.colors.primary}`, backgroundColor: theme.colors.canvasSoft, color: theme.colors.primary } as const,
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: 6, marginBottom: 16 } as const,
  label: { color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, fontWeight: 500 } as const,
  input: { width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.colors.surfacePressed}`, borderRadius: theme.rounded.md, fontSize: theme.typography.bodySm.fontSize, backgroundColor: theme.colors.canvas, outline: 'none', textAlign: 'right' as const, boxSizing: 'border-box' as const } as const,
  inputRtl: { direction: 'rtl' as const } as const,
  primaryButton: { ...theme.buttonPrimary, marginTop: 8, width: '100%' } as const,
  bottomText: { textAlign: 'center' as const, color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, marginTop: 32 } as const,
  bottomLink: { color: theme.colors.primary, fontWeight: 500 } as const,
}

export default function LoginPage() {
  const router = useRouter()
  const [method, setMethod] = useState<'phone' | 'email'>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    if (method === 'phone' && !phone) { setError('يرجى إدخال رقم الهاتف'); return }
    if (method === 'email' && !email) { setError('يرجى إدخال البريد الإلكتروني'); return }
    if (!password) { setError('يرجى إدخال كلمة المرور'); return }
    try {
      const body = method === 'email' ? { email, password } : { phone, password }
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.user?.accountType === 'livreur') {
          router.push('/driver')
        } else {
          router.push('/home')
        }
      } else {
        const data = await res.json()
        setError(data.error || 'حدث خطأ')
      }
    } catch {
      setError('حدث خطأ في الاتصال')
    }
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => router.push('/')}>←</button>
      <h1 style={styles.title}>تسجيل الدخول</h1>

      <div style={styles.logoArea}>
        <span style={styles.logoIcon}>🌿</span>
        <span style={styles.logoText}>وقودك</span>
      </div>

      <p style={styles.subtitle}>مرحبا بوقودك</p>
      <p style={{ ...styles.subtitle, marginBottom: 24 }}>سجل دخولك للحصول على الخدمات الشاملة</p>

      <div style={styles.methodToggle}>
        <div style={{ ...styles.methodOption, ...(method === 'phone' ? styles.methodActive : {}) }} onClick={() => setMethod('phone')}>
          📱 رقم الهاتف
        </div>
        <div style={{ ...styles.methodOption, ...(method === 'email' ? styles.methodActive : {}) }} onClick={() => setMethod('email')}>
          ✉️ البريد الإلكتروني
        </div>
      </div>

      {method === 'phone' ? (
        <div style={styles.inputGroup}>
          <label style={styles.label}>رقم الهاتف</label>
          <input style={{ ...styles.input, ...styles.inputRtl }} type="tel" placeholder="05 XX XX XX XX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      ) : (
        <div style={styles.inputGroup}>
          <label style={styles.label}>البريد الإلكتروني</label>
          <input style={{ ...styles.input, ...styles.inputRtl }} type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      )}

      <div style={styles.inputGroup}>
        <label style={styles.label}>كلمة المرور</label>
        <input style={{ ...styles.input, ...styles.inputRtl }} type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {error && <div style={{ color: theme.colors.error, fontSize: theme.typography.caption.fontSize, textAlign: 'center', marginTop: 4 }}>{error}</div>}
      <button style={styles.primaryButton} onClick={handleLogin}>دخول</button>

      <div style={styles.bottomText}>
        ليس لديك حساب؟{' '}
        <Link href="/register" style={styles.bottomLink}>حديد</Link>
      </div>
    </div>
  )
}
