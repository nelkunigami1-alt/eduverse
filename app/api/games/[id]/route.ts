import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireUser()
  const { id } = await params

  const { data: game } = await supabase
    .from('games')
    .select('id, title, description, code, status')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }

  return NextResponse.json({ game })
}
