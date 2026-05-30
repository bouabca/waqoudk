'use client'

import { useState } from 'react'
import Button from '../Common/Button'
import Input from '../Common/Input'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!phone || !password) {
      setError('يرجى ملء جميع الحقول')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'فشل تسجيل الدخول')
        return
      }
      onSuccess?.()
    } catch {
      setError('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  }

  const switchStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
    marginTop: 16,
  }

  const linkStyle: React.CSSProperties = {
    color: '#2D7D3B',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: 14,
  }

  return (
    <div style={formStyle}>
      <h1 style={titleStyle}>تسجيل الدخول</h1>
      <Input
        label="رقم الهاتف"
        placeholder="05 XX XX XX XX"
        value={phone}
        onChange={setPhone}
        error={error && !phone ? error : undefined}
        dir="ltr"
      />
      <Input
        label="كلمة المرور"
        type="password"
        placeholder="أدخل كلمة المرور"
        value={password}
        onChange={setPassword}
        error={error && !password ? error : undefined}
      />
      {error && phone && password && (
        <p style={{ fontSize: 12, color: '#D32F2F', textAlign: 'center' }}>{error}</p>
      )}
      <Button onClick={handleSubmit} loading={loading}>
        تسجيل الدخول
      </Button>
      <div style={switchStyle}>
        ليس لديك حساب؟{' '}
        <button style={linkStyle} onClick={onSwitchToRegister}>
          إنشاء حساب جديد
        </button>
      </div>
    </div>
  )
}
