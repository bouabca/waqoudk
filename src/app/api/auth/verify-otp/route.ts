import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession, setSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()
    if (!email || !otp) {
      return Response.json({ error: 'البريد الإلكتروني ورمز التحقق مطلوبان' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    if (user.isVerified) {
      return Response.json({ error: 'البريد الإلكتروني مؤكد بالفعل' }, { status: 400 })
    }

    const verification = await prisma.emailVerification.findFirst({
      where: { userId: user.id, token: otp },
    })

    if (!verification) {
      return Response.json({ error: 'رمز التحقق غير صحيح' }, { status: 401 })
    }

    if (verification.expiresAt < new Date()) {
      await prisma.emailVerification.delete({ where: { id: verification.id } })
      return Response.json({ error: 'انتهت صلاحية رمز التحقق' }, { status: 410 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    })

    await prisma.emailVerification.delete({ where: { id: verification.id } })

    const token = await createSession(user.id)
    await setSessionCookie(token)

    const { password: _, ...safeUser } = user
    return Response.json({ user: safeUser, message: 'تم تأكيد البريد الإلكتروني بنجاح' })
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء التحقق' }, { status: 500 })
  }
}
