'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { theme } from '@/lib/theme'

const styles = {
  container: { ...theme.container, padding: '24px 16px' } as const,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: theme.colors.ink, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' } as const,
  title: { ...theme.typography.displaySm, color: theme.colors.ink, textAlign: 'center' as const, marginTop: 8 } as const,
  description: { color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, textAlign: 'center' as const, marginTop: 8, marginBottom: 40 } as const,
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: 6, marginBottom: 24 } as const,
  label: { color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, fontWeight: 500 } as const,
  input: { width: '100%', padding: '12px 14px', border: `1.5px solid ${theme.colors.surfacePressed}`, borderRadius: theme.rounded.md, fontSize: theme.typography.bodySm.fontSize, backgroundColor: theme.colors.canvas, outline: 'none', textAlign: 'right' as const, boxSizing: 'border-box' as const } as const,
  primaryButton: { ...theme.buttonPrimary, marginTop: 8 } as const,
  bottomText: { textAlign: 'center' as const, color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, marginTop: 32 } as const,
  bottomLink: { color: theme.colors.primary, fontWeight: 500 } as const,
}

export default function EnterPhonePage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')

  const handleSubmit = async () => {
    await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`)
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => router.back()}>←</button>
      <h1 style={styles.title}>ادخل رقم هاتفك</h1>
      <p style={styles.description}>سيرسل لك رمز التحقق من الهاتف</p>

      <div style={styles.inputGroup}>
        <label style={styles.label}>رقم الهاتف</label>
        <input style={styles.input} type="tel" placeholder="05 XX XX XX XX" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <button style={styles.primaryButton} onClick={handleSubmit}>إرسال رمز التحقق</button>

      <div style={styles.bottomText}>
        <Link href="/register" style={styles.bottomLink}>إنشاء حساب جديد</Link>
      </div>
    </div>
  )
}
