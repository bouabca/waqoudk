'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const styles = {
  container: { ...theme.container, backgroundColor: theme.colors.canvasSoft } as React.CSSProperties,
  header: { backgroundColor: theme.colors.canvas, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.colors.surfacePressed}` } as React.CSSProperties,
  backButton: { background: 'none', border: 'none', fontSize: 22, color: theme.colors.ink, cursor: 'pointer', padding: 0 } as React.CSSProperties,
  headerTitle: { fontSize: 17, fontWeight: 700, color: theme.colors.ink } as React.CSSProperties,
  spacer: { width: 22 } as React.CSSProperties,
  list: { padding: '12px 16px', display: 'flex', flexDirection: 'column' as const, gap: 10 } as React.CSSProperties,
  stationCard: { backgroundColor: theme.colors.canvas, borderRadius: theme.rounded.xl, padding: '14px 16px', cursor: 'pointer', boxShadow: theme.shadow.level3 } as React.CSSProperties,
  stationTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } as React.CSSProperties,
  stationName: { color: theme.colors.ink, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties,
  stationHours: { fontSize: 11, color: theme.colors.ink, fontWeight: 500 } as React.CSSProperties,
  stationMeta: { display: 'flex', gap: 16, fontSize: 12, color: theme.colors.body } as React.CSSProperties,
  stationMetaItem: { display: 'flex', alignItems: 'center', gap: 4 } as React.CSSProperties,
  stationPrice: { fontSize: 13, fontWeight: 700, color: theme.colors.ink, marginTop: 6 } as React.CSSProperties,
  empty: { textAlign: 'center' as const, color: theme.colors.body, fontSize: 14, padding: 48 } as React.CSSProperties,
}

interface Station {
  id: string
  name: string
  location: string
  hours: string
  currentPrice: number
  phone: string
}

export default function StationsPage() {
  const router = useRouter()
  const [stations, setStations] = useState<Station[]>([])

  useEffect(() => {
    fetch('/api/stations')
      .then((res) => res.ok ? res.json() : { stations: [] })
      .then((data) => setStations(data.stations || []))
      .catch(() => {})
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => router.push('/home')}>←</button>
        <span style={styles.headerTitle}>المحطات</span>
        <div style={styles.spacer} />
      </div>

      <div style={styles.list}>
        {stations.length === 0 && <div style={styles.empty}>لا توجد محطات متاحة</div>}
        {stations.map((station) => (
          <div key={station.id} style={styles.stationCard} onClick={() => router.push(`/stations/${station.id}`)}>
            <div style={styles.stationTop}>
              <div style={styles.stationName}>
                <span>⛽</span>
                {station.name}
              </div>
              <span style={styles.stationHours}>{station.hours || '24/24'}</span>
            </div>
            <div style={styles.stationMeta}>
              <span style={styles.stationMetaItem}>📍 {station.location}</span>
              <span style={styles.stationMetaItem}>📞 {station.phone}</span>
            </div>
            <div style={styles.stationPrice}>السعر: {station.currentPrice?.toLocaleString() || '31'} / دج</div>
          </div>
        ))}
      </div>
    </div>
  )
}
