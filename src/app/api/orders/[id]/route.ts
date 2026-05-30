import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, phone: true } } },
    })
    if (!order) {
      return Response.json({ error: 'الطلب غير موجود' }, { status: 404 })
    }
    return Response.json({ order })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
