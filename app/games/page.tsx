import { requireUser } from '@/lib/auth'

export default async function GameByIdPage() {
  const { supabase } = await requireUser()
  return <main className="shell"><h1>Approved game</h1><p>Game runtime will be rendered here.</p></main>
}
