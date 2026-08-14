import { Container } from "@alp/ui";

const confirmedChecks = [
  "Next.js App Router boots and renders this page as a Server Component.",
  "Tailwind CSS v4 and project-owned design tokens are applied.",
  "The layout is responsive from narrow mobile widths upward.",
  "Workspace package resolution works end-to-end (this page imports @alp/ui).",
  "Semantic landmarks and visible keyboard focus are in place.",
] as const;

export default function Home() {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <Container>
          <div className="flex flex-col gap-1 py-6">
            <p className="text-sm font-medium text-muted">
              Adaptive Learning Platform
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Repository Foundation
            </h1>
          </div>
        </Container>
      </header>

      <main id="main-content" className="flex-1">
        <Container>
          <div className="flex flex-col gap-8 py-10">
            <section aria-labelledby="purpose-heading" className="flex flex-col gap-3">
              <h2 id="purpose-heading" className="text-lg font-semibold">
                What this page is
              </h2>
              <p className="max-w-prose text-base leading-7">
                This is the CC-01 development-environment foundation page. It
                exists to prove that the repository, npm workspace and
                application scaffold work end-to-end. It is not the learner
                product and not a final design.
              </p>
            </section>

            <section aria-labelledby="status-heading" className="flex flex-col gap-3">
              <h2 id="status-heading" className="text-lg font-semibold">
                Confirmed in this build
              </h2>
              <ul className="flex flex-col gap-2">
                {confirmedChecks.map((check) => (
                  <li
                    key={check}
                    className="rounded-md border border-border bg-surface px-4 py-3 text-sm leading-6"
                  >
                    {check}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </Container>
      </main>

      <footer className="border-t border-border">
        <Container>
          <p className="py-6 text-sm text-muted">
            Phase 1 — Architecture &amp; End-to-End Proving Slice · CC-01 —
            Repository Foundation
          </p>
        </Container>
      </footer>
    </>
  );
}
