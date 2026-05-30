import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.accountType !== 'livreur') {
      return Response.json({ error: 'غير مصرح به' }, { status: 401 })
    }

    const { id } = await params
    const { status: newStatus } = await request.json()

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order || order.driverId !== user.id) {
      return Response.json({ error: 'الطلب غير موجود أو غير مصرح به' }, { status: 404 })
    }

    const validTransitions: Record<string, string[]> = {
      pending: ['approved', 'cancelled'],
      approved: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
    }

    if (!validTransitions[order.status]?.includes(newStatus)) {
      return Response.json({ error: 'حالة غير صالحة' }, { status: 400 })
    }

    const updateData: any = { status: newStatus }
    if (newStatus === 'completed') {
      updateData.completedAt = new Date()
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { user: { select: { id: true, name: true, phone: true } } },
    })

    // If cancelled or completed, make driver available again
    if (newStatus === 'completed' || newStatus === 'cancelled') {
      await prisma.user.update({
        where: { id: user.id },
        data: { isAvailable: true },
      })
    }

    return Response.json({ order: updated, message: 'تم تحديث حالة الطلب' })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
