'use client'

import { useRouter, useParams } from 'next/navigation'
import { theme } from '@/lib/theme'

const t = theme

const styles = {
  container: { maxWidth: 430, margin: '0 auto', backgroundColor: t.colors.canvasSoft, minHeight: '100vh', direction: 'rtl' as const } as const,
  header: { backgroundColor: t.colors.canvas, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.colors.surfacePressed}` } as const,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: t.colors.ink, cursor: 'pointer', padding: 0 } as const,
  headerTitle: { fontSize: 15, fontWeight: 700, color: t.colors.ink, fontFamily: t.fontFamily.text } as const,
  orderId: { fontSize: 13, color: t.colors.body, fontFamily: t.fontFamily.text } as const,
  body: { padding: 16 } as const,
  progressCard: { backgroundColor: t.colors.canvas, borderRadius: t.rounded.xl, padding: '20px 16px', marginBottom: 12, boxShadow: t.shadow.level3 } as const,
  stageRow: { display: 'flex', flexDirection: 'column' as const, gap: 0 } as const,
  stageItem: { display: 'flex', alignItems: 'flex-start', gap: 12 } as const,
  stageLine: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', width: 24 } as const,
  stageDot: { width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 } as const,
  stageConnector: { width: 2, flex: 1, minHeight: 30 } as const,
  stageContent: { paddingBottom: 8 } as const,
  stageTitle: { fontSize: 14, fontWeight: 600, color: t.colors.ink, fontFamily: t.fontFamily.text } as const,
  stageDate: { fontSize: 11, color: t.colors.body, marginTop: 2, fontFamily: t.fontFamily.text } as const,
  mapPlaceholder: { backgroundColor: t.colors.surfacePressed, borderRadius: t.rounded.xl, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.colors.body, fontSize: 14, marginBottom: 12, fontFamily: t.fontFamily.text } as const,
  driverCard: { backgroundColor: t.colors.canvas, borderRadius: t.rounded.xl, padding: 16, display: 'flex', alignItems: 'center', gap: 12, boxShadow: t.shadow.level3 } as const,
  driverAvatar: { width: 48, height: 48, borderRadius: '50%', backgroundColor: t.colors.canvasSofter, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: t.colors.ink } as const,
  driverInfo: { flex: 1 } as const,
  driverName: { color: t.colors.ink, fontSize: 15, fontWeight: 600, fontFamily: t.fontFamily.text } as const,
  driverRating: { color: t.colors.warning, fontSize: 12, fontFamily: t.fontFamily.text } as const,
  callBtn: { ...t.buttonPrimary, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', fontSize: 13 } as const,
}

const stages = [
  { key: 'confirmed', title: 'المرحلة الأولى', sub: 'تم تأكيد الطلب', date: '2024-12-01 10:30' },
  { key: 'delivering', title: 'في التوصيل', sub: 'السائق في الطريق إليك', date: '2024-12-01 11:00' },
  { key: 'delivered', title: 'تم التسليم', sub: 'تم توصيل الطلب بنجاح', date: 'قريباً' },
]

export default function TrackingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.back()}>←</button>
        <div>
          <div style={styles.headerTitle}>تتبع الطلب</div>
          {id && <div style={styles.orderId}>رقم الطلب: #{id.slice(0, 8)}</div>}
        </div>
        <div style={{ width: 22 }} />
      </div>

      <div style={styles.body}>
        <div style={styles.progressCard}>
          <div style={styles.stageRow}>
            {stages.map((stage, i) => {
              const isDone = i === 0
              const isCurrent = i === 1
              const isPending = i === 2
              return (
                <div key={stage.key} style={styles.stageItem}>
                  <div style={styles.stageLine}>
                    <div style={{
                      ...styles.stageDot,
                      backgroundColor: (isDone || isCurrent) ? t.colors.primary : t.colors.surfacePressed,
                      color: (isDone || isCurrent) ? t.colors.onPrimary : t.colors.mute
                    }}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    {i < stages.length - 1 && (
                      <div style={{
                        ...styles.stageConnector,
                        backgroundColor: isDone ? t.colors.primary : t.colors.surfacePressed
                      }} />
                    )}
                  </div>
                  <div style={styles.stageContent}>
                    <div style={{ ...styles.stageTitle, color: (isDone || isCurrent) ? t.colors.ink : t.colors.mute }}>
                      {stage.title}
                    </div>
                    <div style={styles.stageDate}>{stage.sub} • {stage.date}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={styles.mapPlaceholder}>
          <span>📍 موقع التوصيل المباشر</span>
        </div>

        <div style={styles.driverCard}>
          <div style={styles.driverAvatar}>👤</div>
          <div style={styles.driverInfo}>
            <div style={styles.driverName}>أحمد علي</div>
            <div style={styles.driverRating}>⭐ 4.9 (120 تقييم)</div>
          </div>
          <button style={styles.callBtn} onClick={() => window.open('tel:+213512345678')}>📞 اتصال</button>
        </div>
      </div>
    </div>
  )
}
