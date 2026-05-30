import { destroySession } from '@/lib/auth'

export async function POST() {
  try {
    await destroySession()
    return Response.json({ message: 'تم تسجيل الخروج بنجاح' })
  } catch {
    return Response.json({ error: 'حدث خطأ أثناء تسجيل الخروج' }, { status: 500 })
  }
}
