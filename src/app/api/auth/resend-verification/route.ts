import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOtpEmail } from '@/lib/email'

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return Response.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }
    if (user.isVerified) {
      return Response.json({ message: 'البريد الإلكتروني مؤكد بالفعل' })
    }

    await prisma.emailVerification.deleteMany({ where: { userId: user.id } })

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.emailVerification.create({
      data: { userId: user.id, token: otp, expiresAt },
    })

    await sendOtpEmail(email, otp)

    return Response.json({ message: 'تم إعادة إرسال رمز التحقق' })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
