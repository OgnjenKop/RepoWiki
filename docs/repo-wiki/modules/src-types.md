# Types

## Purpose

Likely defines shared records for files, graphs, summaries, tests, and change targets. 1 file belong to this module. Main files: src/types/index.ts. Entry files: src/types/index.ts:162. Module areas: Shared support: types (src/types) + utils (src/utils). Exported symbols include ChangeSet (src/types/index.ts:162), ChangeTarget (src/types/index.ts:115), ChangeTargetSymbol (src/types/index.ts:123), CodeGraph (src/types/index.ts:74), EnvVarRecord (src/types/index.ts:60), EvidenceRef (src/types/index.ts:109), FileHashes (src/types/index.ts:160), FileRecord (src/types/index.ts:17). Used by: src/ai/buildSummaries.ts, src/ai/contextPacks.ts, src/ai/types.ts, src/commands/update.ts. Runtime consumers: src/ai/buildSummaries.ts -> src/types/index.ts, src/ai/contextPacks.ts -> src/types/index.ts, src/ai/types.ts -> src/types/index.ts. Common change paths: Read the module entry files first: src/types/index.ts - These are the strongest module starting points. (evidence: src/types/index.ts); Inspect runtime consumers before changing shared code: src/ai/buildSummaries.ts, src/types/index.ts, src/ai/contextPacks.ts - These runtime-like files depend on the module boundary. (evidence: src/ai/buildSummaries.ts, src/types/index.ts, src/ai/contextPacks.ts); Change module implementation files together: src/types/index.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/types/index.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)

## Module Path

`src/types`

## Module Areas

- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils).

## Area Summaries

- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…

## Entry Files

- `src/types/index.ts:162` - Imported by 55 external files.

## Main Files

- `src/types/index.ts`

## Exported Symbols

- `ChangeSet` from `src/types/index.ts:162`
- `ChangeTarget` from `src/types/index.ts:115`
- `ChangeTargetSymbol` from `src/types/index.ts:123`
- `CodeGraph` from `src/types/index.ts:74`
- `EnvVarRecord` from `src/types/index.ts:60`
- `EvidenceRef` from `src/types/index.ts:109`
- `FileHashes` from `src/types/index.ts:160`
- `FileRecord` from `src/types/index.ts:17`
- `GraphEdge` from `src/types/index.ts:27`
- `KnowledgeItem` from `src/types/index.ts:130`
- `KnowledgeKind` from `src/types/index.ts:128`
- `ModuleAreaRecord` from `src/types/index.ts:41`
- `ModuleRecord` from `src/types/index.ts:33`
- `PathAlias` from `src/types/index.ts:104`
- `ProjectInfo` from `src/types/index.ts:84`
- `RepoKnowledge` from `src/types/index.ts:139`
- `RepoScan` from `src/types/index.ts:96`
- `RepoSummaries` from `src/types/index.ts:153`
- `RepoWikiIndex` from `src/types/index.ts:168`
- `RouteRecord` from `src/types/index.ts:50`
- `SummaryProvider` from `src/types/index.ts:143`
- `SummaryRecord` from `src/types/index.ts:145`
- `SymbolKind` from `src/types/index.ts:1`
- `SymbolRecord` from `src/types/index.ts:10`
- `TestRecord` from `src/types/index.ts:66`

## Internal Dependencies

_None detected._

## External Dependencies

_None detected._

## Runtime Consumers

- `src/ai/buildSummaries.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/ai/contextPacks.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/ai/types.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/commands/update.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/diagrams/generateDiagrams.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/docs/generateAgentContextDoc.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/docs/generateAgentsMd.ts` -> `src/types/index.ts` (1 imports into this module)
- `src/docs/generateArchitectureDoc.ts` -> `src/types/index.ts` (1 imports into this module)

## Test Consumers

_No test consumers detected._

## Common Change Paths

- `Read the module entry files first` -> `src/types/index.ts` - These are the strongest module starting points. (evidence: `src/types/index.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/ai/buildSummaries.ts`, `src/types/index.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts` - These runtime-like files depend on the module boundary. (evidence: `src/ai/buildSummaries.ts`, `src/types/index.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts`)
- `Change module implementation files together` -> `src/types/index.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/types/index.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts`)

## Related Tests

- `test/aiBuildSummaries.test.ts:2` covers `src/ai/buildSummaries.ts`, `src/types/index.ts`
- `test/areaFlows.test.ts:2` covers `src/knowledge/areaFlows.ts`, `src/knowledge/moduleAreas.ts`, `src/types/index.ts`
- `test/buildGraph.test.ts:2` covers `src/graph/buildGraph.ts`, `src/types/index.ts`
- `test/contextPacks.test.ts:2` covers `src/ai/contextPacks.ts`, `src/types/index.ts`
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

- `src/types/index.ts:162` - A file that exposes behavior used elsewhere. [Symbols: SymbolKind@1, SymbolRecord@10, FileRecord@17, GraphEdge@27]
- `src/knowledge/moduleFocus.ts:18` - A directly connected implementation file. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/ai/contextPacks.ts:56` - A directly connected implementation file. [Symbols: buildProjectContextPack@21, buildAreaContextPack@56, buildModuleContextPack@120, buildRouteContextPack@173]
- `src/scanner/scanRepo.ts:49` - A directly connected implementation file. [Symbols: scanRepo@49]
- `src/storage/metadataStore.ts:99` - A directly connected implementation file. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]

## Decision Points

- Start with `src/types/index.ts:162` if you are changing public behavior.
- Use `src/knowledge/moduleFocus.ts:18` as the next stop for supporting logic.
- Check `test/aiBuildSummaries.test.ts:2` before changing implementation details.

## Verification

- Related tests: `test/aiBuildSummaries.test.ts:2`, `test/areaFlows.test.ts:2`, `test/buildGraph.test.ts:2`, `test/contextPacks.test.ts:2`, `test/detectEnvVars.test.ts:2`, `test/detectModules.test.ts:2`, `test/detectTests.test.ts:2`, `test/diagrams.test.ts:2`, `test/fileImportance.test.ts:2`, `test/generateDocs.test.ts:2`, `test/moduleAreas.test.ts:2`, `test/summaries.test.ts:2`, `test/update.test.ts:2`
- Run: `npm run test`

## Notes For AI Agents

- Start by reading the main files listed above.
- Treat the purpose as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
