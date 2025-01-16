'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export default function CreateBot() {
  const [botName, setBotName] = useState('')
  const [botDescription, setBotDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: botName, description: botDescription }),
      })

      if (!response.ok) {
        throw new Error('فشل إنشاء الروبوت')
      }

      setSuccess(true)
      setTimeout(() => router.push('/'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">إنشاء روبوت جديد</h1>
      {success && (
        <Alert className="mb-4">
          <AlertTitle>تم بنجاح!</AlertTitle>
          <AlertDescription>تم إنشاء الروبوت الخاص بك. جاري إعادة التوجيه إلى الصفحة الرئيسية...</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="botName">اسم الروبوت</Label>
          <Input
            id="botName"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="botDescription">وصف الروبوت</Label>
          <Textarea
            id="botDescription"
            value={botDescription}
            onChange={(e) => setBotDescription(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الإنشاء...</> : 'إنشاء الروبوت'}
        </Button>
      </form>
    </div>
  )
}

