# Flows

**Navigation:** [Wiki](../index.md) → Flows

## What This Shows

> **ℹ️ About flow docs**
>
> Flow docs explain how code moves through the repository: module imports, route entry points, and the files that shape behavior. Use this page to understand **execution paths** — what depends on what, and where changes propagate.

## Project Shape

| | | | |
| --- | --- | --- | --- |
| **Modules** | **Routes** | **Tests** | **Imports** |
| 11 | 0 | 35 | 470 |
| detected | API endpoints | files | edges |

## On This Page

## On This Page

- [Key Module Flows](#key-module-flows)
- [Module Areas](#module-areas)
- [Area Flows](#area-flows)
- [Test Coverage Map](#test-coverage-map)
- [Route Entry Points](#route-entry-points)
- [Verification](#verification)
- [Module Flow Docs](#module-flow-docs)

## Key Module Flows

> **💡 Reading the flows**
>
> An arrow from A to B means "A imports from B". The module at the head of the arrow is depended on; the module at the tail is the consumer. Modules with many incoming arrows are the most depended-on.

- `ai (src/ai)` → `knowledge (src/knowledge)` (13 imports)
- `ai (src/ai)` → `types (src/types)` (5 imports)
- `ai (src/ai)` → `utils (src/utils)` (9 imports)
- `cli (src/cli.ts)` → `commands (src/commands)` (5 imports)
- `commands (src/commands)` → `ai (src/ai)` (13 imports)
- `commands (src/commands)` → `docs (src/docs)` (4 imports)
- `commands (src/commands)` → `scanner (src/scanner)` (5 imports)
- `commands (src/commands)` → `storage (src/storage)` (5 imports)
- `commands (src/commands)` → `types (src/types)`
- `diagrams (src/diagrams)` → `types (src/types)`
- `diagrams (src/diagrams)` → `utils (src/utils)`
- `docs (src/docs)` → `ai (src/ai)` (6 imports)
- `docs (src/docs)` → `diagrams (src/diagrams)` (2 imports)
- `docs (src/docs)` → `knowledge (src/knowledge)` (33 imports)
- `docs (src/docs)` → `types (src/types)` (15 imports)
- `docs (src/docs)` → `utils (src/utils)` (70 imports)
- `graph (src/graph)` → `types (src/types)`
- `knowledge (src/knowledge)` → `types (src/types)` (10 imports)
- `knowledge (src/knowledge)` → `utils (src/utils)` (10 imports)
- `scanner (src/scanner)` → `graph (src/graph)`
- `scanner (src/scanner)` → `knowledge (src/knowledge)` (2 imports)
- `scanner (src/scanner)` → `types (src/types)` (11 imports)
- `scanner (src/scanner)` → `utils (src/utils)` (13 imports)
- `storage (src/storage)` → `ai (src/ai)`
- `storage (src/storage)` → `knowledge (src/knowledge)` (2 imports)
- `storage (src/storage)` → `types (src/types)`
- `storage (src/storage)` → `utils (src/utils)` (2 imports)
- `utils (src/utils)` → `ai (src/ai)`
- `utils (src/utils)` → `knowledge (src/knowledge)` (2 imports)
- `utils (src/utils)` → `types (src/types)` (4 imports)

## Module Areas

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) — 2 modules
- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) — 2 modules
- [Core application logic: storage (src/storage)](../areas/analysis-src-storage.md) — 1 module
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — 4 modules
- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) — 2 modules

## Area Summaries

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) — Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…
- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) — Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…
- [Core application logic: storage (src/storage)](../areas/analysis-src-storage.md) — Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage. Modules: storage (src/storage). Root paths: src/storage.…
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…
- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) — Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…


## Area Flows

- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` → `Shared support: types (src/types) + utils (src/utils)` (121 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` → `Shared support: types (src/types) + utils (src/utils)` (25 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (17 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Core application logic: graph (src/graph) + scanner (src/scanner)` (5 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Core application logic: storage (src/storage)` (5 imports)
- `Core application logic: storage (src/storage)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)
- `Core application logic: storage (src/storage)` → `Shared support: types (src/types) + utils (src/utils)` (3 imports)
- `Shared support: types (src/types) + utils (src/utils)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)

## Test Coverage Map

- `scanner (src/scanner)` — 14 tests (`test/detectComponents.test.ts:2` covers, `test/detectDesignSystem.test.ts:2` covers, `test/detectDesignTokens.test.ts:2` covers)
- `types (src/types)` — 14 tests (`test/aiBuildSummaries.test.ts:2` covers, `test/areaFlows.test.ts:2` covers, `test/buildGraph.test.ts:2` covers)
- `ai (src/ai)` — 8 tests (`test/aiBuildSummaries.test.ts:2` covers, `test/aiPrompt.test.ts:2` covers, `test/aiSummaryCache.test.ts:5` covers)
- `knowledge (src/knowledge)` — 5 tests (`test/areaFlows.test.ts:2` covers, `test/fileImportance.test.ts:2` covers, `test/knowledge.test.ts:5` covers)
- `utils (src/utils)` — 4 tests (`test/cli.e2e.test.ts:8` covers, `test/packageManager.test.ts:2` covers, `test/sourceText.test.ts:2` covers)
- `cli (src/cli.ts)` — 3 tests (`test/cli.e2e.test.ts:8` covers, `test/detectTests.test.ts:2` covers, `test/generateDocs.test.ts:2` covers)
- `docs (src/docs)` — 3 tests (`test/agentsMd.test.ts:2` covers, `test/detectTests.test.ts:2` covers, `test/generateDocs.test.ts:2` covers)
- `commands (src/commands)` — 2 tests (`test/checkCommand.test.ts:5` covers, `test/update.test.ts:2` covers)
- `storage (src/storage)` — 2 tests (`test/metadataArtifacts.test.ts:5` covers, `test/metadataStore.test.ts:5` covers)
- `diagrams (src/diagrams)` — 1 test (`test/diagrams.test.ts:2` covers)
- `graph (src/graph)` — 1 test (`test/buildGraph.test.ts:2` covers)

## Route Entry Points

_No routes detected._

## Verification

- Run the project build: package.json - Use the build script to catch type and bundling issues. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script to verify repository-wide changes. Command: npm run test. (evidence: package.json)
- Review representative tests: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2 - These tests show the expected behavior at the repo level. (evidence: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2)

## Module Flow Docs

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

## How To Use

- Read this page first when you need the execution path, not just the high-level architecture.
- Open the module flow doc for the area you plan to change.
- Use the architecture page for broader structure and diagrams.
