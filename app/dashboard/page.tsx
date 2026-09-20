import { requireUser } from '@/lib/auth'
import Link from 'next/link'

export default async function DashboardPage() {
  const { supabase, user } = await requireUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, role, score, coins')
    .eq('id', user.id)
    .single()

  const { data: games } = await supabase
    .from('games')
    .select('id, title, description, status')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <main className="shell">
      <nav>
        <Link href="/dashboard">EduVerse</Link>
        <Link href="/creator">Creator</Link>
        <Link href="/admin">Admin</Link>
      </nav>

      <section className="card hero-card">
        <p className="eyebrow">PLAYER DASHBOARD</p>
        <h1>Welcome, {profile?.username ?? user.email}</h1>
        <p>Role: {profile?.role}</p>
        <p>Score: {profile?.score ?? 0}</p>
        <p>Coins: {profile?.coins ?? 0}</p>
      </section>

      <section>
        <h2>Published games</h2>
        <div className="grid">
          {games?.map((game) => (
            <article key={game.id} className="card">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <Link className="button" href={`/games/${game.id}`}>Play</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
