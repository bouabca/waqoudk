import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

const statusStages: Record<string, { label: string; stage: number }[]> = {
  pending: [
    { label: 'تم الاستلام', stage: 1 },
    { label: 'قيد المعالجة', stage: 2 },
  ],
  confirmed: [
    { label: 'تم الاستلام', stage: 1 },
    { label: 'تم التأكيد', stage: 2 },
    { label: 'قيد التحضير', stage: 3 },
  ],
  preparing: [
    { label: 'تم الاستلام', stage: 1 },
    { label: 'تم التأكيد', stage: 2 },
    { label: 'قيد التحضير', stage: 3 },
    { label: 'في الطريق', stage: 4 },
  ],
  delivering: [
    { label: 'تم الاستلام', stage: 1 },
    { label: 'تم التأكيد', stage: 2 },
    { label: 'قيد التحضير', stage: 3 },
    { label: 'في الطريق', stage: 4 },
    { label: 'جارٍ التوصيل', stage: 5 },
  ],
  delivered: [
    { label: 'تم الاستلام', stage: 1 },
    { label: 'تم التأكيد', stage: 2 },
    { label: 'قيد التحضير', stage: 3 },
    { label: 'في الطريق', stage: 4 },
    { label: 'جارٍ التوصيل', stage: 5 },
    { label: 'تم التوصيل', stage: 6 },
  ],
  cancelled: [
    { label: 'تم الاستلام', stage: 1 },
    { label: 'تم الإلغاء', stage: 2 },
  ],
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return Response.json({ error: 'الطلب غير موجود' }, { status: 404 })
    }
    const stages = statusStages[order.status] || statusStages.pending
    return Response.json({
      tracking: {
        status: order.status,
        currentStage: stages.length,
        totalStages: stages.length,
        stages: stages.map((s, i) => ({
          label: s.label,
          completed: i < stages.length,
          date: i === 0 ? order.createdAt.toISOString() : null,
        })),
        driverName: order.driverName,
        driverPhone: order.driverPhone,
        driverRating: order.driverRating,
        driverAvatar: order.driverAvatar,
      },
    })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
