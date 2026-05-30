import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return Response.json({ error: 'غير مصرح به' }, { status: 401 })
    }
    const { password: _, ...safeUser } = user
    return Response.json({ user: safeUser })
  } catch {
    return Response.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}
