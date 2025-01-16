import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { PrismaClient } from '@prisma/client'
import { getCachedData, invalidateCache } from '@/lib/cache'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const bots = await getCachedData(
    `user_bots_${session.user.email}`,
    async () => {
      const user = await prisma.user.findUnique({
        where: { email: session.user!.email! },
        include: { bots: true },
      })
      return user?.bots || []
    },
    300 // 5 minutes cache
  )

  return NextResponse.json(bots)
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const { name, description } = await request.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
  }

  const newBot = await prisma.bot.create({
    data: {
      name,
      description,
      userId: user.id,
    },
  })

  await invalidateCache(`user_bots_${session.user.email}`)

  return NextResponse.json(newBot, { status: 201 })
}

