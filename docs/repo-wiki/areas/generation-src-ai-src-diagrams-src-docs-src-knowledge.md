# Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more

## Purpose

Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).

## Summary

Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge). Modules: ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge). Root paths: src/ai, src/diagrams, src/docs, src/knowledge. Entry files: src/ai/contextPacks.ts:57, src/knowledge/moduleFocus.ts:18, src/ai/types.ts:6. Runtime consumers: src/commands/update.ts -> src/ai/buildSummaries.ts, src/ai/contextPacks.ts, src/commands/generate.ts -> src/ai/buildSummaries.ts, src/ai/types.ts, src/commands/synthesize.ts -> src/ai/buildSummaries.ts, src/ai/types.ts. Test consumers: test/generateDocs.test.ts -> src/docs/generateAgentContextDoc.ts, src/docs/generateArchitectureDoc.ts, test/knowledge.test.ts -> src/knowledge/areaOrdering.ts, src/knowledge/buildKnowledge.ts. Incoming area flows: Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Core application logic: storage (src/storage) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Core application logic: graph (src/graph) + scanner (src/scanner) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Outgoing area flows: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more -> Shared support: types (src/types) + utils (src/utils). Common change paths: Read the module entry files first: src/ai/contextPacks.ts, src/knowledge/moduleFocus.ts, src/ai/types.ts - These are the strongest module starting points. (evidence: src/ai/contextPacks.ts, src/knowledge/moduleFocus.ts, src/ai/types.ts); Inspect runtime consumers before changing shared code: src/commands/update.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/update.ts, src/ai/buildSummaries.ts, src/ai/contextPacks.ts); Review test consumers before changing behavior: test/generateDocs.test.ts, src/docs/generateAgentContextDoc.ts, src/docs/generateArchitectureDoc.ts - These tests show expected behavior around the module boundary. (evidence: test/generateDocs.test.ts, src/docs/generateAgentContextDoc.ts, src/docs/generateArchitectureDoc.ts). Verification: Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json) Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json) Inspect related tests: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2 - These tests cover files in the area. (evidence: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2)

## Modules

- [ai (src/ai)](../modules/src-ai.md) - 6 files
- [diagrams (src/diagrams)](../modules/src-diagrams.md) - 1 file
- [docs (src/docs)](../modules/src-docs.md) - 13 files
- [knowledge (src/knowledge)](../modules/src-knowledge.md) - 10 files

## Entry Files

- `src/ai/contextPacks.ts:57` - Imported by 5 external files.
- `src/knowledge/moduleFocus.ts:18` - Imported by 3 external files.
- `src/ai/types.ts:6` - Imported by 5 external files.
- `src/ai/buildSummaries.ts:8` - Imported by 5 external files.
- `src/docs/writeDocs.ts:28` - Imported by 4 external files.

## Root Paths

- `src/ai`
- `src/diagrams`
- `src/docs`
- `src/knowledge`

## Key Files

- `src/knowledge/moduleFocus.ts`
- `src/knowledge/areaOrdering.ts`
- `src/knowledge/areaFlows.ts`
- `src/ai/contextPacks.ts`
- `src/ai/types.ts`
- `src/knowledge/verification.ts`
- `src/knowledge/changeTargets.ts`
- `src/knowledge/moduleAreas.ts`

## Module Connections

- `ai (src/ai) -> knowledge (src/knowledge)` (13 imports)
- `docs (src/docs) -> diagrams (src/diagrams)` (2 imports)
- `docs (src/docs) -> knowledge (src/knowledge)` (33 imports)

## Area Flows In

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (12 imports)
- `Core application logic: storage (src/storage)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)
- `Shared support: types (src/types) + utils (src/utils)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)

## Area Flows Out

- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (110 imports)

## Runtime Consumers

- `src/commands/update.ts` -> `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts`, `src/docs/writeDocs.ts` (4 imports into this area)
- `src/commands/generate.ts` -> `src/ai/buildSummaries.ts`, `src/ai/types.ts`, `src/docs/writeDocs.ts` (3 imports into this area)
- `src/commands/synthesize.ts` -> `src/ai/buildSummaries.ts`, `src/ai/types.ts`, `src/docs/writeDocs.ts` (3 imports into this area)
- `src/storage/metadataStore.ts` -> `src/ai/contextPacks.ts`, `src/knowledge/buildKnowledge.ts`, `src/knowledge/buildSummaries.ts` (3 imports into this area)
- `src/commands/review.ts` -> `src/ai/buildSummaries.ts`, `src/docs/writeDocs.ts` (2 imports into this area)
- `src/scanner/scanRepo.ts` -> `src/knowledge/buildKnowledge.ts`, `src/knowledge/moduleAreas.ts` (2 imports into this area)

## Test Consumers

- `test/generateDocs.test.ts` -> `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts` (8 imports into this area)
- `test/knowledge.test.ts` -> `src/knowledge/areaOrdering.ts`, `src/knowledge/buildKnowledge.ts`, `src/knowledge/moduleFocus.ts` (3 imports into this area)

## Common Change Paths

- `Read the module entry files first` -> `src/ai/contextPacks.ts`, `src/knowledge/moduleFocus.ts`, `src/ai/types.ts`, `src/ai/buildSummaries.ts` - These are the strongest module starting points. (evidence: `src/ai/contextPacks.ts`, `src/knowledge/moduleFocus.ts`, `src/ai/types.ts`, `src/ai/buildSummaries.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/update.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/update.ts`, `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/types.ts`)
- `Review test consumers before changing behavior` -> `test/generateDocs.test.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts` - These tests show expected behavior around the module boundary. (evidence: `test/generateDocs.test.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`)
- `Change module implementation files together` -> `src/ai/contextPacks.ts`, `src/knowledge/moduleFocus.ts`, `src/ai/types.ts`, `src/ai/buildSummaries.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/ai/buildSummaries.ts`, `src/ai/contextPacks.ts`, `src/ai/openaiCompatibleProvider.ts`, `src/ai/prompt.ts`)

## Change Guidance

- `src/knowledge/moduleFocus.ts:18` - A connected implementation file with both imports and exports. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/ai/contextPacks.ts:57` - A connected implementation file with both imports and exports. [Symbols: buildProjectContextPack@22, buildAreaContextPack@57, buildModuleContextPack@121, buildRouteContextPack@174]
- `src/scanner/scanRepo.ts:61` - A directly connected implementation file. [Symbols: scanRepo@61]
- `src/storage/metadataStore.ts:99` - A directly connected implementation file. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]
- `src/knowledge/areaOrdering.ts:24` - A connected implementation file with both imports and exports. [Symbols: orderedAreas@11, areaRoleRank@24]
- `src/knowledge/moduleAreas.ts:30` - A connected implementation file with both imports and exports. [Symbols: detectModuleAreas@30]
- `src/docs/generateFlowDocs.ts:18` - A connected implementation file with both imports and exports. [Symbols: generateFlowsIndexDoc@18, generateModuleFlowDoc@86]
- `src/knowledge/buildSummaries.ts:11` - A connected implementation file with both imports and exports. [Symbols: buildDeterministicSummaries@11]

## Verification

- Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json)
- Inspect related tests: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2 - These tests cover files in the area. (evidence: test/agentsMd.test.ts:2, test/aiBuildSummaries.test.ts:2, test/aiPrompt.test.ts:2)

## Related Tests

- `test/agentsMd.test.ts:2` covers `src/docs/generateAgentsMd.ts`
- `test/aiBuildSummaries.test.ts:2` covers `src/ai/buildSummaries.ts`, `src/types/index.ts`
- `test/aiPrompt.test.ts:2` covers `src/ai/prompt.ts`, `src/ai/types.ts`
- `test/aiSummaryFormat.test.ts:2` covers `src/ai/summaryFormat.ts`
- `test/areaFlows.test.ts:2` covers `src/knowledge/areaFlows.ts`, `src/knowledge/moduleAreas.ts`, `src/types/index.ts`
- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/contextPacks.test.ts:2` covers `src/ai/contextPacks.ts`, `src/types/index.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/diagrams.test.ts:2` covers `src/diagrams/generateDiagrams.ts`, `src/types/index.ts`
- `test/fileImportance.test.ts:2` covers `src/knowledge/fileImportance.ts`, `src/types/index.ts`
- `test/generateDocs.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateIndexDoc.ts`, `src/docs/generateModuleDoc.ts`, `src/docs/generateQualityDoc.ts`, `src/types/index.ts`
- `test/knowledge.test.ts:5` covers `src/knowledge/areaOrdering.ts`, `src/knowledge/buildKnowledge.ts`, `src/knowledge/moduleFocus.ts`, `src/scanner/scanRepo.ts`
- `test/metadataArtifacts.test.ts:5` covers `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts`
- `test/moduleAreas.test.ts:2` covers `src/knowledge/moduleAreas.ts`, `src/types/index.ts`
- `test/openaiCompatibleProvider.test.ts:2` covers `src/ai/openaiCompatibleProvider.ts`, `src/ai/types.ts`
- `test/summaries.test.ts:2` covers `src/knowledge/buildSummaries.ts`, `src/types/index.ts`

## Related Routes

_No related routes detected._

## Files

- `src/ai/buildSummaries.ts`
- `src/ai/contextPacks.ts`
- `src/ai/openaiCompatibleProvider.ts`
- `src/ai/prompt.ts`
- `src/ai/summaryFormat.ts`
- `src/ai/types.ts`
- `src/diagrams/generateDiagrams.ts`
- `src/docs/generateAgentContextDoc.ts`
- `src/docs/generateAgentsMd.ts`
- `src/docs/generateArchitectureDoc.ts`
- `src/docs/generateAreaDoc.ts`
- `src/docs/generateAreasIndexDoc.ts`
- `src/docs/generateCodexReviewDoc.ts`
- `src/docs/generateFlowDocs.ts`
- `src/docs/generateIndexDoc.ts`
- `src/docs/generateModuleDoc.ts`
- `src/docs/generateQualityDoc.ts`
- `src/docs/generateSetupDoc.ts`
- `src/docs/repoWikiCli.ts`
- `src/docs/writeDocs.ts`
- `src/knowledge/areaFlows.ts`
- `src/knowledge/areaFocus.ts`
- `src/knowledge/areaOrdering.ts`
- `src/knowledge/buildKnowledge.ts`
- `src/knowledge/buildSummaries.ts`
- `src/knowledge/changeTargets.ts`
- `src/knowledge/fileImportance.ts`
- `src/knowledge/moduleAreas.ts`
- `src/knowledge/moduleFocus.ts`
- `src/knowledge/verification.ts`

## Navigation

- [Areas index](index.md)
- [Repo wiki index](../index.md)
- [Flow overview](../flows/index.md)

## Notes

- This page groups modules that appear to belong to the same functional area.
- Use the linked module pages for file-level details.
- Use the flow overview for cross-area movement.
