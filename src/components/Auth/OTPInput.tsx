'use client'

import { useRef, KeyboardEvent } from 'react'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export default function OTPInput({ value, onChange, error }: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, digit: string) => {
    if (digit && !/^\d$/.test(digit)) return
    const newValue = value.split('')
    newValue[index] = digit
    const joined = newValue.join('').slice(0, 6)
    onChange(joined)
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    margin: '24px 0',
  }

  const inputStyle = (isFilled: boolean): React.CSSProperties => ({
    width: 48,
    height: 56,
    borderRadius: 8,
    border: `2px solid ${error ? '#D32F2F' : isFilled ? '#2D7D3B' : '#E0E0E0'}`,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 700,
    outline: 'none',
    backgroundColor: isFilled ? '#F0F7F0' : '#FFFFFF',
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
  })

  const errorStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: -16,
  }

  return (
    <div>
      <div style={containerStyle}>
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputsRef.current[index] = el }}
            style={inputStyle(!!value[index])}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            dir="ltr"
          />
        ))}
      </div>
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  )
}
