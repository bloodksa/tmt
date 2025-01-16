import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (adminUser?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }

  const { message } = await request.json()

  // هنا يمكنك إضافة المنطق لإرسال الرسالة إلى جميع المستخدمين
  // على سبيل المثال، يمكنك استخدام خدمة بريد إلكتروني أو إشعارات في التطبيق

  // هذا مجرد مثال بسيط لتسجيل الرسالة
  console.log('تم إرسال رسالة جماعية:', message)

  return NextResponse.json({ success: true })
}

