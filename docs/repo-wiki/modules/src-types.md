# types

**Navigation:** [Wiki](../index.md) → [Modules](../index.md#modules) → types

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Files** | **Entry files** | **Exports** | **Tests** |
| 1 | 1 | 30 | 14 |
| in `src/types` | imported by others | public API | covering files |

## What This Module Does

Likely defines shared records for files, graphs, summaries, tests, and change targets. 1 file belong to this module. Main files: src/types/index.ts. Entry files: src/types/index.ts:198. Module areas: Shared support: types (src/types) + utils (src/utils). Exported symbols include ChangeSet (src/types/index.ts:198), ChangeTarget (src/types/index.ts:151), ChangeTargetSymbol (src/types/index.ts:159), CodeGraph (src/types/index.ts:106), ComponentFramework (src/types/index.ts:74), ComponentRecord (src/types/index.ts:76), DesignSystemRecord (src/types/index.ts:97), DesignTokenCategory (src/types/index.ts:86). Used by: src/ai/buildInsights.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts, src/ai/summaryCache.ts. Runtime consumers: src/ai/buildInsights.ts -> src/types/index.ts, src/ai/buildSummaries.ts -> src/types/index.ts, src/ai/contextPacks.ts -> src/types/index.ts. Common change paths: Read the module entry files first: src/types/index.ts - These are the strongest module starting points. (evidence: src/types/index.ts); Inspect runtime consumers before changing shared code: src/ai/buildInsights.ts, src/types/index.ts, src/ai/buildSummaries.ts - These runtime-like files depend on the module boundary. (evidence: src/ai/buildInsights.ts, src/types/index.ts, src/ai/buildSummaries.ts); Change module implementation files together: src/types/index.ts, src/ai/buildInsights.ts, src/ai/buildSummaries.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/types/index.ts, src/ai/buildInsights.ts, src/ai/buildSummaries.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)



> **ℹ️ Module path**
>
> `src/types` contains 1 file. Open the path in your editor to see them all.

## How It Fits In

## Module Areas

- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) — Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils).


## Area Summaries

- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) — Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…


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

- `src/types/index.ts:198` — Imported by 63 external files.

## Main Files

- `src/types/index.ts`

## Exported Symbols

> **ℹ️ Public API**
>
> These are the symbols other modules import. Changes here may break consumers — check [Consumers](#consumers) before editing.

- `ChangeSet` from `src/types/index.ts:198`
- `ChangeTarget` from `src/types/index.ts:151`
- `ChangeTargetSymbol` from `src/types/index.ts:159`
- `CodeGraph` from `src/types/index.ts:106`
- `ComponentFramework` from `src/types/index.ts:74`
- `ComponentRecord` from `src/types/index.ts:76`
- `DesignSystemRecord` from `src/types/index.ts:97`
- `DesignTokenCategory` from `src/types/index.ts:86`
- `DesignTokenRecord` from `src/types/index.ts:88`
- `EnvVarRecord` from `src/types/index.ts:60`
- `EvidenceRef` from `src/types/index.ts:145`
- `FileHashes` from `src/types/index.ts:196`
- `FileRecord` from `src/types/index.ts:17`
- `GraphEdge` from `src/types/index.ts:27`
- `KnowledgeItem` from `src/types/index.ts:166`
- `KnowledgeKind` from `src/types/index.ts:164`
- `ModuleAreaRecord` from `src/types/index.ts:41`
- `ModuleRecord` from `src/types/index.ts:33`
- `PathAlias` from `src/types/index.ts:140`
- `ProjectInfo` from `src/types/index.ts:119`
- `RepoKnowledge` from `src/types/index.ts:175`
- `RepoScan` from `src/types/index.ts:131`
- `RepoSummaries` from `src/types/index.ts:189`
- `RepoWikiIndex` from `src/types/index.ts:204`
- `RouteRecord` from `src/types/index.ts:50`
- `SummaryProvider` from `src/types/index.ts:179`
- `SummaryRecord` from `src/types/index.ts:181`
- `SymbolKind` from `src/types/index.ts:1`
- `SymbolRecord` from `src/types/index.ts:10`
- `TestRecord` from `src/types/index.ts:66`

## Dependencies

> **ℹ️ Internal vs external**
>
> Internal dependencies are imports from other files in this module. External dependencies are npm packages or other outside code.

## Internal Dependencies

_No internal dependencies._


## External Dependencies

_No external dependencies._


## Consumers

> **ℹ️ Runtime vs test consumers**
>
> Runtime consumers are other source files that import this module. Test consumers are test files that exercise it. Both matter: runtime changes affect behavior, test changes affect coverage.

## Runtime Consumers

- `src/ai/buildInsights.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/ai/buildSummaries.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/ai/contextPacks.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/ai/summaryCache.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/ai/types.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/commands/update.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/diagrams/generateDiagrams.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/docs/generateAgentContextDoc.ts` -> `src/types/index.ts` (1 imports into this module)


## Test Consumers

_No test consumers detected._


## Common Change Paths

- `Read the module entry files first` -> `src/types/index.ts` - These are the strongest module starting points. (evidence: `src/types/index.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/ai/buildInsights.ts`, `src/types/index.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts` - These runtime-like files depend on the module boundary. (evidence: `src/ai/buildInsights.ts`, `src/types/index.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`)
- `Change module implementation files together` -> `src/types/index.ts`, `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/types/index.ts`, `src/ai/buildInsights.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`)

## Related Tests

- `test/aiBuildSummaries.test.ts:2` covers `src/ai/buildSummaries.ts`, `src/types/index.ts`
- `test/areaFlows.test.ts:2` covers `src/knowledge/areaFlows.ts`, `src/knowledge/moduleAreas.ts`, `src/types/index.ts`
- `test/buildGraph.test.ts:2` covers `src/graph/buildGraph.ts`, `src/types/index.ts`
- `test/contextPacks.test.ts:2` covers `src/ai/contextPacks.ts`, `src/types/index.ts`
- `test/detectDesignSystem.test.ts:2` covers `src/scanner/detectDesignSystem.ts`, `src/types/index.ts`
- `test/detectEnvVars.test.ts:2` covers `src/scanner/detectEnvVars.ts`, `src/types/index.ts`
- `test/detectModules.test.ts:2` covers `src/scanner/detectModules.ts`, `src/types/index.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/diagrams.test.ts:2` covers `src/diagrams/generateDiagrams.ts`, `src/types/index.ts`
- `test/fileImportance.test.ts:2` covers `src/knowledge/fileImportance.ts`, `src/types/index.ts`
- `test/generateDocs.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateIndexDoc.ts`, `src/docs/generateModuleDoc.ts`, `src/docs/generateQualityDoc.ts`, `src/types/index.ts`
- `test/moduleAreas.test.ts:2` covers `src/knowledge/moduleAreas.ts`, `src/types/index.ts`
- `test/summaries.test.ts:2` covers `src/knowledge/buildSummaries.ts`, `src/types/index.ts`
- `test/update.test.ts:2` covers `src/commands/update.ts`, `src/types/index.ts`

## Change Guidance

- `src/types/index.ts:198` — A file that exposes behavior used elsewhere. [Symbols: SymbolKind@1, SymbolRecord@10, FileRecord@17, GraphEdge@27]
- `src/ai/contextPacks.ts:59` — A directly connected implementation file. [Symbols: buildProjectContextPack@23, buildAreaContextPack@59, buildModuleContextPack@123, buildRouteContextPack@176]
- `src/knowledge/moduleFocus.ts:18` — A directly connected implementation file. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/ai/types.ts:6` — A directly connected implementation file. [Symbols: AiRuntimeOptions@6, ContextFile@14, ContextRelation@18, ContextFlow@24]
- `src/scanner/scanRepo.ts:64` — A directly connected implementation file. [Symbols: scanRepo@64]

## Decision Points

- Start with `src/types/index.ts:198` if you are changing public behavior.
- Use `src/ai/contextPacks.ts:59` as the next stop for supporting logic.
- Check `test/aiBuildSummaries.test.ts:2` before changing implementation details.


## Verification

- Related tests: `test/aiBuildSummaries.test.ts:2`, `test/areaFlows.test.ts:2`, `test/buildGraph.test.ts:2`, `test/contextPacks.test.ts:2`, `test/detectDesignSystem.test.ts:2`, `test/detectEnvVars.test.ts:2`, `test/detectModules.test.ts:2`, `test/detectTests.test.ts:2`, `test/diagrams.test.ts:2`, `test/fileImportance.test.ts:2`, `test/generateDocs.test.ts:2`, `test/moduleAreas.test.ts:2`, `test/summaries.test.ts:2`, `test/update.test.ts:2`
- Run: `npm run test`

> **❗ Before you commit**
>
> After editing this module, regenerate the wiki with `repowiki update` so the docs stay accurate.

## Notes For AI Agents

- Start by reading the entry files listed above.
- Treat the purpose summary as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
