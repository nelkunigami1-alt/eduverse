import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function POST(request: Request) {
  const { supabase, user } = await requireUser()
  const form = await request.formData()

  const title = String(form.get('title') ?? '').trim()
  const description = String(form.get('description') ?? '').trim()
  const category = String(form.get('category') ?? 'Biology').trim()
  const code = String(form.get('code') ?? '').trim()

  if (!title || !description || !code) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error } = await supabase.from('games').insert({
    creator_id: user.id,
    title,
    description,
    category,
    code,
    status: 'pending'
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
