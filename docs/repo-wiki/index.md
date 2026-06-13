# Repo Wiki

## Project Overview

- Project: RepoWiki
- Detected stack: Node/TypeScript
- Package manager: npm
- Files scanned: 102
- Modules detected: 11

## Summary

RepoWiki is a Node/TypeScript repository. Detected modules: ai (src/ai), cli (src/cli.ts), commands (src/commands), diagrams (src/diagrams), docs (src/docs), graph (src/graph), knowledge (src/knowledge), scanner (src/scanner), storage (src/storage), types (src/types), utils (src/utils). Important config files: package.json, tsconfig.json, vitest.config.ts. Scripts: build, dev, pretest, test. CLI commands: check, generate, review, synthesize, update. CLI flags: --ai, --ai-api-key, --ai-base-url, --ai-model, --root, --verbose. Key module areas: Operations and entry points: cli (src/cli.ts) + commands (src/commands), Core application logic: graph (src/graph) + scanner (src/scanner), Core application logic: storage (src/storage), Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Shared support: types (src/types) + utils (src/utils). Key area flows: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more -> Shared support: types (src/types) + utils (src/utils), Core application logic: graph (src/graph) + scanner (src/scanner) -> Shared support: types (src/types) + utils (src/utils), Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: graph (src/graph) + scanner (src/scanner), Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: storage (src/storage). Important entry files: src/cli.ts:36, src/types/index.ts:162, src/utils/markdown.ts:6, src/utils/moduleLabel.ts:3, src/docs/generateAgentsMd.ts:13, src/docs/writeDocs.ts:28, src/knowledge/areaOrdering.ts:24, src/knowledge/moduleFocus.ts:18. Key module flows: ai (src/ai) -> knowledge (src/knowledge), ai (src/ai) -> types (src/types), ai (src/ai) -> utils (src/utils), cli (src/cli.ts) -> commands (src/commands), commands (src/commands) -> scanner (src/scanner).

## Detected Stack

Detected from package metadata, config files, and repository structure.

## Main Scripts

- `build`: `tsc`
- `dev`: `tsx src/cli.ts`
- `pretest`: `npm run build`
- `test`: `vitest run`

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

- [ai (src/ai)](modules/src-ai.md) - 6 files
- [cli (src/cli.ts)](modules/src-cli.md) - 1 file
- [commands (src/commands)](modules/src-commands.md) - 5 files
- [diagrams (src/diagrams)](modules/src-diagrams.md) - 1 file
- [docs (src/docs)](modules/src-docs.md) - 13 files
- [graph (src/graph)](modules/src-graph.md) - 1 file
- [knowledge (src/knowledge)](modules/src-knowledge.md) - 10 files
- [scanner (src/scanner)](modules/src-scanner.md) - 9 files
- [storage (src/storage)](modules/src-storage.md) - 1 file
- [types (src/types)](modules/src-types.md) - 1 file
- [utils (src/utils)](modules/src-utils.md) - 14 files

## Area Docs

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](areas/orchestration-src-cli-src-commands.md) - 2 modules
- [Core application logic: graph (src/graph) + scanner (src/scanner)](areas/analysis-src-graph-src-scanner.md) - 2 modules
- [Core application logic: storage (src/storage)](areas/analysis-src-storage.md) - 1 module
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - 4 modules
- [Shared support: types (src/types) + utils (src/utils)](areas/support-src-types-src-utils.md) - 2 modules

## Area Summaries

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](areas/orchestration-src-cli-src-commands.md) - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…
- [Core application logic: graph (src/graph) + scanner (src/scanner)](areas/analysis-src-graph-src-scanner.md) - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…
- [Core application logic: storage (src/storage)](areas/analysis-src-storage.md) - Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage. Modules: storage (src/storage). Root paths: src/storage.…
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…
- [Shared support: types (src/types) + utils (src/utils)](areas/support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…

## Module Areas

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` - 2 modules (`src/cli.ts`, `src/commands`)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` - 2 modules (`src/graph`, `src/scanner`)
- `Core application logic: storage (src/storage)` - 1 module (`src/storage`)
- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` - 4 modules (`src/ai`, `src/diagrams`, `src/docs`, `src/knowledge`)
- `Shared support: types (src/types) + utils (src/utils)` - 2 modules (`src/types`, `src/utils`)

## Important Entry Files

- `src/cli.ts:36` - Defines 7 symbols used inside this module.
- `src/types/index.ts:162` - Central implementation file with exported behavior.
- `src/utils/markdown.ts:6` - Imported by 12 external files.
- `src/utils/moduleLabel.ts:3` - Imported by 12 external files.
- `src/docs/generateAgentsMd.ts:13` - Imported by 2 external files.
- `src/docs/writeDocs.ts:28` - Imported by 4 external files.
- `src/knowledge/areaOrdering.ts:24` - Imported by 12 external files.
- `src/knowledge/moduleFocus.ts:18` - Imported by 12 external files.

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
- `test/buildGraph.test.ts` -> `src/graph/buildGraph.ts`, `src/types/index.ts` (2 imports into the repo)

## Common Change Paths

- `Change operations, scripts, or entry behavior` -> `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - Start in runnable entry points, scripts, and top-level orchestration. (evidence: `Operations and entry points: cli (src/cli.ts) + commands (src/commands)`, `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`)
- `Change core application behavior` -> `src/graph/buildGraph.ts`, `src/scanner/detectEnvVars.ts`, `src/scanner/detectModules.ts`, `src/scanner/detectPathAliases.ts` - Start in the domain, service, state, routing, or data-flow modules. (evidence: `Core application logic: graph (src/graph) + scanner (src/scanner)`, `src/graph/buildGraph.ts`, `src/scanner/detectEnvVars.ts`, `src/scanner/detectModules.ts`)
- `Change UI, docs, or generated output` -> `src/docs/generateAgentsMd.ts`, `src/docs/writeDocs.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts` - Start in user-facing presentation, docs, or output-generation modules. (evidence: `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more`, `src/docs/generateAgentsMd.ts`, `src/docs/writeDocs.ts`, `src/ai/buildSummaries.ts`)
- `Change shared types, configuration, persistence, or helpers` -> `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/changePaths.ts` - Start in shared utility, configuration, storage, and type layers. (evidence: `Shared support: types (src/types) + utils (src/utils)`, `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`)

## Verification

- Run the project build: package.json - Use the build script to catch type and bundling issues. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script to verify repository-wide changes. Command: npm run test. (evidence: package.json)
- Review representative tests: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2 - These tests show the expected behavior at the repo level. (evidence: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2)

## Area Flows

- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (110 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Shared support: types (src/types) + utils (src/utils)` (20 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (12 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: graph (src/graph) + scanner (src/scanner)` (5 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: storage (src/storage)` (5 imports)

## Test Coverage Hotspots

- `types (src/types)` - 13 tests (`test/aiBuildSummaries.test.ts:2` covers, `test/areaFlows.test.ts:2` covers)
- `scanner (src/scanner)` - 11 tests (`test/detectEnvVars.test.ts:2` covers, `test/detectModules.test.ts:2` covers)
- `ai (src/ai)` - 7 tests (`test/aiBuildSummaries.test.ts:2` covers, `test/aiPrompt.test.ts:2` covers)
- `knowledge (src/knowledge)` - 5 tests (`test/areaFlows.test.ts:2` covers, `test/fileImportance.test.ts:2` covers)
- `utils (src/utils)` - 4 tests (`test/cli.e2e.test.ts:8` covers, `test/packageManager.test.ts:2` covers)
- `cli (src/cli.ts)` - 3 tests (`test/cli.e2e.test.ts:8` covers, `test/detectTests.test.ts:2` covers)
- `docs (src/docs)` - 3 tests (`test/agentsMd.test.ts:2` covers, `test/detectTests.test.ts:2` covers)
- `commands (src/commands)` - 2 tests (`test/checkCommand.test.ts:5` covers, `test/update.test.ts:2` covers)
- `storage (src/storage)` - 2 tests (`test/metadataArtifacts.test.ts:5` covers, `test/metadataStore.test.ts:5` covers)
- `diagrams (src/diagrams)` - 1 test (`test/diagrams.test.ts:2` covers)
- `graph (src/graph)` - 1 test (`test/buildGraph.test.ts:2` covers)

## RepoWiki Commands

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

- [Module diagram](diagrams/modules.mmd)
- [Route diagram](diagrams/routes.mmd)

## Flows

- [Flow overview](flows/index.md)

## Documentation Quality

- [Quality bar](quality.md)

## Model Review

- [Codex review prompt](codex-review.md)

## Suggested Reading Order

- [Setup](setup.md)
- [Architecture](architecture.md)
- [Agent Context](agent-context.md)
- [Documentation Quality Bar](quality.md)
- [Codex Review Prompt](codex-review.md)
- [Areas](areas/index.md)
- [Flow Overview](flows/index.md)
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
