import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stations = await prisma.station.findMany({ orderBy: { name: 'asc' } })
    return Response.json({ stations })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
