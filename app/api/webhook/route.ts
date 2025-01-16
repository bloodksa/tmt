import { NextResponse } from 'next/server'
import { handleTelegramUpdate } from '@/lib/telegram'

export async function POST(request: Request) {
  const update = await request.json()
  await handleTelegramUpdate(update)
  return NextResponse.json({ success: true })
}

