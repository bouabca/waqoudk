'use client'

import { useState } from 'react'
import Button from '../Common/Button'
import Input from '../Common/Input'
import PhoneInput from './PhoneInput'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accountType, setAccountType] = useState('client')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!name || !phone || !password || !address) {
      setError('يرجى ملء جميع الحقول')
      return
    }
    if (password !== confirmPassword) {
      setError('كلمة المرور غير متطابقة')
      return
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password, accountType, address }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'فشل إنشاء الحساب')
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

  const selectStyle: React.CSSProperties = {
    height: 48,
    border: '1px solid #E0E0E0',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    backgroundColor: '#FFFFFF',
    textAlign: 'right',
    direction: 'rtl',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#333333',
    marginBottom: 8,
    fontWeight: 500,
    display: 'block',
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
      <h1 style={titleStyle}>إنشاء حساب جديد</h1>
      <Input
        label="الاسم الكامل"
        placeholder="أدخل اسمك الكامل"
        value={name}
        onChange={setName}
      />
      <PhoneInput value={phone} onChange={setPhone} />
      <Input
        label="كلمة المرور"
        type="password"
        placeholder="أدخل كلمة المرور"
        value={password}
        onChange={setPassword}
      />
      <Input
        label="تأكيد كلمة المرور"
        type="password"
        placeholder="أعد إدخال كلمة المرور"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />
      <div>
        <label style={labelStyle}>نوع الحساب</label>
        <select
          style={selectStyle}
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="client">عميل</option>
          <option value="station">محطة وقود</option>
          <option value="driver">سائق</option>
        </select>
      </div>
      <Input
        label="العنوان"
        placeholder="أدخل عنوانك"
        value={address}
        onChange={setAddress}
      />
      {error && (
        <p style={{ fontSize: 12, color: '#D32F2F', textAlign: 'center' }}>{error}</p>
      )}
      <Button onClick={handleSubmit} loading={loading}>
        إنشاء حساب
      </Button>
      <div style={switchStyle}>
        لديك حساب بالفعل؟{' '}
        <button style={linkStyle} onClick={onSwitchToLogin}>
          تسجيل الدخول
        </button>
      </div>
    </div>
  )
}
