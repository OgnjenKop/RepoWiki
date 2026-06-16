# Documentation Quality Bar

RepoWiki aims to produce Qoder-style repository documentation: practical, agent-ready docs that help a coding agent understand where to read, where to edit, and how to verify changes.

## Quality Target

Generated docs should give a new agent enough context to make a safe first change without manually rediscovering the whole repository.

For RepoWiki, that means the wiki should clearly expose:

- Project shape: Node/TypeScript, package manager npm, 115 scanned files, and 11 detected modules.
- Main areas: Operations and entry points: cli (src/cli.ts) + commands (src/commands); Core application logic: graph (src/graph) + scanner (src/scanner); Core application logic: storage (src/storage); Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more; Shared support: types (src/types) + utils (src/utils).
- Entry points, central files, and high-signal modules.
- Runtime consumers and test consumers as separate concepts.
- Common change paths with concrete files and evidence.
- Verification commands tied to real scripts or tests.

## Qoder-Style Checklist

- The top-level overview explains the repository shape without becoming a wall of repeated detail.
- Architecture docs group modules into useful functional areas, not arbitrary folders.
- Module docs identify entry files, imports, exports, consumers, tests, and likely edit points.
- Flow docs explain how modules depend on each other and where changes propagate.
- Change paths start with concrete files and include why those files matter.
- Verification hints point to real commands and representative tests.
- Agent context is concise enough to read first, but specific enough to guide implementation.
- Model-review prompts ask for findings, evidence, and concrete generator improvements.

## Model Review Loop

Use model-backed review to raise documentation quality beyond deterministic heuristics:

- `repowiki synthesize` - generate the full wiki with required API-backed AI synthesis.
- `repowiki review` - generate a Codex or ChatGPT review prompt for subscription-backed model review.
- `repowiki --ai generate` - add API-backed summaries to the deterministic baseline generator.
- `repowiki update` - refresh docs after applying generator improvements.
- `repowiki check` - verify generated docs are fresh.

## Failure Signals

Treat these as bugs in RepoWiki output:

- One generic module represents most of a multi-root app.
- Generated/build/cache artifacts appear as important files.
- Area names describe RepoWiki internals instead of the target repository.
- Change paths point to unrelated files or generic categories.
- Runtime consumers and tests are mixed together.
- Verification hints are generic or do not map to real scripts/tests.
- Summaries claim behavior not supported by file, import, route, or test evidence.

## Expected Review Output

When using `docs/repo-wiki/codex-review.md` with Codex or ChatGPT, ask for:

- Findings first, ordered by severity.
- The generated doc path where the issue appears.
- Source files or metadata proving the issue.
- Whether the issue is deterministic-generator quality or model-summary quality.
- Concrete changes to make in RepoWiki.
