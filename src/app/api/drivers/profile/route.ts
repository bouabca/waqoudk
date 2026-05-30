import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.accountType !== 'livreur') {
      return Response.json({ error: 'غير مصرح به' }, { status: 401 })
    }

    const { name, lat, lng } = await request.json()
    const data: Record<string, any> = {}
    if (name !== undefined) data.name = name
    if (lat !== undefined) data.lat = lat
    if (lng !== undefined) data.lng = lng

    if (Object.keys(data).length === 0) {
      return Response.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { id: true, name: true, phone: true, lat: true, lng: true, rating: true },
    })

    return Response.json({ user: updated, message: 'تم تحديث الملف الشخصي' })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
