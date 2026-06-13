# types Flow

`src/types`

## Overview

Likely defines shared records for files, graphs, summaries, tests, and change targets. 1 file belong to this module. Main files: src/types/index.ts. Entry files: src/types/index.ts:162. Module areas: Shared support: types (src/types) + utils (src/utils). Exported symbols include ChangeSet (src/types/index.ts:162), ChangeTarget (src/types/index.ts:115), ChangeTargetSymbol (src/types/index.ts:123), CodeGraph (src/types/index.ts:74), EnvVarRecord (src/types/index.ts:60), EvidenceRef (src/types/index.ts:109), FileHashes (src/types/index.ts:160), FileRecord (src/types/index.ts:17). Used by: src/ai/buildSummaries.ts, src/ai/contextPacks.ts, src/ai/types.ts, src/commands/update.ts. Runtime consumers: src/ai/buildSummaries.ts -> src/types/index.ts, src/ai/contextPacks.ts -> src/types/index.ts, src/ai/types.ts -> src/types/index.ts. Common change paths: Read the module entry files first: src/types/index.ts - These are the strongest module starting points. (evidence: src/types/index.ts); Inspect runtime consumers before changing shared code: src/ai/buildSummaries.ts, src/types/index.ts, src/ai/contextPacks.ts - These runtime-like files depend on the module boundary. (evidence: src/ai/buildSummaries.ts, src/types/index.ts, src/ai/contextPacks.ts); Change module implementation files together: src/types/index.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/types/index.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/aiBuildSummaries.test.ts:2, test/areaFlows.test.ts:2, test/buildGraph.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)

## Module Areas

- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils).

## Area Summaries

- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…

## Entry Files

- `src/types/index.ts:162` - Imported by 55 external files.

## Area Flows

- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Shared support: types (src/types) + utils (src/utils)` (20 imports)
- `Core application logic: storage (src/storage)` -> `Shared support: types (src/types) + utils (src/utils)` (3 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Shared support: types (src/types) + utils (src/utils)` (1 imports)
- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (110 imports)
- `Shared support: types (src/types) + utils (src/utils)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)

## Entry Points

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
- `src/ai/buildSummaries.ts` imports this module
- `src/ai/contextPacks.ts` imports this module
- `src/ai/types.ts` imports this module
- `src/commands/update.ts` imports this module
- `src/diagrams/generateDiagrams.ts` imports this module
- `src/docs/generateAgentContextDoc.ts` imports this module
- `src/docs/generateAgentsMd.ts` imports this module
- `src/docs/generateArchitectureDoc.ts` imports this module
- `src/docs/generateAreaDoc.ts` imports this module
- `src/docs/generateAreasIndexDoc.ts` imports this module
- `src/docs/generateCodexReviewDoc.ts` imports this module
- `src/docs/generateFlowDocs.ts` imports this module
- `src/docs/generateIndexDoc.ts` imports this module
- `src/docs/generateModuleDoc.ts` imports this module
- `src/docs/generateQualityDoc.ts` imports this module
- `src/docs/generateSetupDoc.ts` imports this module
- `src/docs/repoWikiCli.ts` imports this module
- `src/docs/writeDocs.ts` imports this module
- `src/graph/buildGraph.ts` imports this module
- `src/knowledge/areaFlows.ts` imports this module
- `src/knowledge/areaFocus.ts` imports this module
- `src/knowledge/areaOrdering.ts` imports this module
- `src/knowledge/buildKnowledge.ts` imports this module
- `src/knowledge/buildSummaries.ts` imports this module
- `src/knowledge/changeTargets.ts` imports this module
- `src/knowledge/fileImportance.ts` imports this module
- `src/knowledge/moduleAreas.ts` imports this module
- `src/knowledge/moduleFocus.ts` imports this module
- `src/knowledge/verification.ts` imports this module
- `src/scanner/detectEnvVars.ts` imports this module
- `src/scanner/detectModules.ts` imports this module
- `src/scanner/detectPathAliases.ts` imports this module
- `src/scanner/detectProject.ts` imports this module
- `src/scanner/detectRoutes.ts` imports this module
- `src/scanner/detectTests.ts` imports this module
- `src/scanner/parseFiles.ts` imports this module
- `src/scanner/scanRepo.ts` imports this module
- `src/storage/metadataStore.ts` imports this module
- `src/utils/changeTargets.ts` imports this module
- `src/utils/moduleLabel.ts` imports this module
- `src/utils/routeCoverage.ts` imports this module
- `src/utils/testCoverage.ts` imports this module
- `test/aiBuildSummaries.test.ts` imports this module
- `test/areaFlows.test.ts` imports this module
- `test/buildGraph.test.ts` imports this module
- `test/contextPacks.test.ts` imports this module
- `test/detectEnvVars.test.ts` imports this module
- `test/detectModules.test.ts` imports this module
- `test/detectTests.test.ts` imports this module
- `test/diagrams.test.ts` imports this module
- `test/fileImportance.test.ts` imports this module
- `test/generateDocs.test.ts` imports this module
- `test/moduleAreas.test.ts` imports this module
- `test/summaries.test.ts` imports this module
- `test/update.test.ts` imports this module

## Common Change Paths

- `Read the module entry files first` -> `src/types/index.ts` - These are the strongest module starting points. (evidence: `src/types/index.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/ai/buildSummaries.ts`, `src/types/index.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts` - These runtime-like files depend on the module boundary. (evidence: `src/ai/buildSummaries.ts`, `src/types/index.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts`)
- `Change module implementation files together` -> `src/types/index.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/types/index.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts`)

## Module Connections

- `types (src/types) <- ai (src/ai)` (3 imports)
- `types (src/types) <- commands (src/commands)`
- `types (src/types) <- diagrams (src/diagrams)`
- `types (src/types) <- docs (src/docs)` (13 imports)
- `types (src/types) <- graph (src/graph)`
- `types (src/types) <- knowledge (src/knowledge)` (10 imports)
- `types (src/types) <- scanner (src/scanner)` (8 imports)
- `types (src/types) <- storage (src/storage)`
- `types (src/types) <- utils (src/utils)` (4 imports)

## Internal Flow

_No internal module-to-module flow detected._

## External Dependencies

_No external dependencies detected._

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

## Change Targets

- `src/types/index.ts:162` - A file that exposes behavior used elsewhere. [Symbols: SymbolKind@1, SymbolRecord@10, FileRecord@17, GraphEdge@27]
- `src/knowledge/moduleFocus.ts:18` - A directly connected implementation file. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/ai/contextPacks.ts:56` - A directly connected implementation file. [Symbols: buildProjectContextPack@21, buildAreaContextPack@56, buildModuleContextPack@120, buildRouteContextPack@173]
- `src/scanner/scanRepo.ts:49` - A directly connected implementation file. [Symbols: scanRepo@49]
- `src/knowledge/areaOrdering.ts:24` - A directly connected implementation file. [Symbols: orderedAreas@11, areaRoleRank@24]

## Verification

- Run: `npm run build`
- Related tests: `test/aiBuildSummaries.test.ts:2`, `test/areaFlows.test.ts:2`, `test/buildGraph.test.ts:2`, `test/contextPacks.test.ts:2`, `test/detectEnvVars.test.ts:2`, `test/detectModules.test.ts:2`, `test/detectTests.test.ts:2`, `test/diagrams.test.ts:2`, `test/fileImportance.test.ts:2`, `test/generateDocs.test.ts:2`, `test/moduleAreas.test.ts:2`, `test/summaries.test.ts:2`, `test/update.test.ts:2`
- Run: `npm run test`
