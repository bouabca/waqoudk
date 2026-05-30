import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scryptSync, randomBytes } from 'crypto'

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, phone: true, email: true, accountType: true, address: true, avatar: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json({ users })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, password, email, accountType, address, avatar } = await request.json()
    if (!name || !phone || !password) {
      return Response.json({ error: 'الاسم ورقم الهاتف وكلمة المرور مطلوبون' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { phone } })
    if (existing) {
      return Response.json({ error: 'رقم الهاتف مستخدم بالفعل' }, { status: 409 })
    }
    const user = await prisma.user.create({
      data: { name, phone, password: hashPassword(password), email, accountType, address, avatar },
      select: { id: true, name: true, phone: true, email: true, accountType: true, address: true, avatar: true, createdAt: true },
    })
    return Response.json({ user, message: 'تم إنشاء المستخدم بنجاح' }, { status: 201 })
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء إنشاء المستخدم' }, { status: 500 })
  }
}
