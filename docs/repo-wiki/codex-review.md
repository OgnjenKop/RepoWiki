# Codex RepoWiki Review Prompt

Use this prompt with Codex or ChatGPT when you want subscription-backed review without an API key.

## Prompt

You are reviewing the RepoWiki output for this repository. Do not call an external model API. Work from the generated wiki, metadata, context packs, and source files in this checkout.

Read these files first:

- `docs/repo-wiki/index.md`
- `docs/repo-wiki/architecture.md`
- `docs/repo-wiki/agent-context.md`
- `docs/repo-wiki/areas/index.md`
- `docs/repo-wiki/flows/index.md`
- `.repowiki/context/project.json`
- `.repowiki/graph.json`
- `.repowiki/knowledge.json`
- `.repowiki/summaries.json`

Then sample the generated area and module pages:

- Area: `docs/repo-wiki/areas/orchestration-src-cli-src-commands.md` (Operations and entry points: cli (src/cli.ts) + commands (src/commands))
- Area: `docs/repo-wiki/areas/analysis-src-graph-src-scanner.md` (Core application logic: graph (src/graph) + scanner (src/scanner))
- Area: `docs/repo-wiki/areas/analysis-src-storage.md` (Core application logic: storage (src/storage))
- Area: `docs/repo-wiki/areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md` (Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more)
- Module: `docs/repo-wiki/modules/src-ai.md` (ai (src/ai))
- Module: `docs/repo-wiki/modules/src-cli.md` (cli (src/cli.ts))
- Module: `docs/repo-wiki/modules/src-commands.md` (commands (src/commands))
- Module: `docs/repo-wiki/modules/src-diagrams.md` (diagrams (src/diagrams))
- Module: `docs/repo-wiki/modules/src-docs.md` (docs (src/docs))
- Module: `docs/repo-wiki/modules/src-graph.md` (graph (src/graph))
- Module: `docs/repo-wiki/modules/src-knowledge.md` (knowledge (src/knowledge))
- Module: `docs/repo-wiki/modules/src-scanner.md` (scanner (src/scanner))
- Flow: `docs/repo-wiki/flows/modules/src-ai.md` (ai (src/ai))
- Flow: `docs/repo-wiki/flows/modules/src-cli.md` (cli (src/cli.ts))
- Flow: `docs/repo-wiki/flows/modules/src-commands.md` (commands (src/commands))
- Flow: `docs/repo-wiki/flows/modules/src-diagrams.md` (diagrams (src/diagrams))

Assess the wiki against these criteria:

- Does the top-level overview explain the repo shape without repeating details already rendered below?
- Are module areas coherent and useful for deciding where to start?
- Are runtime consumers separated from test consumers correctly?
- Are important entry files actually good starting points?
- Are common change paths specific enough to guide an edit?
- Are verification hints actionable and tied to real scripts/tests?
- Are AI context packs grounded in the same evidence as the docs?
- Are any summaries misleading, too generic, or unsupported by code evidence?

Return:

- Findings first, ordered by severity.
- For each finding, include the generated doc path and the source files or context packs that prove it.
- Separate deterministic-generator issues from issues that only affect AI summary quality.
- End with concrete changes to make in RepoWiki, not generic advice.

## Local Commands

- `repowiki generate`
- `repowiki update`
- `repowiki check`
- `repowiki review`
