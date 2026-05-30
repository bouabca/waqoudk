import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()
    if (!phone) {
      return Response.json({ error: 'رقم الهاتف مطلوب' }, { status: 400 })
    }
    console.log(`[OTP] تم إرسال رمز التحقق إلى ${phone} - الرمز هو 123456 (للاختبار)`)
    return Response.json({
      message: 'تم إرسال رمز التحقق بنجاح',
      note: 'للاختبار، رمز التحقق هو 123456',
    })
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء إرسال رمز التحقق' }, { status: 500 })
  }
}
