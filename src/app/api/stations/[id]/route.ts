import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const station = await prisma.station.findUnique({ where: { id } })
    if (!station) {
      return Response.json({ error: 'المحطة غير موجودة' }, { status: 404 })
    }
    return Response.json({ station })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
