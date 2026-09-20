import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function POST(request: Request) {
  const { supabase, user } = await requireUser()
  const form = await request.formData()
  const gameId = String(form.get('game_id') ?? '')
  const score = Number(form.get('score') ?? 0)

  if (!gameId || !Number.isFinite(score)) {
    return NextResponse.json({ error: 'Missing game or score' }, { status: 400 })
  }

  const { error } = await supabase.from('scores').insert({
    user_id: user.id,
    game_id: gameId,
    score
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const { data: profile } = await supabase.from('profiles').select('score, coins').eq('id', user.id).single()
  const nextScore = (profile?.score ?? 0) + score
  const nextCoins = (profile?.coins ?? 0) + Math.max(1, Math.floor(score / 10))

  await supabase.from('profiles').update({ score: nextScore, coins: nextCoins }).eq('id', user.id)

  return NextResponse.json({ ok: true, score, totalScore: nextScore, coins: nextCoins })
}
