'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Bot {
  id: string
  name: string
  description: string
  welcomeMessage: string
}

interface BotUsageStats {
  date: string
  messages: number
  uniqueUsers: number
}

export default function ManageBot() {
  const [bot, setBot] = useState<Bot | null>(null)
  const [usageStats, setUsageStats] = useState<BotUsageStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newWelcomeMessage, setNewWelcomeMessage] = useState('')
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    const fetchBotData = async () => {
      try {
        const botResponse = await fetch(`/api/bots/${id}`)
        const statsResponse = await fetch(`/api/bots/${id}/stats`)
        
        if (!botResponse.ok || !statsResponse.ok) {
          throw new Error('فشل جلب بيانات الروبوت')
        }
        
        const botData = await botResponse.json()
        const statsData = await statsResponse.json()
        
        setBot(botData)
        setNewName(botData.name)
        setNewDescription(botData.description)
        setNewWelcomeMessage(botData.welcomeMessage)
        setUsageStats(statsData)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ')
        setIsLoading(false)
      }
    }

    fetchBotData()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/bots/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, description: newDescription, welcomeMessage: newWelcomeMessage }),
      })

      if (!response.ok) {
        throw new Error('فشل تحديث الروبوت')
      }

      const updatedBot = await response.json()
      setBot(updatedBot)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الروبوت؟')) {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/bots/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('فشل حذف الروبوت')
        }

        router.push('/')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ')
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center mt-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 mt-4">خطأ: {error}</div>
  }

  if (!bot) return <div>الروبوت غير موجود</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">إدارة الروبوت: {bot.name}</h1>
      <form onSubmit={handleUpdate} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="botName">اسم الروبوت</Label>
          <Input
            id="botName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="botDescription">وصف الروبوت</Label>
          <Textarea
            id="botDescription"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="welcomeMessage">رسالة الترحيب</Label>
          <Textarea
            id="welcomeMessage"
            value={newWelcomeMessage}
            onChange={(e) => setNewWelcomeMessage(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري التحديث...</> : 'تحديث الروبوت'}
        </Button>
      </form>
      <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الحذف...</> : 'حذف الروبوت'}
      </Button>

      <h2 className="text-2xl font-bold mt-8 mb-4">إحصائيات استخدام الروبوت</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={usageStats}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="messages" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="uniqueUsers" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

