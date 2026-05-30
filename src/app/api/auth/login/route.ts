import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession, setSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { phone, email, password } = await request.json()
    const credential = email || phone
    if (!credential || !password) {
      return Response.json({ error: 'البريد الإلكتروني أو رقم الهاتف وكلمة المرور مطلوبان' }, { status: 400 })
    }
    const user = email
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.user.findUnique({ where: { phone } })
    if (!user || user.password !== password) {
      return Response.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 })
    }
    if (!user.isVerified) {
      return Response.json({ error: 'يرجى تأكيد بريدك الإلكتروني أولاً' }, { status: 403 })
    }
    const token = await createSession(user.id)
    await setSessionCookie(token)
    const { password: _, ...safeUser } = user
    return Response.json({ user: safeUser, message: 'تم تسجيل الدخول بنجاح' })
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء تسجيل الدخول' }, { status: 500 })
  }
}
