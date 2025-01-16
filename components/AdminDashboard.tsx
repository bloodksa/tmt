'use client'

import { useState } from 'react'
import { User, Bot, Role } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Search, Download, Send } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface AdminDashboardProps {
  users: (User & { bots: Bot[] })[]
  totalUsers: number
  totalBots: number
}

export default function AdminDashboard({ users: initialUsers, totalUsers, totalBots }: AdminDashboardProps) {
  const [users, setUsers] = useState(initialUsers)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [bulkMessage, setBulkMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('فشل حذف المستخدم')
        }

        setUsers(users.filter(user => user.id !== userId))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChangeRole = async (userId: string, newRole: Role) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error('فشل تغيير دور المستخدم')
      }

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportUserData = () => {
    const csvContent = [
      ['الاسم', 'البريد الإلكتروني', 'الدور', 'عدد الروبوتات'],
      ...users.map(user => [
        user.name || '',
        user.email,
        user.role,
        user.bots.length.toString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'user_data.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const sendBulkMessage = async () => {
    setIsSending(true)
    try {
      const response = await fetch('/api/admin/send-bulk-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: bulkMessage }),
      })

      if (!response.ok) {
        throw new Error('فشل إرسال الرسالة الجماعية')
      }

      alert('تم إرسال الرسالة الجماعية بنجاح')
      setBulkMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الرسالة الجماعية')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">لوحة تحكم المشرف</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">إجمالي المستخدمين</h2>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">إجمالي الروبوتات</h2>
          <p className="text-3xl font-bold">{totalBots}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">متوسط الروبوتات لكل مستخدم</h2>
          <p className="text-3xl font-bold">{(totalBots / totalUsers).toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <Link href="/admin/bot-stats">
          <Button>عرض إحصائيات الروبوتات</Button>
        </Link>
        <div className="space-x-2">
          <Button onClick={exportUserData}>
            <Download className="mr-2 h-4 w-4" />
            تصدير بيانات المستخدمين
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                إرسال رسالة جماعية
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إرسال رسالة جماعية</DialogTitle>
                <DialogDescription>
                  أرسل رسالة إلى جميع المستخدمين المسجلين.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={bulkMessage}
                onChange={(e) => setBulkMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="min-h-[100px]"
              />
              <DialogFooter>
                <Button onClick={sendBulkMessage} disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    'إرسال'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-4">
        <Label htmlFor="search">بحث عن المستخدمين</Label>
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            type="text"
            placeholder="ابحث بالاسم أو البريد الإلكتروني"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-8">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{user.name || user.email}</h2>
              <div className="flex space-x-2">
                <Select
                  value={user.role}
                  onValueChange={(value: Role) => handleChangeRole(user.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="اختر الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">مستخدم</SelectItem>
                    <SelectItem value="ADMIN">مشرف</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  حذف
                </Button>
              </div>
            </div>
            <p>البريد الإلكتروني: {user.email}</p>
            <p>الدور: {user.role === 'ADMIN' ? 'مشرف' : 'مستخدم'}</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">الروبوتات:</h3>
            {user.bots.length === 0 ? (
              <p>لا يوجد روبوتات لهذا المستخدم.</p>
            ) : (
              <ul className="list-disc list-inside">
                {user.bots.map(bot => (
                  <li key={bot.id}>{bot.name}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

