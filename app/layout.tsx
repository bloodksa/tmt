import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth/next"
import SessionProvider from "@/components/SessionProvider"
import Navbar from "@/components/Navbar"
import { LoadingBar } from "@/components/LoadingBar"

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <LoadingBar />
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}

