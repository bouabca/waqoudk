'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { theme } from '@/lib/theme'

const t = theme

const styles = {
  container: { maxWidth: 430, margin: '0 auto', backgroundColor: t.colors.canvasSoft, minHeight: '100vh', direction: 'rtl' as const } as const,
  header: { backgroundColor: t.colors.canvas, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.colors.surfacePressed}` } as const,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: t.colors.ink, cursor: 'pointer', padding: 0 } as const,
  headerRight: { display: 'flex', alignItems: 'center', gap: 8 } as const,
  orderNum: { fontSize: 15, fontWeight: 700, color: t.colors.ink, fontFamily: t.fontFamily.text } as const,
  trackBtn: { ...t.buttonSubtle, padding: '6px 14px', fontSize: 13 } as const,
  body: { padding: 16 } as const,
  progressCard: { backgroundColor: t.colors.canvas, borderRadius: t.rounded.xl, padding: '20px 16px', marginBottom: 12, boxShadow: t.shadow.level3 } as const,
  progressRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 } as const,
  step: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4 } as const,
  stepCircle: { width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 } as const,
  stepLine: { flex: 1, height: 2, margin: '0 4px' } as const,
  stepLabel: { fontSize: 10, color: t.colors.body, textAlign: 'center' as const, fontFamily: t.fontFamily.text } as const,
  stepLineActive: { backgroundColor: t.colors.primary } as const,
  mapPlaceholder: { backgroundColor: t.colors.surfacePressed, borderRadius: t.rounded.xl, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.colors.body, fontSize: 14, marginBottom: 12, fontFamily: t.fontFamily.text } as const,
  driverCard: { backgroundColor: t.colors.canvas, borderRadius: t.rounded.xl, padding: 16, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, boxShadow: t.shadow.level3 } as const,
  driverAvatar: { width: 48, height: 48, borderRadius: '50%', backgroundColor: t.colors.canvasSofter, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: t.colors.ink } as const,
  driverInfo: { flex: 1 } as const,
  driverName: { color: t.colors.ink, fontSize: 15, fontWeight: 600, fontFamily: t.fontFamily.text } as const,
  driverRating: { color: t.colors.warning, fontSize: 12, fontFamily: t.fontFamily.text } as const,
  callBtn: { ...t.buttonPrimary, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13 } as const,
  detailsCard: { backgroundColor: t.colors.canvas, borderRadius: t.rounded.xl, padding: 16, boxShadow: t.shadow.level3 } as const,
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: t.colors.body, fontFamily: t.fontFamily.text } as const,
  detailLabel: { color: t.colors.body } as const,
  detailValue: { fontWeight: 500 } as const,
  statusBadge: { padding: '4px 10px', borderRadius: t.rounded.pill, fontSize: 11, fontWeight: 600, display: 'inline-block', fontFamily: t.fontFamily.text } as const,
  // Rating styles
  ratingSection: { backgroundColor: t.colors.canvas, borderRadius: t.rounded.xl, padding: 16, marginTop: 12, boxShadow: t.shadow.level3 } as const,
  ratingTitle: { fontSize: 15, fontWeight: 600, color: t.colors.ink, marginBottom: 8, textAlign: 'center' as const, fontFamily: t.fontFamily.text } as const,
  starsContainer: { display: 'flex', justifyContent: 'center', gap: 8, margin: '12px 0' } as const,
  star: { fontSize: 32, cursor: 'pointer', transition: 'transform 0.1s' } as const,
  starActive: { transform: 'scale(1.2)' } as const,
  reviewInput: { ...t.textInput, minHeight: 70, resize: 'vertical' as const, textAlign: 'right' as const } as const,
  ratingBtn: { ...t.buttonLarge, width: '100%', marginTop: 10 } as const,
  ratedBanner: { backgroundColor: t.colors.canvasSofter, borderRadius: t.rounded.md, padding: 12, textAlign: 'center' as const, color: t.colors.success, fontSize: 13, fontWeight: 500, marginTop: 12, fontFamily: t.fontFamily.text } as const,
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FFF3E0', text: theme.colors.warning },
  approved: { bg: theme.colors.canvasSofter, text: theme.colors.primary },
  in_progress: { bg: theme.colors.canvasSofter, text: theme.colors.primary },
  completed: { bg: theme.colors.canvasSofter, text: theme.colors.success },
  cancelled: { bg: theme.colors.canvasSoft, text: theme.colors.mute },
}

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  approved: 'تم الموافقة',
  in_progress: 'قيد التوصيل',
  completed: 'تم التسليم',
  cancelled: 'ملغي',
}

const steps = ['pending', 'approved', 'in_progress', 'completed']
const stepLabels = ['قيد الانتظار', 'تم الموافقة', 'قيد التوصيل', 'تم التسليم']

const STARS = [1, 2, 3, 4, 5]

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Rating state
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState('')
  const [sendingRating, setSendingRating] = useState(false)
  const [ratingMessage, setRatingMessage] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/orders/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        setOrder(data?.order || data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const currentStep = order ? Math.max(0, steps.indexOf(order.status)) : 0

  const handleSubmitRating = async () => {
    if (userRating === 0) return
    setSendingRating(true)
    try {
      const res = await fetch(`/api/orders/${id}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: userRating, review }),
      })
      if (res.ok) {
        setRatingMessage('تم إرسال التقييم بنجاح! شكراً لك.')
        setOrder({ ...order, isRated: true })
      } else {
        const data = await res.json()
        setRatingMessage(data.error || 'حدث خطأ')
      }
    } catch {
      setRatingMessage('حدث خطأ في الاتصال')
    } finally {
      setSendingRating(false)
    }
  }

  if (loading) return <div style={styles.container}><div style={{ padding: 48, textAlign: 'center', color: t.colors.body, fontFamily: t.fontFamily.text }}>جاري التحميل...</div></div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.push('/orders')}>←</button>
        <div style={styles.headerRight}>
          <span style={styles.orderNum}>{order?.orderNumber || 'الطلب'}</span>
          <button style={styles.trackBtn} onClick={() => router.push(`/orders/${id}/tracking`)}>تتبع الطلب</button>
        </div>
      </div>

      <div style={styles.body}>
        {/* Progress */}
        <div style={styles.progressCard}>
          <div style={styles.progressRow}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : undefined }}>
                <div style={styles.step}>
                  <div style={{
                    ...styles.stepCircle,
                    backgroundColor: i <= currentStep ? t.colors.primary : t.colors.surfacePressed,
                    color: i <= currentStep ? t.colors.onPrimary : t.colors.mute,
                  }}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span style={styles.stepLabel}>{stepLabels[i]}</span>
                </div>
                {i < 3 && <div style={{ ...styles.stepLine, backgroundColor: i < currentStep ? t.colors.primary : t.colors.surfacePressed }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Status badge */}
        {order && (
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <span style={{
              ...styles.statusBadge,
              backgroundColor: (statusColors[order.status] || statusColors.pending).bg,
              color: (statusColors[order.status] || statusColors.pending).text,
            }}>
              {statusLabels[order.status] || order.status}
            </span>
          </div>
        )}

        {/* Map */}
        {order && order.lat && order.lng ? (
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${order.lng - 0.01},${order.lat - 0.01},${order.lng + 0.01},${order.lat + 0.01}&layer=mapnik&marker=${order.lat},${order.lng}`}
            style={{ width: '100%', height: 200, border: 'none', borderRadius: t.rounded.xl, marginBottom: 12 }}
          />
        ) : (
          <div style={styles.mapPlaceholder}>
            <span>📍 موقع التوصيل</span>
          </div>
        )}

        {/* Driver card */}
        {order && order.driverName && (
          <div style={styles.driverCard}>
            <div style={styles.driverAvatar}>{order.driverName.charAt(0)}</div>
            <div style={styles.driverInfo}>
              <div style={styles.driverName}>{order.driverName}</div>
              {order.driverRating > 0 && <div style={styles.driverRating}>⭐ {Number(order.driverRating).toFixed(1)}</div>}
            </div>
            {order.driverPhone && (
              <button style={styles.callBtn} onClick={() => window.open(`tel:${order.driverPhone}`)}>📞 اتصال</button>
            )}
          </div>
        )}

        {/* Details */}
        <div style={styles.detailsCard}>
          <div style={{ fontSize: 15, fontWeight: 600, color: t.colors.ink, marginBottom: 8, fontFamily: t.fontFamily.text }}>تفاصيل الطلب</div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>الفئة</span>
            <span style={styles.detailValue}>{order?.category || 'غير محدد'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>الكمية</span>
            <span style={styles.detailValue}>{order?.quantity} لتر</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>السعر الإجمالي</span>
            <span style={{ ...styles.detailValue, color: t.colors.primary, fontWeight: 700 }}>{order?.totalPrice?.toLocaleString()} دج</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>العنوان</span>
            <span style={styles.detailValue}>{order?.address || 'سيدي بلعباس'}</span>
          </div>
        </div>

        {/* Rating Section */}
        {order && order.status === 'completed' && (
          <div style={styles.ratingSection}>
            {order.isRated ? (
              <div style={styles.ratedBanner}>
                ✅ تم تقييم هذه الخدمة {order.rating ? `(${order.rating} ⭐)` : ''}
                {order.review && <><br /><span style={{ fontSize: 12 }}>"{order.review}"</span></>}
              </div>
            ) : (
              <>
                <div style={styles.ratingTitle}>قيم الخدمة</div>
                <div style={styles.starsContainer}>
                  {STARS.map((s) => (
                    <span
                      key={s}
                      style={{
                        ...styles.star,
                        ...((hoverRating || userRating) >= s ? styles.starActive : {}),
                        opacity: (hoverRating || userRating) >= s ? 1 : 0.3,
                      }}
                      onClick={() => setUserRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <textarea
                  style={styles.reviewInput}
                  placeholder="أكتب تعليقك (اختياري)..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button
                  style={{ ...styles.ratingBtn, opacity: userRating === 0 ? 0.5 : 1 }}
                  onClick={handleSubmitRating}
                  disabled={userRating === 0 || sendingRating}
                >
                  {sendingRating ? 'جاري الإرسال...' : 'إرسال التقييم'}
                </button>
                {ratingMessage && (
                  <div style={{ textAlign: 'center', color: ratingMessage.includes('نجاح') ? t.colors.success : t.colors.error, fontSize: 12, marginTop: 8, fontFamily: t.fontFamily.text }}>
                    {ratingMessage}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
