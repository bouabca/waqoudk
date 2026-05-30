import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return Response.json({ error: 'الطلب غير موجود' }, { status: 404 })
    }
    return Response.json({
      payment: {
        itemPrice: order.itemPrice,
        deliveryFee: order.deliveryFee,
        discount: order.discount,
        totalPrice: order.totalPrice,
        methods: [
          { id: 'cod', name: 'الدفع عند الاستلام', icon: 'cash' },
          { id: 'card', name: 'بطاقة ائتمان', icon: 'card' },
          { id: 'cib', name: 'تحويل بنكي CIB', icon: 'bank' },
        ],
        currency: 'د.ج',
      },
    })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
