# scripts/content

Content-production/development tooling. Development/content tooling only
-- never imported by the learner-runtime domain engines.

## Governed knowledge-graph content (CC-04 onward)

`data/` holds the controlled, human-authored source of truth for governed
knowledge-graph content manifests (domains, sources, curricula,
assertions, relationships, curriculum mappings, misconceptions), typed
against `@alp/content-schema`'s `knowledgeGraphManifestSchema`.

`generate-seed.ts` validates each manifest (structural shape and
cross-reference integrity -- every relationship, provenance link and
curriculum mapping must resolve to a defined entity) and deterministically
compiles it to SQL under `supabase/seed-content/`, using a UUIDv5-derived
primary key per row (`lib/deterministic-uuid.ts`) so the same manifest
always produces the same content and `ON CONFLICT (id) DO NOTHING` makes
re-running it safe.

```bash
npm run content:generate   # validate + (re)write supabase/seed-content/*.sql
npm run content:check      # regenerate and fail if the committed .sql is stale
npm run content:review     # (re)write the human-reviewable corpus inventory
```

The generated `.sql` files are committed to the repository (the same
pattern used for `packages/domain/src/database.types.ts`) and load
automatically via `supabase/config.toml`'s `[db.seed] sql_paths` on every
`supabase db reset` -- no manual Supabase Studio step. They are real
governed proving-slice content, kept in a separate path from
`supabase/seed.sql`'s synthetic CC-02 structural fixtures.

`generate-corpus-review.ts` compiles the same manifest into a
human-reviewable Markdown inventory under `evidence/` -- one entry per
assertion with its statement, version/status, direct prerequisites/
dependents, curriculum mapping(s), provenance and any misconception
links. Development/review evidence only, never rendered to learners.

Future content-production tooling (e.g. the CC-10 AI content pipeline
proof: candidate generation, independent verification) belongs here too
when its owning CC package is implemented.
