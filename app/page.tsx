import { getServerSession } from "next-auth/next"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import BotList from '@/components/BotList'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Home() {
  const session = await getServerSession()

  if (!session) {
    redirect('/api/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: { bots: true }
  })

  const totalBots = user?.bots.length || 0

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">مرحبًا بك في منشئ روبوتات تيليجرام</h1>
      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-lg">لديك حاليًا {totalBots} من الروبوتات</p>
      </div>
      <p className="mb-4">قم بإنشاء وإدارة روبوتات تيليجرام المدعومة بالذكاء الاصطناعي بسهولة.</p>
      <Link href="/create">
        <Button>إنشاء روبوت جديد</Button>
      </Link>
      <BotList />
    </div>
  )
}

