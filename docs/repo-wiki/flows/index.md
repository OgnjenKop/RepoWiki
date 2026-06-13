# Flows

## What This Shows

Flow docs explain how code moves through the repository: module imports, route entry points, and the files that shape behavior.

## Project Shape

- Modules detected: 11
- Routes detected: 0
- Test files detected: 31
- Import edges detected: 402

## Key Module Flows

- `ai (src/ai)` -> `knowledge (src/knowledge)` (13 imports)
- `ai (src/ai)` -> `types (src/types)` (3 imports)
- `ai (src/ai)` -> `utils (src/utils)` (7 imports)
- `cli (src/cli.ts)` -> `commands (src/commands)` (4 imports)
- `commands (src/commands)` -> `ai (src/ai)` (6 imports)
- `commands (src/commands)` -> `docs (src/docs)` (3 imports)
- `commands (src/commands)` -> `scanner (src/scanner)` (4 imports)
- `commands (src/commands)` -> `storage (src/storage)` (4 imports)
- `commands (src/commands)` -> `types (src/types)`
- `diagrams (src/diagrams)` -> `types (src/types)`
- `diagrams (src/diagrams)` -> `utils (src/utils)`
- `docs (src/docs)` -> `diagrams (src/diagrams)` (2 imports)
- `docs (src/docs)` -> `knowledge (src/knowledge)` (32 imports)
- `docs (src/docs)` -> `types (src/types)` (12 imports)
- `docs (src/docs)` -> `utils (src/utils)` (64 imports)
- `graph (src/graph)` -> `types (src/types)`
- `knowledge (src/knowledge)` -> `types (src/types)` (10 imports)
- `knowledge (src/knowledge)` -> `utils (src/utils)` (10 imports)
- `scanner (src/scanner)` -> `graph (src/graph)`
- `scanner (src/scanner)` -> `knowledge (src/knowledge)` (2 imports)
- `scanner (src/scanner)` -> `types (src/types)` (8 imports)
- `scanner (src/scanner)` -> `utils (src/utils)` (11 imports)
- `storage (src/storage)` -> `ai (src/ai)`
- `storage (src/storage)` -> `knowledge (src/knowledge)` (2 imports)
- `storage (src/storage)` -> `types (src/types)`
- `storage (src/storage)` -> `utils (src/utils)` (2 imports)
- `utils (src/utils)` -> `knowledge (src/knowledge)` (2 imports)
- `utils (src/utils)` -> `types (src/types)` (4 imports)

## Module Areas

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` - 2 modules
- `Core application logic: graph (src/graph) + scanner (src/scanner)` - 2 modules
- `Core application logic: storage (src/storage)` - 1 module
- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` - 4 modules
- `Shared support: types (src/types) + utils (src/utils)` - 2 modules

## Area Docs

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) - 2 modules
- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) - 2 modules
- [Core application logic: storage (src/storage)](../areas/analysis-src-storage.md) - 1 module
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - 4 modules
- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) - 2 modules

## Area Summaries

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…
- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…
- [Core application logic: storage (src/storage)](../areas/analysis-src-storage.md) - Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage. Modules: storage (src/storage). Root paths: src/storage.…
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…
- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…

## Area Flows

- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (108 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Shared support: types (src/types) + utils (src/utils)` (20 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (9 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: graph (src/graph) + scanner (src/scanner)` (4 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: storage (src/storage)` (4 imports)
- `Core application logic: storage (src/storage)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)
- `Core application logic: storage (src/storage)` -> `Shared support: types (src/types) + utils (src/utils)` (3 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)

## Test Coverage Map

- `types (src/types)` - 13 tests (`test/aiBuildSummaries.test.ts:2` covers, `test/areaFlows.test.ts:2` covers, `test/buildGraph.test.ts:2` covers)
- `scanner (src/scanner)` - 11 tests (`test/detectEnvVars.test.ts:2` covers, `test/detectModules.test.ts:2` covers, `test/detectPathAliases.test.ts:5` covers)
- `ai (src/ai)` - 7 tests (`test/aiBuildSummaries.test.ts:2` covers, `test/aiPrompt.test.ts:2` covers, `test/aiSummaryFormat.test.ts:2` covers)
- `knowledge (src/knowledge)` - 5 tests (`test/areaFlows.test.ts:2` covers, `test/fileImportance.test.ts:2` covers, `test/knowledge.test.ts:5` covers)
- `utils (src/utils)` - 4 tests (`test/cli.e2e.test.ts:8` covers, `test/packageManager.test.ts:2` covers, `test/sourceText.test.ts:2` covers)
- `cli (src/cli.ts)` - 3 tests (`test/cli.e2e.test.ts:8` covers, `test/detectTests.test.ts:2` covers, `test/generateDocs.test.ts:2` covers)
- `docs (src/docs)` - 3 tests (`test/agentsMd.test.ts:2` covers, `test/detectTests.test.ts:2` covers, `test/generateDocs.test.ts:2` covers)
- `commands (src/commands)` - 2 tests (`test/checkCommand.test.ts:5` covers, `test/update.test.ts:2` covers)
- `storage (src/storage)` - 2 tests (`test/metadataArtifacts.test.ts:5` covers, `test/metadataStore.test.ts:5` covers)
- `diagrams (src/diagrams)` - 1 test (`test/diagrams.test.ts:2` covers)
- `graph (src/graph)` - 1 test (`test/buildGraph.test.ts:2` covers)

## Route Entry Points

_No routes detected._

## Verification

- Run the project build: package.json - Use the build script to catch type and bundling issues. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script to verify repository-wide changes. Command: npm run test. (evidence: package.json)
- Review representative tests: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2 - These tests show the expected behavior at the repo level. (evidence: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2)

## Module Flow Docs

- [ai (src/ai)](modules/src-ai.md) - 6 files
- [cli (src/cli.ts)](modules/src-cli.md) - 1 file
- [commands (src/commands)](modules/src-commands.md) - 4 files
- [diagrams (src/diagrams)](modules/src-diagrams.md) - 1 file
- [docs (src/docs)](modules/src-docs.md) - 12 files
- [graph (src/graph)](modules/src-graph.md) - 1 file
- [knowledge (src/knowledge)](modules/src-knowledge.md) - 10 files
- [scanner (src/scanner)](modules/src-scanner.md) - 9 files
- [storage (src/storage)](modules/src-storage.md) - 1 file
- [types (src/types)](modules/src-types.md) - 1 file
- [utils (src/utils)](modules/src-utils.md) - 14 files

## How To Use

- Read this page first when you need the execution path, not just the high-level architecture.
- Open the module flow doc for the area you plan to change.
- Use the architecture page for broader structure and diagrams.
