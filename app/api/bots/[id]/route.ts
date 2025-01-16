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
    include: { user: true },
  })

  if (!bot || bot.user.email !== session.user.email) {
    return NextResponse.json({ error: 'الروبوت غير موجود' }, { status: 404 })
  }

  return NextResponse.json(bot)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const { name, description, welcomeMessage } = await request.json()

  const updatedBot = await prisma.bot.updateMany({
    where: { 
      id: params.id,
      user: { email: session.user.email }
    },
    data: { name, description, welcomeMessage },
  })

  if (updatedBot.count === 0) {
    return NextResponse.json({ error: 'الروبوت غير موجود أو غير مصرح' }, { status: 404 })
  }

  const bot = await prisma.bot.findUnique({
    where: { id: params.id },
  })

  return NextResponse.json(bot)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const deletedBot = await prisma.bot.deleteMany({
    where: { 
      id: params.id,
      user: { email: session.user.email }
    },
  })

  if (deletedBot.count === 0) {
    return NextResponse.json({ error: 'الروبوت غير موجود أو غير مصرح' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

