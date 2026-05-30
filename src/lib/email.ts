import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOtpEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"وقودك" <${process.env.SMTP_USER}>`,
    to,
    subject: 'رمز التحقق - وقودك',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #2D7D3B; font-size: 24px;">🌿 وقودك</h1>
        </div>
        <h2 style="color: #1A1A1A; font-size: 18px;">مرحباً بك في وقودك!</h2>
        <p style="color: #666666; font-size: 14px; line-height: 1.6;">
          شكراً لتسجيلك. استخدم رمز التحقق التالي لتأكيد حسابك:
        </p>
        <div style="text-align: center; margin: 24px 0; padding: 20px; background-color: #F5F5F5; border-radius: 12px; direction: ltr;">
          <div style="font-size: 36px; font-weight: bold; color: #2D7D3B; letter-spacing: 8px;">${otp}</div>
        </div>
        <p style="color: #999999; font-size: 12px;">
          هذا الرمز صالح لمدة 10 دقائق. إذا لم تقم بالتسجيل في وقودك، يرجى تجاهل هذا البريد.
        </p>
        <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 24px 0;" />
        <p style="color: #999999; font-size: 11px; text-align: center;">
          © ${new Date().getFullYear()} وقودك - جميع الحقوق محفوظة
        </p>
      </div>
    `,
  })
}
