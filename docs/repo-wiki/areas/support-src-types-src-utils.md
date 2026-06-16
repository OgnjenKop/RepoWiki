# Shared support: types (src/types) + utils (src/utils)

**Navigation:** [Wiki](../index.md) → [Areas](index.md) → Shared support: types (src/types) + utils (src/utils)

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Modules** | **Files** | **Tests** | **Entry files** |
| 2 | 16 | 18 | 5 |
| in this area | scanned | covering files | imported by others |

## What This Area Is

Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils). Root paths: src/types, src/utils. Entry files: src/types/index.ts:198, src/utils/markdown.ts:30, src/utils/moduleLabel.ts:3. Runtime consumers: src/docs/generateFlowDocs.ts -> src/types/index.ts, src/utils/changePaths.ts, src/docs/generateArchitectureDoc.ts -> src/types/index.ts, src/utils/changePaths.ts, src/docs/generateModuleDoc.ts -> src/types/index.ts, src/utils/changePaths.ts. Incoming area flows: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more -> Shared support: types (src/types) + utils (src/utils), Core application logic: graph (src/graph) + scanner (src/scanner) -> Shared support: types (src/types) + utils (src/utils), Core application logic: storage (src/storage) -> Shared support: types (src/types) + utils (src/utils). Outgoing area flows: Shared support: types (src/types) + utils (src/utils) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Common change paths: Read the module entry files first: src/types/index.ts, src/utils/markdown.ts, src/utils/moduleLabel.ts - These are the strongest module starting points. (evidence: src/types/index.ts, src/utils/markdown.ts, src/utils/moduleLabel.ts); Inspect runtime consumers before changing shared code: src/docs/generateFlowDocs.ts, src/types/index.ts, src/utils/changePaths.ts - These runtime-like files depend on the module boundary. (evidence: src/docs/generateFlowDocs.ts, src/types/index.ts, src/utils/changePaths.ts); Change module implementation files together: src/types/index.ts, src/utils/markdown.ts, src/utils/moduleLabel.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/types/index.ts, src/utils/changePaths.ts, src/utils/changeTargets.ts). Verification: Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json) Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json) Inspect related tests: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2 - These tests cover files in the area. (evidence: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2)

> **ℹ️ Purpose**
>
> Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils).

## On This Page

## On This Page

- [What This Area Is](#what-this-area-is)
- [Modules](#modules)
- [Entry Files](#entry-files)
- [Key Files](#key-files)
- [Module Connections](#module-connections)
- [Area Flows](#area-flows)
- [Consumers](#consumers)
- [Common Change Paths](#common-change-paths)
- [Change Guidance](#change-guidance)
- [Verification](#verification)

## Modules

- [types (src/types)](../modules/src-types.md) — 1 file
- [utils (src/utils)](../modules/src-utils.md) — 15 files

## Entry Files

- `src/types/index.ts:198` — Imported by 59 external files.
- `src/utils/markdown.ts:30` — Imported by 14 external files.
- `src/utils/moduleLabel.ts:3` — Imported by 12 external files.
- `src/utils/docPaths.ts:5` — Imported by 11 external files.
- `src/utils/sourceText.ts:117` — Imported by 8 external files.

## Root Paths

- `src/types`
- `src/utils`

## Key Files

> **💡 What makes a file "key"?**
>
> Key files are the ones other files import from most often within this area. They're the highest-leverage files to read.

- `src/types/index.ts`
- `src/utils/markdown.ts`
- `src/utils/moduleLabel.ts`
- `src/utils/docPaths.ts`
- `src/utils/sourceText.ts`
- `src/utils/summaryExcerpt.ts`
- `src/utils/routeCoverage.ts`
- `src/utils/consumers.ts`

## Module Connections

- `utils (src/utils) → types (src/types)` (4 imports)

## Area Flows

## Flows In

- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` → `Shared support: types (src/types) + utils (src/utils)` (121 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` → `Shared support: types (src/types) + utils (src/utils)` (25 imports)
- `Core application logic: storage (src/storage)` → `Shared support: types (src/types) + utils (src/utils)` (3 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Shared support: types (src/types) + utils (src/utils)` (1 imports)


## Flows Out

- `Shared support: types (src/types) + utils (src/utils)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)


## Consumers

## Runtime Consumers

- `src/docs/generateFlowDocs.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` (11 imports into this area)
- `src/docs/generateArchitectureDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (10 imports into this area)
- `src/docs/generateModuleDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` (10 imports into this area)
- `src/docs/generateAgentContextDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` (9 imports into this area)
- `src/docs/generateIndexDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (9 imports into this area)
- `src/docs/generateAreaDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` (8 imports into this area)
- `src/ai/contextPacks.ts` -> `src/types/index.ts`, `src/utils/consumers.ts`, `src/utils/fs.ts`, `src/utils/moduleLabel.ts` (5 imports into this area)
- `src/docs/generateAgentsMd.ts` -> `src/types/index.ts`, `src/utils/docPaths.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts` (5 imports into this area)


## Test Consumers

_No test consumers detected._


## Common Change Paths

- `Read the module entry files first` -> `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts` - These are the strongest module starting points. (evidence: `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/docs/generateFlowDocs.ts`, `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts` - These runtime-like files depend on the module boundary. (evidence: `src/docs/generateFlowDocs.ts`, `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`)
- `Change module implementation files together` -> `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`)

## Change Guidance

- `src/types/index.ts:198` — A file that exposes behavior used elsewhere. [Symbols: SymbolKind@1, SymbolRecord@10, FileRecord@17, GraphEdge@27]
- `src/ai/contextPacks.ts:59` — A directly connected implementation file. [Symbols: buildProjectContextPack@23, buildAreaContextPack@59, buildModuleContextPack@123, buildRouteContextPack@176]
- `src/knowledge/moduleFocus.ts:18` — A directly connected implementation file. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/utils/markdown.ts:30` — A file that exposes behavior used elsewhere. [Symbols: list@1, code@6, heading@10, pluralize@16]
- `src/ai/summaryFormat.ts:74` — A directly connected implementation file. [Symbols: AiSummaryDraft@4, parseSummaryDraft@26, aiSummaryBody@74, renderSummaryMarkdown@78]
- `src/ai/types.ts:6` — A directly connected implementation file. [Symbols: AiRuntimeOptions@6, ContextFile@14, ContextRelation@18, ContextFlow@24]
- `src/scanner/scanRepo.ts:64` — A directly connected implementation file. [Symbols: scanRepo@64]
- `src/ai/buildSummaries.ts:17` — A directly connected implementation file. [Symbols: SummaryBuildInput@11, buildRepoSummaries@17, logSynthesisCoverage@193]

## Verification

- Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json)
- Inspect related tests: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2 - These tests cover files in the area. (evidence: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2)

## Related Tests

- `test/aiBuildSummaries.test.ts:2` covers `src/ai/buildSummaries.ts`, `src/types/index.ts`
- `test/areaFlows.test.ts:2` covers `src/knowledge/areaFlows.ts`, `src/knowledge/moduleAreas.ts`, `src/types/index.ts`
- `test/buildGraph.test.ts:2` covers `src/graph/buildGraph.ts`, `src/types/index.ts`
- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/contextPacks.test.ts:2` covers `src/ai/contextPacks.ts`, `src/types/index.ts`
- `test/detectDesignSystem.test.ts:2` covers `src/scanner/detectDesignSystem.ts`, `src/types/index.ts`
- `test/detectEnvVars.test.ts:2` covers `src/scanner/detectEnvVars.ts`, `src/types/index.ts`
- `test/detectModules.test.ts:2` covers `src/scanner/detectModules.ts`, `src/types/index.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/diagrams.test.ts:2` covers `src/diagrams/generateDiagrams.ts`, `src/types/index.ts`
- `test/fileImportance.test.ts:2` covers `src/knowledge/fileImportance.ts`, `src/types/index.ts`
- `test/generateDocs.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateIndexDoc.ts`, `src/docs/generateModuleDoc.ts`, `src/docs/generateQualityDoc.ts`, `src/types/index.ts`
- `test/moduleAreas.test.ts:2` covers `src/knowledge/moduleAreas.ts`, `src/types/index.ts`
- `test/packageManager.test.ts:2` covers `src/utils/packageManager.ts`
- `test/sourceText.test.ts:2` covers `src/utils/sourceText.ts`
- `test/summaries.test.ts:2` covers `src/knowledge/buildSummaries.ts`, `src/types/index.ts`
- `test/summaryExcerpt.test.ts:2` covers `src/utils/summaryExcerpt.ts`
- `test/update.test.ts:2` covers `src/commands/update.ts`, `src/types/index.ts`

## Related Routes

_No related routes detected._

## Files

- `src/types/index.ts`
- `src/utils/changePaths.ts`
- `src/utils/changeTargets.ts`
- `src/utils/consumers.ts`
- `src/utils/docPaths.ts`
- `src/utils/fs.ts`
- `src/utils/hashing.ts`
- `src/utils/insightRenderer.ts`
- `src/utils/markdown.ts`
- `src/utils/moduleLabel.ts`
- `src/utils/packageManager.ts`
- `src/utils/paths.ts`
- `src/utils/routeCoverage.ts`
- `src/utils/sourceText.ts`
- `src/utils/summaryExcerpt.ts`
- `src/utils/testCoverage.ts`

## Navigation

- [Areas index](index.md)
- [Repo wiki index](../index.md)
- [Flow overview](../flows/index.md)
