# utils Flow

**Navigation:** [Wiki](../../index.md) → [Flows](../index.md) → utils

## Overview

Likely provides shared filesystem, hashing, markdown, and path helpers. 15 files belong to this module. Main files: src/utils/changePaths.ts, src/utils/changeTargets.ts, src/utils/consumers.ts, src/utils/docPaths.ts. Entry files: src/utils/markdown.ts:30, src/utils/moduleLabel.ts:3, src/utils/docPaths.ts:5. Module areas: Shared support: types (src/types) + utils (src/utils). Exported symbols include formatChangePath (src/utils/changePaths.ts:4), formatChangeTargetSymbols (src/utils/changeTargets.ts:3), renderConsumerList (src/utils/consumers.ts:11), splitConsumers (src/utils/consumers.ts:4), areaDocFileName (src/utils/docPaths.ts:5), sanitizeDocFragment (src/utils/docPaths.ts:1), pathExists (src/utils/fs.ts:4), readJson (src/utils/fs.ts:13). Used by: src/ai/contextPacks.ts, src/ai/prompt.ts, src/ai/summaryCache.ts, src/ai/summaryFormat.ts. Runtime consumers: src/docs/generateFlowDocs.ts -> src/utils/changePaths.ts, src/utils/changeTargets.ts, src/docs/generateArchitectureDoc.ts -> src/utils/changePaths.ts, src/utils/consumers.ts, src/docs/generateModuleDoc.ts -> src/utils/changePaths.ts, src/utils/changeTargets.ts. Common change paths: Read the module entry files first: src/utils/markdown.ts, src/utils/moduleLabel.ts, src/utils/docPaths.ts - These are the strongest module starting points. (evidence: src/utils/markdown.ts, src/utils/moduleLabel.ts, src/utils/docPaths.ts); Inspect runtime consumers before changing shared code: src/docs/generateFlowDocs.ts, src/utils/changePaths.ts, src/utils/changeTargets.ts - These runtime-like files depend on the module boundary. (evidence: src/docs/generateFlowDocs.ts, src/utils/changePaths.ts, src/utils/changeTargets.ts); Change module implementation files together: src/utils/markdown.ts, src/utils/moduleLabel.ts, src/utils/docPaths.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/utils/changePaths.ts, src/utils/changeTargets.ts, src/utils/consumers.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/cli.e2e.test.ts:8, test/packageManager.test.ts:2, test/sourceText.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/cli.e2e.test.ts:8, test/packageManager.test.ts:2, test/sourceText.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/utils/changePaths.ts -> src/utils/markdown.ts.

> **ℹ️ Module path**
>
> `src/utils` contains this module's files.

## Module Areas

- [Shared support: types (src/types) + utils (src/utils)](../../areas/support-src-types-src-utils.md) — Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils).

## Area Summaries

- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) — Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…


## Entry Files

- `src/utils/markdown.ts:30` — Imported by 14 external files.
- `src/utils/moduleLabel.ts:3` — Imported by 12 external files.
- `src/utils/docPaths.ts:5` — Imported by 11 external files.
- `src/utils/sourceText.ts:117` — Imported by 8 external files.
- `src/utils/consumers.ts:11` — Imported by 8 external files.

## Area Flows

- `Core application logic: graph (src/graph) + scanner (src/scanner)` → `Shared support: types (src/types) + utils (src/utils)` (25 imports)
- `Core application logic: storage (src/storage)` → `Shared support: types (src/types) + utils (src/utils)` (3 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Shared support: types (src/types) + utils (src/utils)` (1 imports)
- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` → `Shared support: types (src/types) + utils (src/utils)` (121 imports)
- `Shared support: types (src/types) + utils (src/utils)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)

## Entry Points

- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/packageManager.test.ts:2` covers `src/utils/packageManager.ts`
- `test/sourceText.test.ts:2` covers `src/utils/sourceText.ts`
- `test/summaryExcerpt.test.ts:2` covers `src/utils/summaryExcerpt.ts`
- `src/ai/contextPacks.ts` imports this module
- `src/ai/prompt.ts` imports this module
- `src/ai/summaryCache.ts` imports this module
- `src/ai/summaryFormat.ts` imports this module
- `src/diagrams/generateDiagrams.ts` imports this module
- `src/docs/generateAgentContextDoc.ts` imports this module
- `src/docs/generateAgentsMd.ts` imports this module
- `src/docs/generateArchitectureDoc.ts` imports this module
- `src/docs/generateAreaDoc.ts` imports this module
- `src/docs/generateAreasIndexDoc.ts` imports this module
- `src/docs/generateCodexReviewDoc.ts` imports this module
- `src/docs/generateDesignDoc.ts` imports this module
- `src/docs/generateDesignHtml.ts` imports this module
- `src/docs/generateFlowDocs.ts` imports this module
- `src/docs/generateIndexDoc.ts` imports this module
- `src/docs/generateModuleDoc.ts` imports this module
- `src/docs/generateQualityDoc.ts` imports this module
- `src/docs/generateSetupDoc.ts` imports this module
- `src/docs/repoWikiCli.ts` imports this module
- `src/docs/writeDocs.ts` imports this module
- `src/knowledge/buildKnowledge.ts` imports this module
- `src/knowledge/buildSummaries.ts` imports this module
- `src/knowledge/changeTargets.ts` imports this module
- `src/knowledge/moduleAreas.ts` imports this module
- `src/knowledge/moduleFocus.ts` imports this module
- `src/knowledge/verification.ts` imports this module
- `src/scanner/detectComponents.ts` imports this module
- `src/scanner/detectDesignTokens.ts` imports this module
- `src/scanner/detectEnvVars.ts` imports this module
- `src/scanner/detectModules.ts` imports this module
- `src/scanner/detectPathAliases.ts` imports this module
- `src/scanner/detectProject.ts` imports this module
- `src/scanner/detectRoutes.ts` imports this module
- `src/scanner/detectTests.ts` imports this module
- `src/scanner/parseFiles.ts` imports this module
- `src/scanner/scanRepo.ts` imports this module
- `src/storage/metadataStore.ts` imports this module
- `test/cli.e2e.test.ts` imports this module
- `test/packageManager.test.ts` imports this module
- `test/sourceText.test.ts` imports this module
- `test/summaryExcerpt.test.ts` imports this module

## Common Change Paths

- `Read the module entry files first` -> `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts`, `src/utils/sourceText.ts` - These are the strongest module starting points. (evidence: `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts`, `src/utils/sourceText.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/docs/generateFlowDocs.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` - These runtime-like files depend on the module boundary. (evidence: `src/docs/generateFlowDocs.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`)
- `Change module implementation files together` -> `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts`, `src/utils/sourceText.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts`)

## Module Connections

- `utils (src/utils) ← ai (src/ai)` (9 imports)
- `utils (src/utils) ← diagrams (src/diagrams)`
- `utils (src/utils) ← docs (src/docs)` (70 imports)
- `utils (src/utils) ← knowledge (src/knowledge)` (10 imports)
- `utils (src/utils) ← scanner (src/scanner)` (13 imports)
- `utils (src/utils) ← storage (src/storage)` (2 imports)
- `utils (src/utils) → ai (src/ai)`
- `utils (src/utils) → knowledge (src/knowledge)` (2 imports)
- `utils (src/utils) → types (src/types)` (4 imports)

## Internal Flow

- `src/utils/changePaths.ts` → `src/utils/markdown.ts`
- `src/utils/consumers.ts` → `src/utils/markdown.ts`
- `src/utils/insightRenderer.ts` → `src/utils/markdown.ts`

## External Dependencies

- `node:crypto`
- `node:fs/promises`
- `node:path`

## Runtime Consumers

- `src/docs/generateFlowDocs.ts` -> `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (10 imports into this module)
- `src/docs/generateArchitectureDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts`, `src/utils/insightRenderer.ts` (9 imports into this module)
- `src/docs/generateModuleDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (9 imports into this module)
- `src/docs/generateAgentContextDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (8 imports into this module)
- `src/docs/generateIndexDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts`, `src/utils/insightRenderer.ts` (8 imports into this module)
- `src/docs/generateAreaDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/markdown.ts` (7 imports into this module)
- `src/ai/contextPacks.ts` -> `src/utils/consumers.ts`, `src/utils/fs.ts`, `src/utils/moduleLabel.ts`, `src/utils/routeCoverage.ts` (4 imports into this module)
- `src/docs/generateAgentsMd.ts` -> `src/utils/docPaths.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/summaryExcerpt.ts` (4 imports into this module)

## Test Consumers

_No test consumers detected._

## Related Tests

- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/packageManager.test.ts:2` covers `src/utils/packageManager.ts`
- `test/sourceText.test.ts:2` covers `src/utils/sourceText.ts`
- `test/summaryExcerpt.test.ts:2` covers `src/utils/summaryExcerpt.ts`

## Change Targets

- `src/ai/contextPacks.ts:59` — A directly connected implementation file. [Symbols: buildProjectContextPack@23, buildAreaContextPack@59, buildModuleContextPack@123, buildRouteContextPack@176]
- `src/knowledge/moduleFocus.ts:18` — A directly connected implementation file. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/utils/markdown.ts:30` — A file that exposes behavior used elsewhere. [Symbols: list@1, code@6, heading@10, pluralize@16]
- `src/ai/summaryFormat.ts:74` — A directly connected implementation file. [Symbols: AiSummaryDraft@4, parseSummaryDraft@26, aiSummaryBody@74, renderSummaryMarkdown@78]
- `src/scanner/scanRepo.ts:64` — A directly connected implementation file. [Symbols: scanRepo@64]

## Verification

- Run: `npm run build`
- Related tests: `test/cli.e2e.test.ts:8`, `test/packageManager.test.ts:2`, `test/sourceText.test.ts:2`, `test/summaryExcerpt.test.ts:2`
- Run: `npm run test`
