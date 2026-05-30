import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const drivers = await prisma.user.findMany({
      where: { accountType: 'livreur' },
      select: {
        id: true,
        name: true,
        phone: true,
        rating: true,
        lat: true,
        lng: true,
        avatar: true,
        isAvailable: true,
      },
    })

    const mapped = drivers.map((d) => ({
      ...d,
      distance: d.lat != null && d.lng != null ? 0 : null,
    }))

    return Response.json({ drivers: mapped })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}
