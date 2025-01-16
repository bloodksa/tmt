import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import AdminDashboard from '@/components/AdminDashboard'

const prisma = new PrismaClient()

export default async function AdminDashboardPage() {
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

  const users = await prisma.user.findMany({
    include: { bots: true },
  })

  const totalUsers = await prisma.user.count()
  const totalBots = await prisma.bot.count()

  return <AdminDashboard users={users} totalUsers={totalUsers} totalBots={totalBots} />
}

