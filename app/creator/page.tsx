import { requireUser } from '@/lib/auth'

export default async function CreatorPage() {
  await requireUser()

  return (
    <main className="shell">
      <h1>Create a game</h1>
      <form className="card" action="/api/games" method="post">
        <label>
          Title
          <input name="title" required />
        </label>

        <label>
          Description
          <textarea name="description" required />
        </label>

        <label>
          Category
          <select name="category">
            <option>Biology</option>
            <option>Geography</option>
            <option>Science</option>
            <option>Math</option>
            <option>History</option>
          </select>
        </label>

        <label>
          Game code
          <textarea name="code" required placeholder="Paste the game code here" />
        </label>

        <button className="button">Submit for review</button>
      </form>
    </main>
  )
}
