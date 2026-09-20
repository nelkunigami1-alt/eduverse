import { requireUser } from '@/lib/auth'

export default async function GamePage() {
  const { supabase } = await requireUser()

  return (
    <main className="shell">
      <h1>Game runtime</h1>
      <p>Game pages are loaded after review and approval.</p>
      <div className="card">
        <p>This is the production game page entry point.</p>
      </div>
    </main>
  )
}
