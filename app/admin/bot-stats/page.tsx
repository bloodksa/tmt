import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import BotStatistics from '@/components/BotStatistics'

const prisma = new PrismaClient()

export default async function BotStatsPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/api/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
  })

  if (user?.role !== 'ADMIN') {
    redirect('/')
  }

  const botStats = await prisma.bot.groupBy({
    by: ['name'],
    _count: {
      _all: true,
    },
  })

  const totalBots = await prisma.bot.count()

  return <BotStatistics botStats={botStats} totalBots={totalBots} />
}

