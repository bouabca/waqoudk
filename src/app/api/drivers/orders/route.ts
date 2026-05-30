import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.accountType !== 'livreur') {
      return Response.json({ error: 'غير مصرح به' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { driverId: user.id },
      include: { user: { select: { id: true, name: true, phone: true, address: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json({ orders })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
