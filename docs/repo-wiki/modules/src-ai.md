# ai

**Navigation:** [Wiki](../index.md) → [Modules](../index.md#modules) → ai

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Files** | **Entry files** | **Exports** | **Tests** |
| 9 | 5 | 57 | 8 |
| in `src/ai` | imported by others | public API | covering files |

## What This Module Does

Likely orchestrates AI summaries and context packs for the wiki. 9 files belong to this module. Main files: src/ai/buildInsights.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts, src/ai/insightPrompts.ts. Entry files: src/ai/types.ts:6, src/ai/summaryFormat.ts:74, src/ai/contextPacks.ts:59. Module areas: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Exported symbols include buildRepoInsights (src/ai/buildInsights.ts:21), buildRepoSummaries (src/ai/buildSummaries.ts:17), logSynthesisCoverage (src/ai/buildSummaries.ts:193), SummaryBuildInput (src/ai/buildSummaries.ts:11), buildAreaContextPack (src/ai/contextPacks.ts:59), buildModuleContextPack (src/ai/contextPacks.ts:123), buildProjectContextPack (src/ai/contextPacks.ts:23), buildRouteContextPack (src/ai/contextPacks.ts:176). Used by: src/commands/generate.ts, src/commands/review.ts, src/commands/synthesize.ts, src/commands/update.ts. Runtime consumers: src/commands/update.ts -> src/ai/buildInsights.ts, src/ai/buildSummaries.ts, src/commands/synthesize.ts -> src/ai/buildInsights.ts, src/ai/buildSummaries.ts, src/commands/generate.ts -> src/ai/buildInsights.ts, src/ai/buildSummaries.ts. Test consumers: test/aiPrompt.test.ts -> src/ai/prompt.ts, src/ai/types.ts, test/aiSummaryCache.test.ts -> src/ai/summaryCache.ts, src/ai/types.ts, test/openaiCompatibleProvider.test.ts -> src/ai/openaiCompatibleProvider.ts, src/ai/types.ts. Common change paths: Read the module entry files first: src/ai/types.ts, src/ai/summaryFormat.ts, src/ai/contextPacks.ts - These are the strongest module starting points. (evidence: src/ai/types.ts, src/ai/summaryFormat.ts, src/ai/contextPacks.ts); Inspect runtime consumers before changing shared code: src/commands/update.ts, src/ai/buildInsights.ts, src/ai/buildSummaries.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/update.ts, src/ai/buildInsights.ts, src/ai/buildSummaries.ts); Review test consumers before changing behavior: test/aiPrompt.test.ts, src/ai/prompt.ts, src/ai/types.ts - These tests show expected behavior around the module boundary. (evidence: test/aiPrompt.test.ts, src/ai/prompt.ts, src/ai/types.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2, test/aiSummaryCache.test.ts:5 - These tests exercise module behavior or its direct targets. (evidence: test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2, test/aiSummaryCache.test.ts:5) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/ai/buildInsights.ts -> src/ai/insightPrompts.ts.



> **ℹ️ Module path**
>
> `src/ai` contains 9 files. Open the path in your editor to see them all.

## How It Fits In

## Module Areas

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).


## Area Summaries

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…


## On This Page

## On This Page

- [What This Module Does](#what-this-module-does)
- [How It Fits In](#how-it-fits-in)
- [Entry Files](#entry-files)
- [Main Files](#main-files)
- [Exported Symbols](#exported-symbols)
- [Dependencies](#dependencies)
- [Consumers](#consumers)
- [Common Change Paths](#common-change-paths)
- [Related Tests](#related-tests)
- [Change Guidance](#change-guidance)
- [Verification](#verification)

## Entry Files

> **💡 What is an entry file?**
>
> An entry file is one that other files import from. Read these first to understand the module's public surface.

- `src/ai/types.ts:6` — Imported by 7 external files.
- `src/ai/summaryFormat.ts:74` — Imported by 7 external files.
- `src/ai/contextPacks.ts:59` — Imported by 5 external files.
- `src/ai/buildSummaries.ts:17` — Imported by 5 external files.
- `src/ai/buildInsights.ts:21` — Imported by 3 external files.

## Main Files

- `src/ai/buildInsights.ts`
- `src/ai/buildSummaries.ts`
- `src/ai/contextPacks.ts`
- `src/ai/insightPrompts.ts`
- `src/ai/openaiCompatibleProvider.ts`
- `src/ai/prompt.ts`
- `src/ai/summaryCache.ts`
- `src/ai/summaryFormat.ts`
- `src/ai/types.ts`

## Exported Symbols

> **ℹ️ Public API**
>
> These are the symbols other modules import. Changes here may break consumers — check [Consumers](#consumers) before editing.

- `buildRepoInsights` from `src/ai/buildInsights.ts:21`
- `SummaryBuildInput` from `src/ai/buildSummaries.ts:11`
- `buildRepoSummaries` from `src/ai/buildSummaries.ts:17`
- `logSynthesisCoverage` from `src/ai/buildSummaries.ts:193`
- `ContextPackWriteOptions` from `src/ai/contextPacks.ts:225`
- `buildAreaContextPack` from `src/ai/contextPacks.ts:59`
- `buildModuleContextPack` from `src/ai/contextPacks.ts:123`
- `buildProjectContextPack` from `src/ai/contextPacks.ts:23`
- `buildRouteContextPack` from `src/ai/contextPacks.ts:176`
- `reduceContextPack` from `src/ai/contextPacks.ts:494`
- `routeContextFileName` from `src/ai/contextPacks.ts:304`
- `routeContextKey` from `src/ai/contextPacks.ts:300`
- `sanitizePathFragment` from `src/ai/contextPacks.ts:308`
- `writeContextPacks` from `src/ai/contextPacks.ts:221`
- `writeContextPacksSelective` from `src/ai/contextPacks.ts:235`
- `buildArchitectureStoryMessages` from `src/ai/insightPrompts.ts:78`
- `buildModuleInsightMessages` from `src/ai/insightPrompts.ts:176`
- `buildOnboardingMessages` from `src/ai/insightPrompts.ts:124`
- `buildProjectNarrativeMessages` from `src/ai/insightPrompts.ts:21`
- `parseArchitectureStory` from `src/ai/insightPrompts.ts:238`
- `parseModuleInsight` from `src/ai/insightPrompts.ts:259`
- `parseOnboardingGuide` from `src/ai/insightPrompts.ts:249`
- `parseProjectNarrative` from `src/ai/insightPrompts.ts:227`
- `ChatMessage` from `src/ai/openaiCompatibleProvider.ts:13`
- `OpenAICompatibleProviderConfig` from `src/ai/openaiCompatibleProvider.ts:5`
- `OpenAICompatibleSummaryProvider` from `src/ai/openaiCompatibleProvider.ts:18`
- `buildSummaryMessages` from `src/ai/prompt.ts:11`
- `AiSummaryCache` from `src/ai/summaryCache.ts:8`
- `CachedAiSummary` from `src/ai/summaryCache.ts:13`
- `cacheKey` from `src/ai/summaryCache.ts:24`
- `computePackHash` from `src/ai/summaryCache.ts:31`
- `getCachedSummary` from `src/ai/summaryCache.ts:50`
- `loadSummaryCache` from `src/ai/summaryCache.ts:38`
- `setCachedSummary` from `src/ai/summaryCache.ts:68`
- `writeSummaryCache` from `src/ai/summaryCache.ts:46`
- `AiSummaryDraft` from `src/ai/summaryFormat.ts:4`
- `aiSummaryBody` from `src/ai/summaryFormat.ts:74`
- `extractJson` from `src/ai/summaryFormat.ts:124`
- `parseSummaryDraft` from `src/ai/summaryFormat.ts:26`
- `renderSummaryMarkdown` from `src/ai/summaryFormat.ts:78`
- `repairJson` from `src/ai/summaryFormat.ts:142`
- `AiRuntimeOptions` from `src/ai/types.ts:6`
- `ArchitecturalStory` from `src/ai/types.ts:100`
- `AreaContextInput` from `src/ai/types.ts:59`
- `ContextFile` from `src/ai/types.ts:14`
- `ContextFlow` from `src/ai/types.ts:24`
- `ContextPack` from `src/ai/types.ts:31`
- `ContextRelation` from `src/ai/types.ts:18`
- `ModuleContextInput` from `src/ai/types.ts:54`
- `ModuleInsight` from `src/ai/types.ts:69`
- `OnboardingGuide` from `src/ai/types.ts:85`
- `OnboardingStep` from `src/ai/types.ts:77`
- `ProjectNarrative` from `src/ai/types.ts:92`
- `RepoInsights` from `src/ai/types.ts:108`
- `RouteContextInput` from `src/ai/types.ts:64`
- `SummaryMap` from `src/ai/types.ts:48`
- `SummaryProvider` from `src/ai/types.ts:44`

## Dependencies

> **ℹ️ Internal vs external**
>
> Internal dependencies are imports from other files in this module. External dependencies are npm packages or other outside code.

## Internal Dependencies

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


## Consumers

> **ℹ️ Runtime vs test consumers**
>
> Runtime consumers are other source files that import this module. Test consumers are test files that exercise it. Both matter: runtime changes affect behavior, test changes affect coverage.

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


## Common Change Paths

- `Read the module entry files first` -> `src/ai/types.ts`, `src/ai/summaryFormat.ts`, `src/ai/contextPacks.ts`, `src/ai/buildSummaries.ts` - These are the strongest module starting points. (evidence: `src/ai/types.ts`, `src/ai/summaryFormat.ts`, `src/ai/contextPacks.ts`, `src/ai/buildSummaries.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/update.ts`, `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/update.ts`, `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`)
- `Review test consumers before changing behavior` -> `test/aiPrompt.test.ts`, `src/ai/prompt.ts`, `src/ai/types.ts`, `test/aiSummaryCache.test.ts` - These tests show expected behavior around the module boundary. (evidence: `test/aiPrompt.test.ts`, `src/ai/prompt.ts`, `src/ai/types.ts`, `test/aiSummaryCache.test.ts`)
- `Change module implementation files together` -> `src/ai/types.ts`, `src/ai/summaryFormat.ts`, `src/ai/contextPacks.ts`, `src/ai/buildSummaries.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/insightPrompts.ts`)

## Related Tests

- `test/aiBuildSummaries.test.ts:2` covers `src/ai/buildSummaries.ts`, `src/types/index.ts`
- `test/aiPrompt.test.ts:2` covers `src/ai/prompt.ts`, `src/ai/types.ts`
- `test/aiSummaryCache.test.ts:5` covers `src/ai/summaryCache.ts`, `src/ai/types.ts`
- `test/aiSummaryFormat.test.ts:2` covers `src/ai/summaryFormat.ts`
- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/contextPacks.test.ts:2` covers `src/ai/contextPacks.ts`, `src/types/index.ts`
- `test/metadataArtifacts.test.ts:5` covers `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts`
- `test/openaiCompatibleProvider.test.ts:2` covers `src/ai/openaiCompatibleProvider.ts`, `src/ai/types.ts`

## Change Guidance

- `src/ai/contextPacks.ts:59` — A connected implementation file with both imports and exports. [Symbols: buildProjectContextPack@23, buildAreaContextPack@59, buildModuleContextPack@123, buildRouteContextPack@176]
- `src/ai/summaryFormat.ts:74` — A connected implementation file with both imports and exports. [Symbols: AiSummaryDraft@4, parseSummaryDraft@26, aiSummaryBody@74, renderSummaryMarkdown@78]
- `src/ai/types.ts:6` — A connected implementation file with both imports and exports. [Symbols: AiRuntimeOptions@6, ContextFile@14, ContextRelation@18, ContextFlow@24]
- `src/ai/buildSummaries.ts:17` — A connected implementation file with both imports and exports. [Symbols: SummaryBuildInput@11, buildRepoSummaries@17, logSynthesisCoverage@193]
- `src/storage/metadataStore.ts:99` — A directly connected implementation file. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]

## Decision Points

- Start with `src/ai/contextPacks.ts:59` if you are changing public behavior.
- Use `src/ai/summaryFormat.ts:74` as the next stop for supporting logic.
- Check `test/aiBuildSummaries.test.ts:2` before changing implementation details.


## Verification

- Related tests: `test/aiBuildSummaries.test.ts:2`, `test/aiPrompt.test.ts:2`, `test/aiSummaryCache.test.ts:5`, `test/aiSummaryFormat.test.ts:2`, `test/cli.e2e.test.ts:8`, `test/contextPacks.test.ts:2`, `test/metadataArtifacts.test.ts:5`, `test/openaiCompatibleProvider.test.ts:2`
- Run: `npm run test`

> **❗ Before you commit**
>
> After editing this module, regenerate the wiki with `repowiki update` so the docs stay accurate.

## Notes For AI Agents

- Start by reading the entry files listed above.
- Treat the purpose summary as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
