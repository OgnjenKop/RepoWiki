# Shared support: types (src/types) + utils (src/utils)

## Purpose

Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils).

## Summary

Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils). Root paths: src/types, src/utils. Entry files: src/types/index.ts:162, src/utils/markdown.ts:6, src/utils/moduleLabel.ts:3. Runtime consumers: src/docs/generateFlowDocs.ts -> src/types/index.ts, src/utils/changePaths.ts, src/docs/generateAgentContextDoc.ts -> src/types/index.ts, src/utils/changePaths.ts, src/docs/generateArchitectureDoc.ts -> src/types/index.ts, src/utils/changePaths.ts. Incoming area flows: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more -> Shared support: types (src/types) + utils (src/utils), Core application logic: graph (src/graph) + scanner (src/scanner) -> Shared support: types (src/types) + utils (src/utils), Core application logic: storage (src/storage) -> Shared support: types (src/types) + utils (src/utils). Outgoing area flows: Shared support: types (src/types) + utils (src/utils) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Common change paths: Read the module entry files first: src/types/index.ts, src/utils/markdown.ts, src/utils/moduleLabel.ts - These are the strongest module starting points. (evidence: src/types/index.ts, src/utils/markdown.ts, src/utils/moduleLabel.ts); Inspect runtime consumers before changing shared code: src/docs/generateFlowDocs.ts, src/types/index.ts, src/utils/changePaths.ts - These runtime-like files depend on the module boundary. (evidence: src/docs/generateFlowDocs.ts, src/types/index.ts, src/utils/changePaths.ts); Change module implementation files together: src/types/index.ts, src/utils/markdown.ts, src/utils/moduleLabel.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/types/index.ts, src/utils/changePaths.ts, src/utils/changeTargets.ts). Verification: Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json) Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json) Inspect related tests: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2 - These tests cover files in the area. (evidence: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2)

## Modules

- [types (src/types)](../modules/src-types.md) - 1 file
- [utils (src/utils)](../modules/src-utils.md) - 14 files

## Entry Files

- `src/types/index.ts:162` - Imported by 51 external files.
- `src/utils/markdown.ts:6` - Imported by 12 external files.
- `src/utils/moduleLabel.ts:3` - Imported by 12 external files.
- `src/utils/docPaths.ts:5` - Imported by 11 external files.
- `src/utils/routeCoverage.ts:9` - Imported by 8 external files.

## Root Paths

- `src/types`
- `src/utils`

## Key Files

- `src/types/index.ts`
- `src/utils/markdown.ts`
- `src/utils/moduleLabel.ts`
- `src/utils/docPaths.ts`
- `src/utils/summaryExcerpt.ts`
- `src/utils/routeCoverage.ts`
- `src/utils/consumers.ts`
- `src/utils/changePaths.ts`

## Module Connections

- `utils (src/utils) -> types (src/types)` (4 imports)

## Area Flows In

- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (110 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Shared support: types (src/types) + utils (src/utils)` (20 imports)
- `Core application logic: storage (src/storage)` -> `Shared support: types (src/types) + utils (src/utils)` (3 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Shared support: types (src/types) + utils (src/utils)` (1 imports)

## Area Flows Out

- `Shared support: types (src/types) + utils (src/utils)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)

## Runtime Consumers

- `src/docs/generateFlowDocs.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` (11 imports into this area)
- `src/docs/generateAgentContextDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` (9 imports into this area)
- `src/docs/generateArchitectureDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (9 imports into this area)
- `src/docs/generateModuleDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` (9 imports into this area)
- `src/docs/generateAreaDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` (8 imports into this area)
- `src/docs/generateIndexDoc.ts` -> `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (8 imports into this area)
- `src/ai/contextPacks.ts` -> `src/types/index.ts`, `src/utils/consumers.ts`, `src/utils/fs.ts`, `src/utils/moduleLabel.ts` (5 imports into this area)
- `src/docs/generateAgentsMd.ts` -> `src/types/index.ts`, `src/utils/docPaths.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts` (5 imports into this area)

## Test Consumers

_No test consumers detected._

## Common Change Paths

- `Read the module entry files first` -> `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts` - These are the strongest module starting points. (evidence: `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/docs/generateFlowDocs.ts`, `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts` - These runtime-like files depend on the module boundary. (evidence: `src/docs/generateFlowDocs.ts`, `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`)
- `Change module implementation files together` -> `src/types/index.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/types/index.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`)

## Change Guidance

- `src/types/index.ts:162` - A file that exposes behavior used elsewhere. [Symbols: SymbolKind@1, SymbolRecord@10, FileRecord@17, GraphEdge@27]
- `src/knowledge/moduleFocus.ts:18` - A directly connected implementation file. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/ai/contextPacks.ts:57` - A directly connected implementation file. [Symbols: buildProjectContextPack@22, buildAreaContextPack@57, buildModuleContextPack@121, buildRouteContextPack@174]
- `src/scanner/scanRepo.ts:61` - A directly connected implementation file. [Symbols: scanRepo@61]
- `src/storage/metadataStore.ts:99` - A directly connected implementation file. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]
- `src/knowledge/areaOrdering.ts:24` - A directly connected implementation file. [Symbols: orderedAreas@11, areaRoleRank@24]
- `src/knowledge/moduleAreas.ts:30` - A directly connected implementation file. [Symbols: detectModuleAreas@30]
- `src/docs/generateFlowDocs.ts:18` - A directly connected implementation file. [Symbols: generateFlowsIndexDoc@18, generateModuleFlowDoc@86]

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

## Notes

- This page groups modules that appear to belong to the same functional area.
- Use the linked module pages for file-level details.
- Use the flow overview for cross-area movement.
