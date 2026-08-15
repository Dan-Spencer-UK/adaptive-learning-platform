# supabase/seed-content

Generated SQL only -- every `.sql` file here is compiled deterministically
from a structured manifest under `scripts/content/data` by
`scripts/content/generate-seed.ts`. Do not hand-edit; edit the manifest
and run `npm run content:generate` instead (`npm run content:check`
verifies the committed output is still up to date).

These files are real governed proving-slice content (CC-04 onward), kept
separate from `supabase/seed.sql`'s synthetic CC-02 structural fixtures.
Both load automatically during `supabase db reset` via `supabase/config.toml`'s
`[db.seed] sql_paths`.
