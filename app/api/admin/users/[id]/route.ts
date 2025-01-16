import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

  const deletedUser = await prisma.user.delete({
    where: { id: params.id },
  })

  if (!deletedUser) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

  const { role } = await request.json()

  const updatedUser = await prisma.user.update({
    where: { id: params.id },
    data: { role },
  })

  if (!updatedUser) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
  }

  return NextResponse.json(updatedUser)
}

