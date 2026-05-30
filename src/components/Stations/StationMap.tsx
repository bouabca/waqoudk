'use client'

import { theme } from '@/lib/theme'

interface StationMapProps {
  stationName: string
  address: string
  lat?: number
  lng?: number
}

export default function StationMap({ stationName, address, lat, lng }: StationMapProps) {
  if (lat && lng) {
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.02}%2C${lng + 0.02}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lng}`
    return (
      <div style={{ width: '100%', height: 200, borderRadius: theme.rounded.md, overflow: 'hidden', border: `1px solid ${theme.colors.surfacePressed}` }}>
        <iframe
          src={src}
          style={{ width: '100%', height: '100%', border: 'none' }}
          loading="lazy"
          title={stationName}
        />
      </div>
    )
  }

  return (
    <div style={{
      width: '100%', height: 200, backgroundColor: theme.colors.surfacePressed,
      borderRadius: theme.rounded.md, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>📍</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: theme.colors.ink, marginBottom: 4 }}>{stationName}</div>
      <div style={{ fontSize: 12, color: theme.colors.body, textAlign: 'center', padding: '0 16px' }}>{address}</div>
      <div style={{ fontSize: 11, color: theme.colors.mute, marginTop: 8 }}>خريطة الموقع</div>
    </div>
  )
}
