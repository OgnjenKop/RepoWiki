# ai Flow

**Navigation:** [Wiki](../../index.md) → [Flows](../index.md) → ai

## Overview

Likely orchestrates AI summaries and context packs for the wiki. 9 files belong to this module. Main files: src/ai/buildInsights.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts, src/ai/insightPrompts.ts. Entry files: src/ai/types.ts:6, src/ai/summaryFormat.ts:74, src/ai/contextPacks.ts:59. Module areas: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Exported symbols include buildRepoInsights (src/ai/buildInsights.ts:21), buildRepoSummaries (src/ai/buildSummaries.ts:17), logSynthesisCoverage (src/ai/buildSummaries.ts:193), SummaryBuildInput (src/ai/buildSummaries.ts:11), buildAreaContextPack (src/ai/contextPacks.ts:59), buildModuleContextPack (src/ai/contextPacks.ts:123), buildProjectContextPack (src/ai/contextPacks.ts:23), buildRouteContextPack (src/ai/contextPacks.ts:176). Used by: src/commands/generate.ts, src/commands/review.ts, src/commands/synthesize.ts, src/commands/update.ts. Runtime consumers: src/commands/update.ts -> src/ai/buildInsights.ts, src/ai/buildSummaries.ts, src/commands/synthesize.ts -> src/ai/buildInsights.ts, src/ai/buildSummaries.ts, src/commands/generate.ts -> src/ai/buildInsights.ts, src/ai/buildSummaries.ts. Test consumers: test/aiPrompt.test.ts -> src/ai/prompt.ts, src/ai/types.ts, test/aiSummaryCache.test.ts -> src/ai/summaryCache.ts, src/ai/types.ts, test/openaiCompatibleProvider.test.ts -> src/ai/openaiCompatibleProvider.ts, src/ai/types.ts. Common change paths: Read the module entry files first: src/ai/types.ts, src/ai/summaryFormat.ts, src/ai/contextPacks.ts - These are the strongest module starting points. (evidence: src/ai/types.ts, src/ai/summaryFormat.ts, src/ai/contextPacks.ts); Inspect runtime consumers before changing shared code: src/commands/update.ts, src/ai/buildInsights.ts, src/ai/buildSummaries.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/update.ts, src/ai/buildInsights.ts, src/ai/buildSummaries.ts); Review test consumers before changing behavior: test/aiPrompt.test.ts, src/ai/prompt.ts, src/ai/types.ts - These tests show expected behavior around the module boundary. (evidence: test/aiPrompt.test.ts, src/ai/prompt.ts, src/ai/types.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2, test/aiSummaryCache.test.ts:5 - These tests exercise module behavior or its direct targets. (evidence: test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2, test/aiSummaryCache.test.ts:5) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/ai/buildInsights.ts -> src/ai/insightPrompts.ts.

> **ℹ️ Module path**
>
> `src/ai` contains this module's files.

## Module Areas

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).

## Area Summaries

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…


## Entry Files

- `src/ai/types.ts:6` — Imported by 7 external files.
- `src/ai/summaryFormat.ts:74` — Imported by 7 external files.
- `src/ai/contextPacks.ts:59` — Imported by 5 external files.
- `src/ai/buildSummaries.ts:17` — Imported by 5 external files.
- `src/ai/buildInsights.ts:21` — Imported by 3 external files.

## Area Flows

- `Core application logic: graph (src/graph) + scanner (src/scanner)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)
- `Core application logic: storage (src/storage)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (17 imports)
- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` → `Shared support: types (src/types) + utils (src/utils)` (121 imports)
- `Shared support: types (src/types) + utils (src/utils)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)

## Entry Points

- `test/aiBuildSummaries.test.ts:2` covers `src/ai/buildSummaries.ts`, `src/types/index.ts`
- `test/aiPrompt.test.ts:2` covers `src/ai/prompt.ts`, `src/ai/types.ts`
- `test/aiSummaryCache.test.ts:5` covers `src/ai/summaryCache.ts`, `src/ai/types.ts`
- `test/aiSummaryFormat.test.ts:2` covers `src/ai/summaryFormat.ts`
- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/contextPacks.test.ts:2` covers `src/ai/contextPacks.ts`, `src/types/index.ts`
- `test/metadataArtifacts.test.ts:5` covers `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts`
- `test/openaiCompatibleProvider.test.ts:2` covers `src/ai/openaiCompatibleProvider.ts`, `src/ai/types.ts`
- `src/commands/generate.ts` imports this module
- `src/commands/review.ts` imports this module
- `src/commands/synthesize.ts` imports this module
- `src/commands/update.ts` imports this module
- `src/docs/generateAgentContextDoc.ts` imports this module
- `src/docs/generateAgentsMd.ts` imports this module
- `src/docs/generateArchitectureDoc.ts` imports this module
- `src/docs/generateAreaDoc.ts` imports this module
- `src/docs/generateIndexDoc.ts` imports this module
- `src/docs/generateModuleDoc.ts` imports this module
- `src/storage/metadataStore.ts` imports this module
- `src/utils/insightRenderer.ts` imports this module
- `test/aiBuildSummaries.test.ts` imports this module
- `test/aiPrompt.test.ts` imports this module
- `test/aiSummaryCache.test.ts` imports this module
- `test/aiSummaryFormat.test.ts` imports this module
- `test/cli.e2e.test.ts` imports this module
- `test/contextPacks.test.ts` imports this module
- `test/metadataArtifacts.test.ts` imports this module
- `test/openaiCompatibleProvider.test.ts` imports this module

## Common Change Paths

- `Read the module entry files first` -> `src/ai/types.ts`, `src/ai/summaryFormat.ts`, `src/ai/contextPacks.ts`, `src/ai/buildSummaries.ts` - These are the strongest module starting points. (evidence: `src/ai/types.ts`, `src/ai/summaryFormat.ts`, `src/ai/contextPacks.ts`, `src/ai/buildSummaries.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/update.ts`, `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/update.ts`, `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`)
- `Review test consumers before changing behavior` -> `test/aiPrompt.test.ts`, `src/ai/prompt.ts`, `src/ai/types.ts`, `test/aiSummaryCache.test.ts` - These tests show expected behavior around the module boundary. (evidence: `test/aiPrompt.test.ts`, `src/ai/prompt.ts`, `src/ai/types.ts`, `test/aiSummaryCache.test.ts`)
- `Change module implementation files together` -> `src/ai/types.ts`, `src/ai/summaryFormat.ts`, `src/ai/contextPacks.ts`, `src/ai/buildSummaries.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/insightPrompts.ts`)

## Module Connections

- `ai (src/ai) ← commands (src/commands)` (13 imports)
- `ai (src/ai) ← docs (src/docs)` (6 imports)
- `ai (src/ai) ← storage (src/storage)`
- `ai (src/ai) ← utils (src/utils)`
- `ai (src/ai) → knowledge (src/knowledge)` (13 imports)
- `ai (src/ai) → types (src/types)` (5 imports)
- `ai (src/ai) → utils (src/utils)` (9 imports)

## Internal Flow

- `src/ai/buildInsights.ts` → `src/ai/insightPrompts.ts`
- `src/ai/buildInsights.ts` → `src/ai/openaiCompatibleProvider.ts`
- `src/ai/buildInsights.ts` → `src/ai/types.ts`
- `src/ai/buildSummaries.ts` → `src/ai/contextPacks.ts`
- `src/ai/buildSummaries.ts` → `src/ai/openaiCompatibleProvider.ts`
- `src/ai/buildSummaries.ts` → `src/ai/summaryCache.ts`
- `src/ai/buildSummaries.ts` → `src/ai/types.ts`
- `src/ai/contextPacks.ts` → `src/ai/types.ts`
- `src/ai/insightPrompts.ts` → `src/ai/types.ts`
- `src/ai/openaiCompatibleProvider.ts` → `src/ai/prompt.ts`
- `src/ai/openaiCompatibleProvider.ts` → `src/ai/summaryFormat.ts`
- `src/ai/openaiCompatibleProvider.ts` → `src/ai/types.ts`
- `src/ai/prompt.ts` → `src/ai/types.ts`
- `src/ai/summaryCache.ts` → `src/ai/prompt.ts`
- `src/ai/summaryCache.ts` → `src/ai/types.ts`

## External Dependencies

- `node:fs/promises`
- `node:path`

## Runtime Consumers

- `src/commands/update.ts` -> `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/summaryCache.ts` (5 imports into this module)
- `src/commands/synthesize.ts` -> `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/summaryCache.ts`, `src/ai/types.ts` (4 imports into this module)
- `src/commands/generate.ts` -> `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/types.ts` (3 imports into this module)
- `src/commands/review.ts` -> `src/ai/buildSummaries.ts` (1 imports into this module)
- `src/docs/generateAgentContextDoc.ts` -> `src/ai/summaryFormat.ts` (1 imports into this module)

## Test Consumers

- `test/aiPrompt.test.ts` -> `src/ai/prompt.ts`, `src/ai/types.ts` (2 imports into this module)
- `test/aiSummaryCache.test.ts` -> `src/ai/summaryCache.ts`, `src/ai/types.ts` (2 imports into this module)
- `test/openaiCompatibleProvider.test.ts` -> `src/ai/openaiCompatibleProvider.ts`, `src/ai/types.ts` (2 imports into this module)

## Related Tests

- `test/aiBuildSummaries.test.ts:2` covers `src/ai/buildSummaries.ts`, `src/types/index.ts`
- `test/aiPrompt.test.ts:2` covers `src/ai/prompt.ts`, `src/ai/types.ts`
- `test/aiSummaryCache.test.ts:5` covers `src/ai/summaryCache.ts`, `src/ai/types.ts`
- `test/aiSummaryFormat.test.ts:2` covers `src/ai/summaryFormat.ts`
- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/contextPacks.test.ts:2` covers `src/ai/contextPacks.ts`, `src/types/index.ts`
- `test/metadataArtifacts.test.ts:5` covers `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts`
- `test/openaiCompatibleProvider.test.ts:2` covers `src/ai/openaiCompatibleProvider.ts`, `src/ai/types.ts`

## Change Targets

- `src/ai/contextPacks.ts:59` — A connected implementation file with both imports and exports. [Symbols: buildProjectContextPack@23, buildAreaContextPack@59, buildModuleContextPack@123, buildRouteContextPack@176]
- `src/ai/summaryFormat.ts:74` — A connected implementation file with both imports and exports. [Symbols: AiSummaryDraft@4, parseSummaryDraft@26, aiSummaryBody@74, renderSummaryMarkdown@78]
- `src/ai/types.ts:6` — A connected implementation file with both imports and exports. [Symbols: AiRuntimeOptions@6, ContextFile@14, ContextRelation@18, ContextFlow@24]
- `src/ai/buildSummaries.ts:17` — A connected implementation file with both imports and exports. [Symbols: SummaryBuildInput@11, buildRepoSummaries@17, logSynthesisCoverage@193]
- `src/storage/metadataStore.ts:99` — A directly connected implementation file. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]

## Verification

- Run: `npm run build`
- Related tests: `test/aiBuildSummaries.test.ts:2`, `test/aiPrompt.test.ts:2`, `test/aiSummaryCache.test.ts:5`, `test/aiSummaryFormat.test.ts:2`, `test/cli.e2e.test.ts:8`, `test/contextPacks.test.ts:2`, `test/metadataArtifacts.test.ts:5`, `test/openaiCompatibleProvider.test.ts:2`
- Run: `npm run test`
