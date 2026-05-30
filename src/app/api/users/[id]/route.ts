import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, phone: true, email: true, accountType: true, address: true, avatar: true, createdAt: true },
    })
    if (!user) {
      return Response.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    return Response.json({ user })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    const body = await request.json()
    const { name, phone, email, accountType, address, avatar } = body
    if (phone && phone !== existing.phone) {
      const phoneTaken = await prisma.user.findUnique({ where: { phone } })
      if (phoneTaken) {
        return Response.json({ error: 'رقم الهاتف مستخدم بالفعل' }, { status: 409 })
      }
    }
    const user = await prisma.user.update({
      where: { id },
      data: { name, phone, email, accountType, address, avatar },
      select: { id: true, name: true, phone: true, email: true, accountType: true, address: true, avatar: true, createdAt: true },
    })
    return Response.json({ user, message: 'تم تحديث المستخدم بنجاح' })
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء تحديث المستخدم' }, { status: 500 })
  }
}
