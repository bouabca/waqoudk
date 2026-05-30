'use client'

import { theme } from '@/lib/theme'

interface BadgeProps {
  status: 'pending' | 'in_progress' | 'completed' | 'delivered' | 'cancelled'
  text?: string
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#FFF3CD', color: theme.colors.warning, label: 'قيد الانتظار' },
  in_progress: { bg: theme.colors.canvas, color: theme.colors.ink, label: 'قيد التوصيل' },
  completed: { bg: '#E8F5E9', color: theme.colors.success, label: 'تم التوصيل' },
  delivered: { bg: '#E8F5E9', color: theme.colors.success, label: 'تم التوصيل' },
  cancelled: { bg: theme.colors.canvasSoft, color: theme.colors.hairlineMid, label: 'ملغي' },
}

export default function Badge({ status, text }: BadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: theme.rounded.pill,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        whiteSpace: 'nowrap',
      }}
    >
      {text || config.label}
    </span>
  )
}
