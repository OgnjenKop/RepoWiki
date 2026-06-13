# ai Flow

`src/ai`

## Overview

Likely orchestrates AI summaries and context packs for the wiki. 6 files belong to this module. Main files: src/ai/buildSummaries.ts, src/ai/contextPacks.ts, src/ai/openaiCompatibleProvider.ts, src/ai/prompt.ts. Entry files: src/ai/contextPacks.ts:56, src/ai/types.ts:6, src/ai/buildSummaries.ts:8. Module areas: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Exported symbols include buildRepoSummaries (src/ai/buildSummaries.ts:8), buildAreaContextPack (src/ai/contextPacks.ts:56), buildModuleContextPack (src/ai/contextPacks.ts:120), buildProjectContextPack (src/ai/contextPacks.ts:21), buildRouteContextPack (src/ai/contextPacks.ts:173), ContextPackWriteOptions (src/ai/contextPacks.ts:222), routeContextFileName (src/ai/contextPacks.ts:301), routeContextKey (src/ai/contextPacks.ts:297). Used by: src/commands/generate.ts, src/commands/review.ts, src/commands/synthesize.ts, src/commands/update.ts. Runtime consumers: src/commands/update.ts -> src/ai/buildSummaries.ts, src/ai/contextPacks.ts, src/commands/generate.ts -> src/ai/buildSummaries.ts, src/ai/types.ts, src/commands/synthesize.ts -> src/ai/buildSummaries.ts, src/ai/types.ts. Test consumers: test/aiPrompt.test.ts -> src/ai/prompt.ts, src/ai/types.ts, test/openaiCompatibleProvider.test.ts -> src/ai/openaiCompatibleProvider.ts, src/ai/types.ts, test/aiBuildSummaries.test.ts -> src/ai/buildSummaries.ts. Common change paths: Read the module entry files first: src/ai/contextPacks.ts, src/ai/types.ts, src/ai/buildSummaries.ts - These are the strongest module starting points. (evidence: src/ai/contextPacks.ts, src/ai/types.ts, src/ai/buildSummaries.ts); Inspect runtime consumers before changing shared code: src/commands/update.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/update.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts); Review test consumers before changing behavior: test/aiPrompt.test.ts, src/ai/prompt.ts, src/ai/types.ts - These tests show expected behavior around the module boundary. (evidence: test/aiPrompt.test.ts, src/ai/prompt.ts, src/ai/types.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2, test/aiSummaryFormat.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2, test/aiSummaryFormat.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/ai/buildSummaries.ts -> src/ai/contextPacks.ts.

## Module Areas

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).

## Area Summaries

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…

## Entry Files

- `src/ai/contextPacks.ts:56` - Imported by 5 external files.
- `src/ai/types.ts:6` - Imported by 5 external files.
- `src/ai/buildSummaries.ts:8` - Imported by 5 external files.
- `src/ai/summaryFormat.ts:4` - Imported by 1 external file.
- `src/ai/openaiCompatibleProvider.ts:5` - Imported by 1 external file.

## Area Flows

- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)
- `Core application logic: storage (src/storage)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (12 imports)
- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (110 imports)
- `Shared support: types (src/types) + utils (src/utils)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)

## Entry Points

- `test/aiBuildSummaries.test.ts:2` covers `src/ai/buildSummaries.ts`, `src/types/index.ts`
- `test/aiPrompt.test.ts:2` covers `src/ai/prompt.ts`, `src/ai/types.ts`
- `test/aiSummaryFormat.test.ts:2` covers `src/ai/summaryFormat.ts`
- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/contextPacks.test.ts:2` covers `src/ai/contextPacks.ts`, `src/types/index.ts`
- `test/metadataArtifacts.test.ts:5` covers `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts`
- `test/openaiCompatibleProvider.test.ts:2` covers `src/ai/openaiCompatibleProvider.ts`, `src/ai/types.ts`
- `src/commands/generate.ts` imports this module
- `src/commands/review.ts` imports this module
- `src/commands/synthesize.ts` imports this module
- `src/commands/update.ts` imports this module
- `src/storage/metadataStore.ts` imports this module
- `test/aiBuildSummaries.test.ts` imports this module
- `test/aiPrompt.test.ts` imports this module
- `test/aiSummaryFormat.test.ts` imports this module
- `test/cli.e2e.test.ts` imports this module
- `test/contextPacks.test.ts` imports this module
- `test/metadataArtifacts.test.ts` imports this module
- `test/openaiCompatibleProvider.test.ts` imports this module

## Common Change Paths

- `Read the module entry files first` -> `src/ai/contextPacks.ts`, `src/ai/types.ts`, `src/ai/buildSummaries.ts`, `src/ai/summaryFormat.ts` - These are the strongest module starting points. (evidence: `src/ai/contextPacks.ts`, `src/ai/types.ts`, `src/ai/buildSummaries.ts`, `src/ai/summaryFormat.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/update.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/update.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts`)
- `Review test consumers before changing behavior` -> `test/aiPrompt.test.ts`, `src/ai/prompt.ts`, `src/ai/types.ts`, `test/openaiCompatibleProvider.test.ts` - These tests show expected behavior around the module boundary. (evidence: `test/aiPrompt.test.ts`, `src/ai/prompt.ts`, `src/ai/types.ts`, `test/openaiCompatibleProvider.test.ts`)
- `Change module implementation files together` -> `src/ai/contextPacks.ts`, `src/ai/types.ts`, `src/ai/buildSummaries.ts`, `src/ai/summaryFormat.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/openaiCompatibleProvider.ts`, `src/ai/prompt.ts`)

## Module Connections

- `ai (src/ai) -> knowledge (src/knowledge)` (13 imports)
- `ai (src/ai) -> types (src/types)` (3 imports)
- `ai (src/ai) -> utils (src/utils)` (7 imports)
- `ai (src/ai) <- commands (src/commands)` (8 imports)
- `ai (src/ai) <- storage (src/storage)`

## Internal Flow

- `src/ai/buildSummaries.ts` -> `src/ai/contextPacks.ts`
- `src/ai/buildSummaries.ts` -> `src/ai/openaiCompatibleProvider.ts`
- `src/ai/buildSummaries.ts` -> `src/ai/types.ts`
- `src/ai/contextPacks.ts` -> `src/ai/types.ts`
- `src/ai/openaiCompatibleProvider.ts` -> `src/ai/prompt.ts`
- `src/ai/openaiCompatibleProvider.ts` -> `src/ai/summaryFormat.ts`
- `src/ai/openaiCompatibleProvider.ts` -> `src/ai/types.ts`
- `src/ai/prompt.ts` -> `src/ai/types.ts`

## External Dependencies

- `node:fs/promises`
- `node:path`

## Runtime Consumers

- `src/commands/update.ts` -> `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts` (3 imports into this module)
- `src/commands/generate.ts` -> `src/ai/buildSummaries.ts`, `src/ai/types.ts` (2 imports into this module)
- `src/commands/synthesize.ts` -> `src/ai/buildSummaries.ts`, `src/ai/types.ts` (2 imports into this module)
- `src/commands/review.ts` -> `src/ai/buildSummaries.ts` (1 imports into this module)
- `src/storage/metadataStore.ts` -> `src/ai/contextPacks.ts` (1 imports into this module)

## Test Consumers

- `test/aiPrompt.test.ts` -> `src/ai/prompt.ts`, `src/ai/types.ts` (2 imports into this module)
- `test/openaiCompatibleProvider.test.ts` -> `src/ai/openaiCompatibleProvider.ts`, `src/ai/types.ts` (2 imports into this module)
- `test/aiBuildSummaries.test.ts` -> `src/ai/buildSummaries.ts` (1 imports into this module)

## Related Tests

- `test/aiBuildSummaries.test.ts:2` covers `src/ai/buildSummaries.ts`, `src/types/index.ts`
- `test/aiPrompt.test.ts:2` covers `src/ai/prompt.ts`, `src/ai/types.ts`
- `test/aiSummaryFormat.test.ts:2` covers `src/ai/summaryFormat.ts`
- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/contextPacks.test.ts:2` covers `src/ai/contextPacks.ts`, `src/types/index.ts`
- `test/metadataArtifacts.test.ts:5` covers `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts`
- `test/openaiCompatibleProvider.test.ts:2` covers `src/ai/openaiCompatibleProvider.ts`, `src/ai/types.ts`

## Change Targets

- `src/ai/contextPacks.ts:56` - A connected implementation file with both imports and exports. [Symbols: buildProjectContextPack@21, buildAreaContextPack@56, buildModuleContextPack@120, buildRouteContextPack@173]
- `src/storage/metadataStore.ts:99` - A directly connected implementation file. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]
- `src/ai/types.ts:6` - A connected implementation file with both imports and exports. [Symbols: AiRuntimeOptions@6, ContextFile@14, ContextRelation@18, ContextFlow@24]
- `src/commands/update.ts:87` - A directly connected implementation file. [Symbols: updateCommand@9, getAffectedModules@46, getAffectedRoutes@71, getAffectedAreas@87]
- `src/ai/buildSummaries.ts:8` - A connected implementation file with both imports and exports. [Symbols: buildRepoSummaries@8]

## Verification

- Run: `npm run build`
- Related tests: `test/aiBuildSummaries.test.ts:2`, `test/aiPrompt.test.ts:2`, `test/aiSummaryFormat.test.ts:2`, `test/cli.e2e.test.ts:8`, `test/contextPacks.test.ts:2`, `test/metadataArtifacts.test.ts:5`, `test/openaiCompatibleProvider.test.ts:2`
- Run: `npm run test`
