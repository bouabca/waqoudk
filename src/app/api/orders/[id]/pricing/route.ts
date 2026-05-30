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
      pricing: {
        quantity: order.quantity,
        unitPrice: order.quantity > 0 ? order.itemPrice / order.quantity : 0,
        itemPrice: order.itemPrice,
        deliveryFee: order.deliveryFee,
        discount: order.discount,
        totalPrice: order.totalPrice,
        currency: 'د.ج',
      },
    })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
