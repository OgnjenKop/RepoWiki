# RepoWiki — Repository Wiki

> A living map of this codebase: what it is, how it fits together, and where to start.

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Project** | **Files** | **Modules** | **Tests** |
| RepoWiki | 115 | 11 | 35 |
| Node/TypeScript | scanned | detected | files |
| **Routes** | **Env vars** | **Components** | **Tokens** |
| 0 | 12 | 0 | 0 |
| API endpoints | configured | no UI | design system |

## What This Project Is

RepoWiki is a Node/TypeScript repository. Detected modules: ai (src/ai), cli (src/cli.ts), commands (src/commands), diagrams (src/diagrams), docs (src/docs), graph (src/graph), knowledge (src/knowledge), scanner (src/scanner), storage (src/storage), types (src/types), utils (src/utils). Important config files: package.json, tsconfig.json, vitest.config.ts. Scripts: build, dev, pretest, test. CLI commands: check, generate, review, synthesize, update. CLI flags: --ai, --ai-api-key, --ai-base-url, --ai-model, --root, --verbose. Key module areas: Operations and entry points: cli (src/cli.ts) + commands (src/commands), Core application logic: graph (src/graph) + scanner (src/scanner), Core application logic: storage (src/storage), Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Shared support: types (src/types) + utils (src/utils). Key area flows: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more -> Shared support: types (src/types) + utils (src/utils), Core application logic: graph (src/graph) + scanner (src/scanner) -> Shared support: types (src/types) + utils (src/utils), Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: graph (src/graph) + scanner (src/scanner), Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: storage (src/storage). Important entry files: src/cli.ts:36, src/types/index.ts:198, src/docs/generateAgentsMd.ts:14, src/docs/writeDocs.ts:30, src/utils/markdown.ts:30, src/utils/moduleLabel.ts:3, src/scanner/detectDesignTokens.ts:18, src/scanner/scanRepo.ts:64. Key module flows: ai (src/ai) -> types (src/types), ai (src/ai) -> knowledge (src/knowledge), ai (src/ai) -> utils (src/utils), cli (src/cli.ts) -> commands (src/commands), commands (src/commands) -> scanner (src/scanner).

> **💡 New here?**
>
> Start with the [Setup](setup.md) page, then read [Architecture](architecture.md) to understand the system shape, then jump into the [module](modules/src-cli.md) you plan to change.



## On This Page

## On This Page

- [Navigation Map](#navigation-map)
- [The Five-Minute Tour](#the-five-minute-tour)
- [Repository Structure](#repository-structure)
- [Modules](#modules)
- [Areas (Functional Groups)](#areas-functional-groups)
- [Important Entry Files](#important-entry-files)
- [Common Change Paths](#common-change-paths)
- [How Areas Depend on Each Other](#how-areas-depend-on-each-other)
- [Test Coverage](#test-coverage)
- [Verification](#verification)
- [RepoWiki Commands](#repowiki-commands)

## Navigation Map

### [Setup](setup.md)

Install, build, test, and the first commands to run.
### [Architecture](architecture.md)

System shape, layered view, and how data flows through the codebase.
### [Agent Context](agent-context.md)

Concise reference for AI coding agents: entry points, change targets, and safety notes.
### [Design System](design.md)

No design system detected. This page documents UI components and design tokens if any are added.
### [Flow Overview](flows/index.md)

Execution paths, area-to-area flows, and where changes propagate.
### [Quality Bar](quality.md)

What good documentation looks like and how to review it.
### [Areas](areas/index.md)

Functional groupings of modules with their own summaries.
### [Module Docs](modules/src-cli.md)

One page per module with entry files, exports, and change guidance.

## The Five-Minute Tour

**1. What it is.** RepoWiki is a Node/TypeScript project. 3 runtime dependencies, 4 dev dependencies, 115 source files across 11 modules.

**2. The shape.** The codebase is organized into 11 modules including `ai`, `cli`, `commands`, `diagrams`, `docs`. See [Modules](#modules) for the full list and [Architecture](architecture.md) for the dependency view.

**3. How you use it.** Run `npm run dev` for the CLI, or invoke commands like `check`, `generate`, `review`. See [Setup](setup.md) for the full command reference.

**4. Where to start.** Open [Architecture](architecture.md) for the layered view, then jump to the [module](modules/src-cli.md) closest to the code you plan to change.

## Repository Structure

- `.gitignore`
- `CONTRIBUTING.md`
- `LICENSE`
- `README.md`
- `SECURITY.md`
- `package.json`
- `repowiki_agent_prompt.md`
- `src`
- `test`
- `tsconfig.json`
- `vitest.config.ts`

## Modules

- [ai (src/ai)](modules/src-ai.md) — 9 files
- [cli (src/cli.ts)](modules/src-cli.md) — 1 file
- [commands (src/commands)](modules/src-commands.md) — 5 files
- [diagrams (src/diagrams)](modules/src-diagrams.md) — 1 file
- [docs (src/docs)](modules/src-docs.md) — 15 files
- [graph (src/graph)](modules/src-graph.md) — 1 file
- [knowledge (src/knowledge)](modules/src-knowledge.md) — 10 files
- [scanner (src/scanner)](modules/src-scanner.md) — 12 files
- [storage (src/storage)](modules/src-storage.md) — 1 file
- [types (src/types)](modules/src-types.md) — 1 file
- [utils (src/utils)](modules/src-utils.md) — 15 files

## Areas (Functional Groups)

> **ℹ️ What is an area?**
>
> An area groups modules that work toward the same goal. Areas give you a higher-level view than individual modules: instead of "where is auth?", you ask "where is the security area?".

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](areas/orchestration-src-cli-src-commands.md) — 2 modules · 6 files
- [Core application logic: graph (src/graph) + scanner (src/scanner)](areas/analysis-src-graph-src-scanner.md) — 2 modules · 13 files
- [Core application logic: storage (src/storage)](areas/analysis-src-storage.md) — 1 module · 1 file
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — 4 modules · 35 files
- [Shared support: types (src/types) + utils (src/utils)](areas/support-src-types-src-utils.md) — 2 modules · 16 files

## Area Summaries

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](areas/orchestration-src-cli-src-commands.md) — Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…
- [Core application logic: graph (src/graph) + scanner (src/scanner)](areas/analysis-src-graph-src-scanner.md) — Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…
- [Core application logic: storage (src/storage)](areas/analysis-src-storage.md) — Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage. Modules: storage (src/storage). Root paths: src/storage.…
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…
- [Shared support: types (src/types) + utils (src/utils)](areas/support-src-types-src-utils.md) — Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…


## Important Entry Files

> **💡 What is an entry file?**
>
> An entry file is one that other files import from. Reading these first gives you the highest-leverage understanding of the codebase.

- `src/cli.ts:36` — Defines 7 symbols used inside this module.
- `src/types/index.ts:198` — Central implementation file with exported behavior.
- `src/docs/generateAgentsMd.ts:14` — Imported by 2 external files.
- `src/docs/writeDocs.ts:30` — Imported by 4 external files.
- `src/utils/markdown.ts:30` — Imported by 14 external files.
- `src/utils/moduleLabel.ts:3` — Imported by 12 external files.
- `src/scanner/detectDesignTokens.ts:18` — Imported by 1 external file.
- `src/scanner/scanRepo.ts:64` — Imported by 8 external files.

## Common Change Paths

> **ℹ️ What is a change path?**
>
> A change path is a common task ("change the API") mapped to the concrete files you'll likely need to touch. Start from these when you have a goal but not a starting point.

- `Change operations, scripts, or entry behavior` -> `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - Start in runnable entry points, scripts, and top-level orchestration. (evidence: `Operations and entry points: cli (src/cli.ts) + commands (src/commands)`, `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`)
- `Change core application behavior` -> `src/graph/buildGraph.ts`, `src/scanner/detectComponents.ts`, `src/scanner/detectDesignSystem.ts`, `src/scanner/detectDesignTokens.ts` - Start in the domain, service, state, routing, or data-flow modules. (evidence: `Core application logic: graph (src/graph) + scanner (src/scanner)`, `src/graph/buildGraph.ts`, `src/scanner/detectComponents.ts`, `src/scanner/detectDesignSystem.ts`)
- `Change UI, docs, or generated output` -> `src/docs/generateAgentsMd.ts`, `src/docs/writeDocs.ts`, `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts` - Start in user-facing presentation, docs, or output-generation modules. (evidence: `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more`, `src/docs/generateAgentsMd.ts`, `src/docs/writeDocs.ts`, `src/ai/buildInsights.ts`)
- `Change shared types, configuration, persistence, or helpers` -> `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/changePaths.ts` - Start in shared utility, configuration, storage, and type layers. (evidence: `Shared support: types (src/types) + utils (src/utils)`, `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`)

## How Areas Depend on Each Other

- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` → `Shared support: types (src/types) + utils (src/utils)` (121 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` → `Shared support: types (src/types) + utils (src/utils)` (25 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (17 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Core application logic: graph (src/graph) + scanner (src/scanner)` (5 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Core application logic: storage (src/storage)` (5 imports)

## Test Coverage

- `scanner (src/scanner)` - 14 tests (`test/detectComponents.test.ts:2` covers, `test/detectDesignSystem.test.ts:2` covers)
- `types (src/types)` - 14 tests (`test/aiBuildSummaries.test.ts:2` covers, `test/areaFlows.test.ts:2` covers)
- `ai (src/ai)` - 8 tests (`test/aiBuildSummaries.test.ts:2` covers, `test/aiPrompt.test.ts:2` covers)
- `knowledge (src/knowledge)` - 5 tests (`test/areaFlows.test.ts:2` covers, `test/fileImportance.test.ts:2` covers)
- `utils (src/utils)` - 4 tests (`test/cli.e2e.test.ts:8` covers, `test/packageManager.test.ts:2` covers)
- `cli (src/cli.ts)` - 3 tests (`test/cli.e2e.test.ts:8` covers, `test/detectTests.test.ts:2` covers)
- `docs (src/docs)` - 3 tests (`test/agentsMd.test.ts:2` covers, `test/detectTests.test.ts:2` covers)
- `commands (src/commands)` - 2 tests (`test/checkCommand.test.ts:5` covers, `test/update.test.ts:2` covers)
- `storage (src/storage)` - 2 tests (`test/metadataArtifacts.test.ts:5` covers, `test/metadataStore.test.ts:5` covers)
- `diagrams (src/diagrams)` - 1 test (`test/diagrams.test.ts:2` covers)
- `graph (src/graph)` - 1 test (`test/buildGraph.test.ts:2` covers)

## Verification

- Run the project build: package.json - Use the build script to catch type and bundling issues. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script to verify repository-wide changes. Command: npm run test. (evidence: package.json)
- Review representative tests: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2 - These tests show the expected behavior at the repo level. (evidence: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2)

## Runtime Consumers

_No runtime consumers detected._

## Test Consumers

- `test/generateDocs.test.ts` -> `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts` (9 imports into the repo)
- `test/knowledge.test.ts` -> `src/knowledge/areaOrdering.ts`, `src/knowledge/buildKnowledge.ts`, `src/knowledge/moduleFocus.ts`, `src/scanner/scanRepo.ts` (4 imports into the repo)
- `test/areaFlows.test.ts` -> `src/knowledge/areaFlows.ts`, `src/knowledge/moduleAreas.ts`, `src/types/index.ts` (3 imports into the repo)
- `test/detectTests.test.ts` -> `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts` (3 imports into the repo)
- `test/metadataArtifacts.test.ts` -> `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts` (3 imports into the repo)
- `test/aiBuildSummaries.test.ts` -> `src/ai/buildSummaries.ts`, `src/types/index.ts` (2 imports into the repo)
- `test/aiPrompt.test.ts` -> `src/ai/prompt.ts`, `src/ai/types.ts` (2 imports into the repo)
- `test/aiSummaryCache.test.ts` -> `src/ai/summaryCache.ts`, `src/ai/types.ts` (2 imports into the repo)

## RepoWiki Commands

> **ℹ️ About this section**
>
> These commands regenerate this wiki. Use them after changing the codebase, or to add AI-powered summaries.

- `repowiki --help` - Show CLI help.
- `repowiki check` - Verify whether the wiki is stale.
- `repowiki generate` - Generate the deterministic baseline wiki.
- `repowiki review` - Generate a Codex-ready model review prompt.
- `repowiki synthesize` - Generate the full wiki with required AI synthesis.
- `repowiki update` - Refresh stale docs and metadata.

## RepoWiki Flags

- `--ai` - enable AI-generated summaries
- `--ai-api-key` - AI API key
- `--ai-base-url` - OpenAI-compatible API base URL
- `--ai-model` - AI model name
- `--root` - repository root to scan
- `--verbose` - print verbose output

## Diagrams

- [Module dependency diagram](diagrams/modules.mmd)
- [Route entry points diagram](diagrams/routes.mmd)

## Suggested Reading Order

1. [Setup](setup.md) — get the project running
2. [Architecture](architecture.md) — understand the system shape
3. [Agent Context](agent-context.md) — what to read first as an agent
4. [Areas](areas/index.md) — high-level functional groups
5. [Module docs](modules/src-cli.md) — dive into specifics

- [ai (src/ai)](modules/src-ai.md)
- [cli (src/cli.ts)](modules/src-cli.md)
- [commands (src/commands)](modules/src-commands.md)
- [diagrams (src/diagrams)](modules/src-diagrams.md)
- [docs (src/docs)](modules/src-docs.md)
- [graph (src/graph)](modules/src-graph.md)
- [knowledge (src/knowledge)](modules/src-knowledge.md)
- [scanner (src/scanner)](modules/src-scanner.md)
- [storage (src/storage)](modules/src-storage.md)
- [types (src/types)](modules/src-types.md)
- [utils (src/utils)](modules/src-utils.md)
