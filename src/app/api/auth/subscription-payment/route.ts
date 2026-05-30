import { NextRequest } from 'next/server'
import { ChargilyClient } from '@chargily/chargily-pay'

const SUBSCRIPTION_PRICES: Record<string, number> = {
  فلاح: 30000,
  ورشةبناء: 60000,
  وكالةنقل: 100000,
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return Response.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    if (user.accountType === 'livreur') {
      return Response.json({ checkoutUrl: null, skip: true, message: 'الموزعون لا يحتاجون اشتراك' })
    }

    const cat = user.category || 'فلاح'
    const amount = SUBSCRIPTION_PRICES[cat] || 30000

    const apiSecretKey = process.env.CHARGILY_SECRET_KEY
    if (!apiSecretKey) {
      return Response.json({ checkoutUrl: null, skip: true })
    }

    const client = new ChargilyClient({
      api_key: apiSecretKey,
      mode: 'test',
    })

    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000'

    const checkoutData = {
      amount,
      currency: 'dzd' as const,
      success_url: `${serverUrl}/login`,
      failure_url: `${serverUrl}/login`,
      metadata: [{ userId: user.id, category: cat, planName: `اشتراك ${cat}` }],
    }

    const newCheckout = await client.createCheckout(checkoutData)

    if (!newCheckout || !newCheckout.checkout_url) {
      return Response.json({ checkoutUrl: null, skip: true })
    }

    return Response.json({ checkoutUrl: newCheckout.checkout_url, amount, category: cat })
  } catch (error) {
    return Response.json({ checkoutUrl: null, skip: true })
  }
}
