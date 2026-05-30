'use client'

import { theme } from '@/lib/theme'

interface PaymentMethodProps {
  method: string
  selected: boolean
  onSelect: () => void
}

export default function PaymentMethod({ method, selected, onSelect }: PaymentMethodProps) {
  const methodConfig: Record<string, { title: string; description: string; icon: string }> = {
    cash: {
      title: 'الدفع عند الاستلام',
      description: 'ادفع نقداً عند استلام الطلب',
      icon: '💵',
    },
    bank_transfer: {
      title: 'تحويل بنكي',
      description: 'ادفع عبر التحويل البنكي CCP',
      icon: '🏦',
    },
  }

  const config = methodConfig[method] || { title: method, description: '', icon: '💳' }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: theme.rounded.md,
    border: `2px solid ${selected ? theme.colors.primary : theme.colors.surfacePressed}`,
    backgroundColor: selected ? theme.colors.canvasSofter : theme.colors.canvas,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: theme.fontFamily.text,
  }

  const radioStyle: React.CSSProperties = {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: `2px solid ${selected ? theme.colors.primary : theme.colors.mute}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'border-color 0.2s ease',
  }

  const radioInnerStyle: React.CSSProperties = {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: selected ? theme.colors.primary : 'transparent',
    transition: 'background-color 0.2s ease',
  }

  const iconStyle: React.CSSProperties = {
    fontSize: 24,
    flexShrink: 0,
  }

  const infoStyle: React.CSSProperties = {
    flex: 1,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 700,
    color: theme.colors.ink,
    marginBottom: 2,
  }

  const descStyle: React.CSSProperties = {
    fontSize: 12,
    color: theme.colors.body,
  }

  return (
    <div style={containerStyle} onClick={onSelect}>
      <div style={radioStyle}>
        <div style={radioInnerStyle} />
      </div>
      <span style={iconStyle}>{config.icon}</span>
      <div style={infoStyle}>
        <div style={titleStyle}>{config.title}</div>
        <div style={descStyle}>{config.description}</div>
      </div>
    </div>
  )
}
