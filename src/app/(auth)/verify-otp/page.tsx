'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { theme } from '@/lib/theme'

const styles = {
  container: { ...theme.container, padding: '24px 16px' } as const,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: theme.colors.ink, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' } as const,
  title: { ...theme.typography.displaySm, color: theme.colors.ink, textAlign: 'center' as const, marginTop: 8 } as const,
  description: { color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, textAlign: 'center' as const, marginTop: 8 } as const,
  emailDisplay: { color: theme.colors.primary, ...theme.typography.bodyMdStrong, textAlign: 'center' as const, marginTop: 4, marginBottom: 32 } as const,
  otpRow: { display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 8 } as const,
  otpBox: { width: 48, height: 52, border: `1.5px solid ${theme.colors.surfacePressed}`, borderRadius: theme.rounded.md, textAlign: 'center' as const, fontSize: '20px', fontWeight: 600, outline: 'none', backgroundColor: theme.colors.canvas, color: theme.colors.ink } as const,
  labelLight: { textAlign: 'center' as const, color: theme.colors.body, fontSize: theme.typography.caption.fontSize, marginBottom: 24 } as const,
  timerRow: { textAlign: 'center' as const, fontSize: theme.typography.bodySm.fontSize, color: theme.colors.body, marginBottom: 24 } as const,
  resendLink: { color: theme.colors.primary, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: theme.typography.bodySm.fontSize } as const,
  primaryButton: { ...theme.buttonPrimary, width: '100%' } as const,
  bottomText: { textAlign: 'center' as const, color: theme.colors.body, fontSize: theme.typography.bodySm.fontSize, marginTop: 24 } as const,
  errorText: { color: theme.colors.error, fontSize: theme.typography.caption.fontSize, textAlign: 'center' as const, marginTop: 4 } as const,
}

function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(120)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
    setError('')
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join('') }),
      })
      const data = await res.json()
      if (res.ok) {
        const payRes = await fetch('/api/auth/subscription-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        const payData = await payRes.json()
        if (payData.checkoutUrl) {
          window.location.href = payData.checkoutUrl
        } else {
          router.push('/login')
        }
      } else {
        setError(data.error || 'رمز التحقق غير صحيح')
      }
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setTimer(120)
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'حدث خطأ')
    } catch {
      setError('حدث خطأ في الاتصال')
    }
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => router.push('/register')}>←</button>
      <h1 style={styles.title}>تأكيد رمز التحقق</h1>
      <p style={styles.description}>أدخل رمز التحقق المرسل إلى بريدك الإلكتروني</p>
      <div style={styles.emailDisplay}>{email}</div>

      <div style={styles.otpRow} dir="ltr">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el }}
            style={styles.otpBox}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>
      <div style={styles.labelLight}>أدخل الرمز المكون من 6 أرقام</div>

      {error && <div style={styles.errorText}>{error}</div>}

      <div style={styles.timerRow}>
        {timer > 0 ? (
          <span>إعادة إرسال الرمز بعد ({`00:${timer.toString().padStart(2, '0')}`})</span>
        ) : (
          <button style={styles.resendLink} onClick={handleResend}>إعادة إرسال الرمز</button>
        )}
      </div>

      <button
        style={{ ...styles.primaryButton, opacity: loading ? 0.7 : 1 }}
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? 'جاري التحقق...' : 'تأكيد'}
      </button>
      <div style={styles.bottomText}>لم يصلك الرمز؟</div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div style={{ ...theme.container, padding: '24px 16px', textAlign: 'center', paddingTop: 48, color: theme.colors.body }}>
        جاري التحميل...
      </div>
    }>
      <VerifyOtpForm />
    </Suspense>
  )
}
