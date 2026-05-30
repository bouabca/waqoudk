import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadBase64Image } from '@/lib/cloudinary'
import { sendOtpEmail } from '@/lib/email'

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, password, accountType, address, category, driverPermit, lat, lng } = await request.json()

    if (!name || !phone || !email || !password) {
      return Response.json({ error: 'الاسم ورقم الهاتف والبريد الإلكتروني وكلمة المرور مطلوبون' }, { status: 400 })
    }

    const phoneExists = await prisma.user.findUnique({ where: { phone } })
    if (phoneExists) {
      return Response.json({ error: 'رقم الهاتف مستخدم بالفعل' }, { status: 409 })
    }

    const emailExists = await prisma.user.findUnique({ where: { email } })
    if (emailExists) {
      return Response.json({ error: 'البريد الإلكتروني مستخدم بالفعل' }, { status: 409 })
    }

    if (accountType === 'livreur' && !driverPermit) {
      return Response.json({ error: 'رخصة القيادة مطلوبة للموزعين' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password,
        accountType: accountType || 'user',
        address,
        category: accountType === 'user' ? category : null,
        driverPermit: null,
        lat: accountType === 'livreur' ? (lat || 35.1948) : null,
        lng: accountType === 'livreur' ? (lng || 0.6401) : null,
        isVerified: false,
      },
    })

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.emailVerification.create({
      data: { userId: user.id, token: otp, expiresAt },
    })

    await sendOtpEmail(email, otp)

    if (accountType === 'livreur' && driverPermit) {
      uploadBase64Image(driverPermit)
        .then((url) =>
          prisma.user.update({ where: { id: user.id }, data: { driverPermit: url } })
        )
        .catch((err) => {
          console.error('[Register] Permit upload failed:', err)
        })
    }

    const { password: _, ...safeUser } = user
    return Response.json({
      user: safeUser,
      message: 'تم إنشاء الحساب بنجاح. سيتم رفع رخصة القيادة في الخلفية.',
    }, { status: 201 })
  } catch (error) {
    console.error('[Register]', error)
    return Response.json({ error: 'حدث خطأ أثناء إنشاء الحساب' }, { status: 500 })
  }
}
