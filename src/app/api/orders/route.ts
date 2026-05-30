import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { id: true, name: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json({ orders })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return Response.json({ error: 'غير مصرح به' }, { status: 401 })
    }
    const { quantity, address, lat, lng, itemPrice, deliveryFee, discount, category, driverId } = await request.json()
    if (!quantity || quantity <= 0) {
      return Response.json({ error: 'الكمية مطلوبة' }, { status: 400 })
    }
    const price = itemPrice || 0
    const fee = deliveryFee || 0
    const disc = discount || 0
    const totalPrice = price + fee - disc
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    let driverData = {}
    if (driverId) {
      const driver = await prisma.user.findUnique({ where: { id: driverId } })
      if (driver) {
        driverData = {
          driverId: driver.id,
          driverName: driver.name,
          driverPhone: driver.phone,
          driverRating: driver.rating,
          driverAvatar: driver.avatar,
        }
        // Mark driver as unavailable while on delivery
        await prisma.user.update({
          where: { id: driver.id },
          data: { isAvailable: false },
        })
      }
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        quantity,
        address,
        lat,
        lng,
        itemPrice: price,
        deliveryFee: fee,
        discount: disc,
        totalPrice,
        category,
        userId: user.id,
        status: driverId ? 'pending' : 'pending',
        ...driverData,
      },
      include: { user: { select: { id: true, name: true, phone: true } }, driver: { select: { id: true, name: true, phone: true } } },
    })
    return Response.json({ order, message: 'تم إنشاء الطلب بنجاح' }, { status: 201 })
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء إنشاء الطلب' }, { status: 500 })
  }
}
