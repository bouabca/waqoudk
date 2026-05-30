import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return Response.json({ error: 'غير مصرح به' }, { status: 401 })
    }

    const { id } = await params
    const { rating, review } = await request.json()

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order || order.userId !== user.id) {
      return Response.json({ error: 'الطلب غير موجود' }, { status: 404 })
    }
    if (order.status !== 'completed') {
      return Response.json({ error: 'لا يمكن تقييم طلب غير مكتمل' }, { status: 400 })
    }
    if (order.isRated) {
      return Response.json({ error: 'تم تقييم هذا الطلب بالفعل' }, { status: 400 })
    }
    if (!rating || rating < 1 || rating > 5) {
      return Response.json({ error: 'التقييم يجب أن يكون بين 1 و 5' }, { status: 400 })
    }

    await prisma.order.update({
      where: { id },
      data: { isRated: true, rating, review: review || null },
    })

    if (order.driverId) {
      const driverOrders = await prisma.order.findMany({
        where: { driverId: order.driverId, isRated: true, rating: { not: null } },
        select: { rating: true },
      })
      const avgRating = driverOrders.reduce((sum, o) => sum + (o.rating || 0), 0) / driverOrders.length

      await prisma.user.update({
        where: { id: order.driverId },
        data: { rating: Math.round(avgRating * 10) / 10 },
      })
    }

    return Response.json({ message: 'تم إرسال التقييم بنجاح' })
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء إرسال التقييم' }, { status: 500 })
  }
}
