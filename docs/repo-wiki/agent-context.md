# Agent Context

## Project Summary

RepoWiki is a Node/TypeScript repository. Detected modules: ai (src/ai), cli (src/cli.ts), commands (src/commands), diagrams (src/diagrams), docs (src/docs), graph (src/graph), knowledge (src/knowledge), scanner (src/scanner), storage (src/storage), types (src/types), utils (src/utils). Important config files: package.json, tsconfig.json, vitest.config.ts. Scripts: build, dev, pretest, test. CLI commands: check, generate, review, synthesize, update. CLI flags: --ai, --ai-api-key, --ai-base-url, --ai-model, --root, --verbose. Key module areas: Operations and entry points: cli (src/cli.ts) + commands (src/commands), Core application logic: graph (src/graph) + scanner (src/scanner), Core application logic: storage (src/storage), Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Shared support: types (src/types) + utils (src/utils). Key area flows: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more -> Shared support: types (src/types) + utils (src/utils), Core application logic: graph (src/graph) + scanner (src/scanner) -> Shared support: types (src/types) + utils (src/utils), Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: graph (src/graph) + scanner (src/scanner), Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: storage (src/storage). Important entry files: src/cli.ts:36, src/types/index.ts:198, src/docs/generateAgentsMd.ts:14, src/docs/writeDocs.ts:30, src/utils/markdown.ts:30, src/utils/moduleLabel.ts:3, src/scanner/detectDesignTokens.ts:18, src/scanner/scanRepo.ts:64. Key module flows: ai (src/ai) -> types (src/types), ai (src/ai) -> knowledge (src/knowledge), ai (src/ai) -> utils (src/utils), cli (src/cli.ts) -> commands (src/commands), commands (src/commands) -> scanner (src/scanner).

## Knowledge Base

- Knowledge items: 71
- Routes detected: 0
- Environment variables detected: 12
- Test files detected: 35

## Documentation Quality Bar

- Target: Qoder-style, agent-ready repository documentation.
- Read `docs/repo-wiki/quality.md` for the quality checklist and model-review loop.
- Use `docs/repo-wiki/codex-review.md` with Codex or ChatGPT to identify weak generated docs and concrete RepoWiki improvements.

## Important Files To Read First

- `package.json`
- `README.md`
- `vitest.config.ts`
- `tsconfig.json`
- `src/cli.ts`
- `src/types/index.ts`
- `src/docs/generateAgentsMd.ts`
- `src/docs/writeDocs.ts`
- `src/utils/markdown.ts`
- `src/utils/moduleLabel.ts`
- `src/scanner/detectDesignTokens.ts`
- `src/scanner/scanRepo.ts`

## Important Entry Files

- `src/cli.ts:36` - Defines 7 symbols used inside this module.
- `src/types/index.ts:198` - Central implementation file with exported behavior.
- `src/docs/generateAgentsMd.ts:14` - Imported by 2 external files.
- `src/docs/writeDocs.ts:30` - Imported by 4 external files.
- `src/utils/markdown.ts:30` - Imported by 14 external files.
- `src/utils/moduleLabel.ts:3` - Imported by 12 external files.
- `src/scanner/detectDesignTokens.ts:18` - Imported by 1 external file.
- `src/scanner/scanRepo.ts:64` - Imported by 8 external files.
- `src/knowledge/areaOrdering.ts:24` - Imported by 12 external files.
- `src/knowledge/moduleFocus.ts:18` - Imported by 12 external files.

## Module Map

- `ai (src/ai)`: 9 files under `src/ai`
- `cli (src/cli.ts)`: 1 file under `src/cli.ts`
- `commands (src/commands)`: 5 files under `src/commands`
- `diagrams (src/diagrams)`: 1 file under `src/diagrams`
- `docs (src/docs)`: 15 files under `src/docs`
- `graph (src/graph)`: 1 file under `src/graph`
- `knowledge (src/knowledge)`: 10 files under `src/knowledge`
- `scanner (src/scanner)`: 12 files under `src/scanner`
- `storage (src/storage)`: 1 file under `src/storage`
- `types (src/types)`: 1 file under `src/types`
- `utils (src/utils)`: 15 files under `src/utils`

## Module Areas

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)`: 2 modules - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…
- `Core application logic: graph (src/graph) + scanner (src/scanner)`: 2 modules - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…
- `Core application logic: storage (src/storage)`: 1 module - Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage. Modules: storage (src/storage). Root paths: src/storage.…
- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more`: 4 modules - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…
- `Shared support: types (src/types) + utils (src/utils)`: 2 modules - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…

## Area Summaries

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](areas/orchestration-src-cli-src-commands.md) - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…
- [Core application logic: graph (src/graph) + scanner (src/scanner)](areas/analysis-src-graph-src-scanner.md) - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…
- [Core application logic: storage (src/storage)](areas/analysis-src-storage.md) - Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage. Modules: storage (src/storage). Root paths: src/storage.…
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…
- [Shared support: types (src/types) + utils (src/utils)](areas/support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…

## Area Docs

Read `docs/repo-wiki/areas/index.md` for the area-level map.

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](areas/orchestration-src-cli-src-commands.md) - 2 modules
- [Core application logic: graph (src/graph) + scanner (src/scanner)](areas/analysis-src-graph-src-scanner.md) - 2 modules
- [Core application logic: storage (src/storage)](areas/analysis-src-storage.md) - 1 module
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - 4 modules
- [Shared support: types (src/types) + utils (src/utils)](areas/support-src-types-src-utils.md) - 2 modules

## Area Flows

- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (121 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Shared support: types (src/types) + utils (src/utils)` (25 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (17 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: graph (src/graph) + scanner (src/scanner)` (5 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: storage (src/storage)` (5 imports)

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
- `test/buildGraph.test.ts` -> `src/graph/buildGraph.ts`, `src/types/index.ts` (2 imports into the repo)
- `test/cli.e2e.test.ts` -> `src/ai/contextPacks.ts`, `src/utils/docPaths.ts` (2 imports into the repo)

## Common Change Paths

- `Change operations, scripts, or entry behavior` -> `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - Start in runnable entry points, scripts, and top-level orchestration. (evidence: `Operations and entry points: cli (src/cli.ts) + commands (src/commands)`, `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`)
- `Change core application behavior` -> `src/graph/buildGraph.ts`, `src/scanner/detectComponents.ts`, `src/scanner/detectDesignSystem.ts`, `src/scanner/detectDesignTokens.ts` - Start in the domain, service, state, routing, or data-flow modules. (evidence: `Core application logic: graph (src/graph) + scanner (src/scanner)`, `src/graph/buildGraph.ts`, `src/scanner/detectComponents.ts`, `src/scanner/detectDesignSystem.ts`)
- `Change UI, docs, or generated output` -> `src/docs/generateAgentsMd.ts`, `src/docs/writeDocs.ts`, `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts` - Start in user-facing presentation, docs, or output-generation modules. (evidence: `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more`, `src/docs/generateAgentsMd.ts`, `src/docs/writeDocs.ts`, `src/ai/buildInsights.ts`)
- `Change shared types, configuration, persistence, or helpers` -> `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/changePaths.ts` - Start in shared utility, configuration, storage, and type layers. (evidence: `Shared support: types (src/types) + utils (src/utils)`, `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`)

## Flow Overview

- Read `docs/repo-wiki/flows/index.md` for execution paths and module-to-module relationships.

## Useful Commands

- `npm install`
- `npm run build`
- `npm run dev`
- `npm run test`

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

## Change Safety Notes

- Review carefully before changing `SECURITY.md`
- Review carefully before changing `src/scanner/detectEnvVars.ts`
- Review carefully before changing `test/detectEnvVars.test.ts`

## Change Targets

- `src/types/index.ts:198` - A file that exposes behavior used elsewhere. [Symbols: SymbolKind@1, SymbolRecord@10, FileRecord@17, GraphEdge@27]
- `package.json:1` - Scripts, dependencies, and package-level entry points. (Changing scripts or dependencies can affect the whole repo.)
- `README.md:1` - Project overview and contributor guidance.
- `vitest.config.ts:1` - Configuration that shapes runtime or tooling behavior. (Configuration changes should be checked against build and runtime behavior.)
- `tsconfig.json:1` - Configuration that shapes runtime or tooling behavior. (Configuration changes should be checked against build and runtime behavior.)
- `src/cli.ts:36` - A dependency-heavy file that influences nearby code.
- `src/ai/contextPacks.ts:59` - A connected implementation file with both imports and exports. [Symbols: buildProjectContextPack@23, buildAreaContextPack@59, buildModuleContextPack@123, buildRouteContextPack@176]
- `src/knowledge/moduleFocus.ts:18` - A connected implementation file with both imports and exports. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]

## Testing Commands

`npm run test`

## Coding Conventions

- Keep changes consistent with existing file layout and exported symbols.
- Existing scripts detected: `build`, `dev`, `pretest`, `test`.
- Generated docs are deterministic; do not add unsupported behavior claims.
