'use client'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length === 0) return ''
  let formatted = '0' + digits.slice(1)
  if (formatted.length > 2) formatted = formatted.slice(0, 2) + ' ' + formatted.slice(2)
  if (formatted.length > 6) formatted = formatted.slice(0, 6) + ' ' + formatted.slice(6)
  if (formatted.length > 10) formatted = formatted.slice(0, 10) + ' ' + formatted.slice(10)
  if (formatted.length > 14) formatted = formatted.slice(0, 14) + ' ' + formatted.slice(14)
  return formatted
}

export default function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: 16,
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#333333',
    marginBottom: 8,
    fontWeight: 500,
  }

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: 48,
    border: `1px solid ${error ? '#D32F2F' : '#E0E0E0'}`,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  }

  const countryCodeStyle: React.CSSProperties = {
    padding: '0 12px',
    fontSize: 14,
    color: '#333333',
    fontWeight: 600,
    borderLeft: '1px solid #E0E0E0',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  }

  const inputStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    border: 'none',
    outline: 'none',
    padding: '12px 16px',
    fontSize: 14,
    textAlign: 'right',
    direction: 'rtl',
    backgroundColor: 'transparent',
  }

  const errorStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  }

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>رقم الهاتف</label>
      <div style={inputContainerStyle}>
        <span style={countryCodeStyle}>+213</span>
        <input
          style={inputStyle}
          type="tel"
          placeholder="05 XX XX XX XX"
          value={formatPhone(value)}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '')
            onChange(digits)
          }}
          dir="ltr"
        />
      </div>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  )
}
