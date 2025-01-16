'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          منشئ روبوتات تيليجرام
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/about">
            <Button variant="ghost">حول</Button>
          </Link>
          {session?.user?.email === 'admin@example.com' && (
            <Link href="/admin/dashboard">
              <Button variant="outline">لوحة تحكم المشرف</Button>
            </Link>
          )}
          {session ? (
            <>
              <span className="text-white">مرحبًا {session.user?.name}</span>
              <Button onClick={() => signOut()}>تسجيل الخروج</Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>تسجيل الدخول</Button>
          )}
        </div>
      </div>
    </nav>
  )
}

