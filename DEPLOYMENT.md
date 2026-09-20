# Production setup

1. Create a Supabase project and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `PLATFORM_ADMIN_EMAIL` in the deployment environment.
2. Run `supabase/migrations/001_production.sql` in the Supabase SQL editor. This migration adds `games.category`, admin moderation policies, RLS, and the profile trigger.
3. Deploy the repository to Vercel using `npm run build`.
4. Configure Supabase Auth email settings and redirect URLs for the deployed domain.
5. Run `npm test` and `npm run build` before production release.

Uploaded creator `code` is stored for review but is never executed by the server. The built-in Three.js runtime is the only executable game runtime. This is intentional: executing arbitrary submitted JavaScript would be an account/server compromise risk. A future creator runtime must use a separately isolated worker/container with a strict capability model.
