import { requireUser } from '@/lib/auth'

export default async function Leaderboard() {
  const { supabase } = await requireUser()
  const { data: scores } = await supabase.from('scores').select('score,created_at,profiles(username),games(title)').order('score', { ascending: false }).limit(100)
  return <main className="shell"><h1>Leaderboard</h1><div className="card"><ol>{scores?.map((entry, i) => <li key={`${entry.created_at}-${i}`}><strong>{entry.profiles?.username ?? 'Player'}</strong> — {entry.score} points ({entry.games?.title ?? 'Game'})</li>)}</ol></div></main>
}
