import { requireUser } from '@/lib/auth'
import GameClient from './game-client'

export default async function Game({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireUser()
  const { id } = await params
  const { data: game } = await supabase.from('games').select('id,title,description,category,status').eq('id', id).eq('status', 'published').single()
  if (!game) return <main className="shell"><h1>Game unavailable</h1></main>
  return <main className="shell"><GameClient game={game} /></main>
}
