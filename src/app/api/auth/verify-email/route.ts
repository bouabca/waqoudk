import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')
    if (!token) {
      return Response.json({ error: 'رمز التأكيد مطلوب' }, { status: 400 })
    }

    const verification = await prisma.emailVerification.findUnique({
      where: { token },
    })

    if (!verification) {
      return new Response(
        `<html dir="rtl"><body style="text-align:center;padding:48px;font-family:Arial"><h2 style="color:#D32F2F;">رمز التأكيد غير صالح</h2></body></html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    if (verification.expiresAt < new Date()) {
      await prisma.emailVerification.delete({ where: { id: verification.id } })
      return new Response(
        `<html dir="rtl"><body style="text-align:center;padding:48px;font-family:Arial"><h2 style="color:#D32F2F;">انتهت صلاحية رابط التأكيد</h2></body></html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    await prisma.user.update({
      where: { id: verification.userId },
      data: { isVerified: true },
    })

    await prisma.emailVerification.delete({ where: { id: verification.id } })

    return new Response(
      `<html dir="rtl"><body style="text-align:center;padding:48px;font-family:Arial">
        <h2 style="color:#2D7D3B;">✅ تم تأكيد بريدك الإلكتروني بنجاح!</h2>
        <p style="color:#666666;">يمكنك الآن تسجيل الدخول إلى وقودك</p>
        <a href="/login" style="display:inline-block;margin-top:16px;padding:12px 32px;background:#2D7D3B;color:#FFF;border-radius:8px;text-decoration:none;">تسجيل الدخول</a>
      </body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    )
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء تأكيد البريد' }, { status: 500 })
  }
}
