'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { theme } from '@/lib/theme'
import StationMap from '@/components/Stations/StationMap'

const styles = {
  container: { ...theme.container, backgroundColor: theme.colors.canvasSoft } as React.CSSProperties,
  header: { backgroundColor: theme.colors.canvas, padding: '16px', display: 'flex', alignItems: 'center', borderBottom: `1px solid ${theme.colors.surfacePressed}` } as React.CSSProperties,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: theme.colors.ink, cursor: 'pointer', padding: 0 } as React.CSSProperties,
  body: { padding: 16 } as React.CSSProperties,
  logoCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 24, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 12, marginBottom: 12, boxShadow: theme.shadow.level3 } as React.CSSProperties,
  logoPlaceholder: { width: 80, height: 80, borderRadius: '50%', backgroundColor: theme.colors.canvasSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: theme.colors.ink } as React.CSSProperties,
  stationName: { fontSize: 17, fontWeight: 700, color: theme.colors.ink, textAlign: 'center' as const } as React.CSSProperties,
  infoCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: 16, marginBottom: 12, boxShadow: theme.shadow.level3 } as React.CSSProperties,
  infoRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 14, color: theme.colors.body } as React.CSSProperties,
  infoIcon: { fontSize: 18, width: 24, textAlign: 'center' as const } as React.CSSProperties,
  infoLabel: { color: theme.colors.body, fontSize: 13 } as React.CSSProperties,
  infoValue: { color: theme.colors.ink, fontWeight: 500 } as React.CSSProperties,
  priceBox: { backgroundColor: theme.colors.canvasSoft, borderRadius: theme.rounded.xl, padding: 16, textAlign: 'center' as const, marginBottom: 12 } as React.CSSProperties,
  priceLabel: { color: theme.colors.body, fontSize: 13 } as React.CSSProperties,
  priceValue: { color: theme.colors.ink, fontSize: 22, fontWeight: 700 } as React.CSSProperties,
  ctaButton: { ...theme.buttonPrimary, width: '100%', padding: '14px', fontSize: 15, fontWeight: 600 } as React.CSSProperties,
}

interface Station {
  id: string
  name: string
  location: string
  hours: string
  currentPrice: number
  phone: string
  lat: number
  lng: number
}

export default function StationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [station, setStation] = useState<Station | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/stations/${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setStation(data?.station || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.push('/stations')}>←</button>
      </div>

      <div style={styles.body}>
        <div style={styles.logoCard}>
          <div style={styles.logoPlaceholder}>⛽</div>
          <div style={styles.stationName}>{station?.name || 'محطة نفط سيدي بلعباس'}</div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.infoRow}>
            <span style={styles.infoIcon}>🕐</span>
            <span style={styles.infoLabel}>ساعات العمل</span>
            <span style={{ ...styles.infoValue, marginRight: 'auto' }}>{station?.hours || '24/24'}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoIcon}>📍</span>
            <span style={styles.infoLabel}>الموقع</span>
            <span style={{ ...styles.infoValue, marginRight: 'auto' }}>{station?.location || 'سيدي بلعباس'}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoIcon}>📞</span>
            <span style={styles.infoLabel}>الهاتف</span>
            <span style={{ ...styles.infoValue, marginRight: 'auto', direction: 'ltr' as const }}>{station?.phone || '+049 123 45 67'}</span>
          </div>
        </div>

        {station && <StationMap stationName={station.name} address={station.location} lat={station.lat} lng={station.lng} />}

        <div style={styles.priceBox}>
          <div style={styles.priceLabel}>سعر المحروقات</div>
          <div style={styles.priceValue}>{station?.currentPrice?.toLocaleString() || '31'} / دج</div>
        </div>

        <button style={styles.ctaButton} onClick={() => router.push('/orders')}>تحديد هذه المحطة</button>
      </div>
    </div>
  )
}
