'use client'

import { useState } from 'react'
import { theme } from '@/lib/theme'

interface InputProps {
  label?: string
  placeholder?: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  dir?: 'rtl' | 'ltr'
}

export default function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  required,
  dir = 'rtl',
}: InputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: 16 }}>
      {label && (
        <label style={{ fontSize: 12, color: theme.colors.body, marginBottom: 8, fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: theme.colors.error, marginRight: 2 }}>*</span>}
        </label>
      )}
      <input
        style={{
          height: 48,
          border: `1px solid ${error ? theme.colors.error : focused ? theme.colors.primary : theme.colors.surfacePressed}`,
          borderRadius: theme.rounded.md,
          padding: '12px 16px',
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.2s ease',
          width: '100%',
          textAlign: dir === 'rtl' ? 'right' : 'left',
          direction: dir,
          backgroundColor: theme.colors.canvasSoft,
          boxSizing: 'border-box',
          fontFamily: theme.fontFamily.text,
          color: theme.colors.ink,
        }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        dir={dir}
      />
      {error && <span style={{ fontSize: 12, color: theme.colors.error, marginTop: 4 }}>{error}</span>}
    </div>
  )
}
