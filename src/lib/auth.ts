import { cookies } from 'next/headers'
import { prisma } from './prisma'
import crypto from 'crypto'

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: { userId, token, expiresAt },
  })

  return token
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } })
    }
    return null
  }

  return session
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  if (token) {
    await prisma.session.deleteMany({ where: { token } })
  }
  cookieStore.delete('session_token')
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}
