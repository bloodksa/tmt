'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Bot {
  id: string
  name: string
  description: string
}

export default function BotList() {
  const [bots, setBots] = useState<Bot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/bots')
      .then(res => {
        if (!res.ok) {
          throw new Error('فشل جلب الروبوتات')
        }
        return res.json()
      })
      .then(data => {
        setBots(data)
        setIsLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center mt-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 mt-4">خطأ: {error}</div>
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">الروبوتات الخاصة بك</h2>
      {bots.length === 0 ? (
        <p>لم تقم بإنشاء أي روبوتات بعد.</p>
      ) : (
        <ul className="space-y-4">
          {bots.map(bot => (
            <li key={bot.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{bot.name}</h3>
                  <p className="text-gray-600">{bot.description}</p>
                </div>
                <Link href={`/manage/${bot.id}`}>
                  <Button variant="outline">إدارة</Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

