import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const bot = await prisma.bot.findUnique({
    where: { id: params.id },
    include: { user: true, usageStats: true },
  })

  if (!bot || bot.user.email !== session.user.email) {
    return NextResponse.json({ error: 'الروبوت غير موجود' }, { status: 404 })
  }

  const stats = bot.usageStats.map(stat => ({
    date: stat.date.toISOString().split('T')[0],
    messages: stat.messages,
    uniqueUsers: stat.uniqueUsers,
  }))

  return NextResponse.json(stats)
}

