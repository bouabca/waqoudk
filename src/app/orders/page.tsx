'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const t = theme

const styles = {
  container: { maxWidth: 430, margin: '0 auto', backgroundColor: t.colors.canvasSoft, minHeight: '100vh', direction: 'rtl' as const } as const,
  header: { backgroundColor: t.colors.canvas, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.colors.surfacePressed}` } as const,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: t.colors.ink, cursor: 'pointer', padding: 0 } as const,
  headerTitle: { fontSize: 17, fontWeight: 700, color: t.colors.ink, fontFamily: t.fontFamily.text } as const,
  spacer: { width: 22 } as const,
  list: { padding: '12px 16px', display: 'flex', flexDirection: 'column' as const, gap: 10 } as const,
  orderCard: { backgroundColor: t.colors.canvas, borderRadius: t.rounded.xl, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: t.shadow.level3 } as const,
  orderInfo: { display: 'flex', flexDirection: 'column' as const, gap: 4 } as const,
  orderNumber: { color: t.colors.ink, fontSize: 14, fontWeight: 600, fontFamily: t.fontFamily.text } as const,
  orderMeta: { color: t.colors.body, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, fontFamily: t.fontFamily.text } as const,
  statusBadge: { padding: '4px 10px', borderRadius: t.rounded.pill, fontSize: 11, fontWeight: 600, fontFamily: t.fontFamily.text } as const,
  orderPrice: { color: t.colors.primary, fontSize: 15, fontWeight: 700, fontFamily: t.fontFamily.text } as const,
  loadMore: { textAlign: 'center' as const, color: t.colors.primary, fontSize: 13, padding: 16, cursor: 'pointer', fontFamily: t.fontFamily.text } as const,
  empty: { textAlign: 'center' as const, color: t.colors.body, fontSize: 14, padding: 48, fontFamily: t.fontFamily.text } as const,
}

const statusColors: Record<string, { bg: string, text: string }> = {
  pending: { bg: '#FFF3E0', text: theme.colors.warning },
  assigned: { bg: theme.colors.canvasSofter, text: theme.colors.primary },
  delivered: { bg: theme.colors.canvasSofter, text: theme.colors.success },
  cancelled: { bg: theme.colors.canvasSoft, text: theme.colors.mute },
}

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  assigned: 'قيد التوصيل',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalPrice: number
  driverName: string | null
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.ok ? res.json() : { orders: [] })
      .then((data) => setOrders(data.orders || []))
      .catch(() => {})
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.push('/home')}>←</button>
        <span style={styles.headerTitle}>الطلبات</span>
        <div style={styles.spacer} />
      </div>

      <div style={styles.list}>
        {orders.length === 0 && <div style={styles.empty}>لا توجد طلبات حالياً</div>}
        {orders.map((order) => {
          const sc = statusColors[order.status] || statusColors.pending
          return (
            <div key={order.id} style={styles.orderCard} onClick={() => router.push(`/orders/${order.id}`)}>
              <div style={styles.orderInfo}>
                <span style={styles.orderNumber}>{order.orderNumber}</span>
                <div style={styles.orderMeta}>
                  <span style={{ ...styles.statusBadge, backgroundColor: sc.bg, color: sc.text }}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  {order.driverName && <span>🚚 {order.driverName}</span>}
                </div>
              </div>
              <span style={styles.orderPrice}>{order.totalPrice.toLocaleString()} دج</span>
            </div>
          )
        })}
      </div>

      {orders.length > 0 && (
        <div style={styles.loadMore}>عرض المزيد</div>
      )}
    </div>
  )
}
