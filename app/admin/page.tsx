import { requireAdmin } from '@/lib/auth'

export default async function AdminPage() {
  const { supabase } = await requireAdmin()

  const { data: games } = await supabase
    .from('games')
    .select('id, title, description, status, creator_id, profiles(username)')
    .in('status', ['pending', 'published'])
    .order('created_at', { ascending: false })

  return (
    <main className="shell">
      <h1>Admin review</h1>
      <div className="grid">
        {games?.map((game) => (
          <article key={game.id} className="card">
            <h2>{game.title}</h2>
            <p>{game.description}</p>
            <p>Owner: {game.profiles?.username ?? 'Unknown'}</p>
            <p>Status: {game.status}</p>

            <form action={`/api/admin/games/${game.id}`} method="post">
              <button className="button" name="status" value="published">Publish</button>
              <button className="button danger" name="status" value="rejected">Reject</button>
            </form>
          </article>
        ))}
      </div>
    </main>
  )
}
