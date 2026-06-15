# Knowledge

## Purpose

Likely derives evidence-backed repository knowledge, summaries, and change guidance. 10 files belong to this module. Main files: src/knowledge/areaFlows.ts, src/knowledge/areaFocus.ts, src/knowledge/areaOrdering.ts, src/knowledge/buildKnowledge.ts. Entry files: src/knowledge/moduleFocus.ts:18, src/knowledge/areaOrdering.ts:24, src/knowledge/areaFlows.ts:3. Module areas: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Exported symbols include AreaFlowRecord (src/knowledge/areaFlows.ts:3), buildAreaFlows (src/knowledge/areaFlows.ts:11), AreaConsumer (src/knowledge/areaFocus.ts:9), AreaEntryFile (src/knowledge/areaFocus.ts:3), selectAreaConsumers (src/knowledge/areaFocus.ts:73), selectAreaEntryFiles (src/knowledge/areaFocus.ts:16), areaRoleRank (src/knowledge/areaOrdering.ts:24), orderedAreas (src/knowledge/areaOrdering.ts:11). Used by: src/ai/buildSummaries.ts, src/ai/contextPacks.ts, src/ai/prompt.ts, src/ai/summaryFormat.ts. Runtime consumers: src/ai/contextPacks.ts -> src/knowledge/areaFlows.ts, src/knowledge/areaFocus.ts, src/docs/generateAgentContextDoc.ts -> src/knowledge/areaFlows.ts, src/knowledge/areaOrdering.ts, src/docs/generateArchitectureDoc.ts -> src/knowledge/areaFlows.ts, src/knowledge/areaOrdering.ts. Test consumers: test/knowledge.test.ts -> src/knowledge/areaOrdering.ts, src/knowledge/buildKnowledge.ts. Common change paths: Read the module entry files first: src/knowledge/moduleFocus.ts, src/knowledge/areaOrdering.ts, src/knowledge/areaFlows.ts - These are the strongest module starting points. (evidence: src/knowledge/moduleFocus.ts, src/knowledge/areaOrdering.ts, src/knowledge/areaFlows.ts); Inspect runtime consumers before changing shared code: src/ai/contextPacks.ts, src/knowledge/areaFlows.ts, src/knowledge/areaFocus.ts - These runtime-like files depend on the module boundary. (evidence: src/ai/contextPacks.ts, src/knowledge/areaFlows.ts, src/knowledge/areaFocus.ts); Change module implementation files together: src/knowledge/moduleFocus.ts, src/knowledge/areaOrdering.ts, src/knowledge/areaFlows.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/knowledge/areaFlows.ts, src/knowledge/areaFocus.ts, src/knowledge/areaOrdering.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/areaFlows.test.ts:2, test/fileImportance.test.ts:2, test/knowledge.test.ts:5 - These tests exercise module behavior or its direct targets. (evidence: test/areaFlows.test.ts:2, test/fileImportance.test.ts:2, test/knowledge.test.ts:5) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/knowledge/areaOrdering.ts -> src/knowledge/areaFlows.ts.

## Module Path

`src/knowledge`

## Module Areas

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).

## Area Summaries

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…

## Entry Files

- `src/knowledge/moduleFocus.ts:18` - Imported by 12 external files.
- `src/knowledge/areaOrdering.ts:24` - Imported by 12 external files.
- `src/knowledge/areaFlows.ts:3` - Imported by 9 external files.
- `src/knowledge/verification.ts:177` - Imported by 7 external files.
- `src/knowledge/changeTargets.ts:15` - Imported by 5 external files.

## Main Files

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

## Exported Symbols

- `AreaFlowRecord` from `src/knowledge/areaFlows.ts:3`
- `buildAreaFlows` from `src/knowledge/areaFlows.ts:11`
- `AreaConsumer` from `src/knowledge/areaFocus.ts:9`
- `AreaEntryFile` from `src/knowledge/areaFocus.ts:3`
- `selectAreaConsumers` from `src/knowledge/areaFocus.ts:73`
- `selectAreaEntryFiles` from `src/knowledge/areaFocus.ts:16`
- `areaRoleRank` from `src/knowledge/areaOrdering.ts:24`
- `orderedAreas` from `src/knowledge/areaOrdering.ts:11`
- `buildKnowledge` from `src/knowledge/buildKnowledge.ts:7`
- `buildDeterministicSummaries` from `src/knowledge/buildSummaries.ts:11`
- `selectModuleChangeTargets` from `src/knowledge/changeTargets.ts:15`
- `selectProjectChangeTargets` from `src/knowledge/changeTargets.ts:5`
- `selectRouteChangeTargets` from `src/knowledge/changeTargets.ts:27`
- `rankImportantFiles` from `src/knowledge/fileImportance.ts:4`
- `selectCentralFiles` from `src/knowledge/fileImportance.ts:59`
- `selectModuleFocusFiles` from `src/knowledge/fileImportance.ts:52`
- `selectProjectFocusFiles` from `src/knowledge/fileImportance.ts:40`
- `detectModuleAreas` from `src/knowledge/moduleAreas.ts:30`
- `ContextChangePath` from `src/knowledge/moduleFocus.ts:18`
- `ModuleConsumer` from `src/knowledge/moduleFocus.ts:11`
- `ModuleEntryFile` from `src/knowledge/moduleFocus.ts:5`
- `selectModuleChangePaths` from `src/knowledge/moduleFocus.ts:221`
- `selectModuleConsumers` from `src/knowledge/moduleFocus.ts:82`
- `selectModuleEntryFiles` from `src/knowledge/moduleFocus.ts:25`
- `selectProjectChangePaths` from `src/knowledge/moduleFocus.ts:161`
- `selectProjectConsumers` from `src/knowledge/moduleFocus.ts:140`
- `selectProjectEntryFiles` from `src/knowledge/moduleFocus.ts:105`
- `selectRouteChangePaths` from `src/knowledge/moduleFocus.ts:256`
- `VerificationHint` from `src/knowledge/verification.ts:4`
- `formatVerificationHint` from `src/knowledge/verification.ts:177`
- `selectAreaVerificationHints` from `src/knowledge/verification.ts:127`
- `selectModuleVerificationHints` from `src/knowledge/verification.ts:48`
- `selectProjectVerificationHints` from `src/knowledge/verification.ts:12`
- `selectRouteVerificationHints` from `src/knowledge/verification.ts:83`

## Internal Dependencies

- `src/knowledge/areaOrdering.ts` -> `src/knowledge/areaFlows.ts`
- `src/knowledge/buildKnowledge.ts` -> `src/knowledge/areaOrdering.ts`
- `src/knowledge/buildSummaries.ts` -> `src/knowledge/areaFlows.ts`
- `src/knowledge/buildSummaries.ts` -> `src/knowledge/areaFocus.ts`
- `src/knowledge/buildSummaries.ts` -> `src/knowledge/areaOrdering.ts`
- `src/knowledge/buildSummaries.ts` -> `src/knowledge/moduleFocus.ts`
- `src/knowledge/buildSummaries.ts` -> `src/knowledge/verification.ts`
- `src/knowledge/changeTargets.ts` -> `src/knowledge/fileImportance.ts`
- `src/knowledge/fileImportance.ts` -> `src/knowledge/moduleFocus.ts`
- `src/knowledge/moduleFocus.ts` -> `src/knowledge/areaOrdering.ts`

## External Dependencies

_None detected._

## Runtime Consumers

- `src/ai/contextPacks.ts` -> `src/knowledge/areaFlows.ts`, `src/knowledge/areaFocus.ts`, `src/knowledge/areaOrdering.ts`, `src/knowledge/changeTargets.ts` (7 imports into this module)
- `src/docs/generateAgentContextDoc.ts` -> `src/knowledge/areaFlows.ts`, `src/knowledge/areaOrdering.ts`, `src/knowledge/changeTargets.ts`, `src/knowledge/fileImportance.ts` (5 imports into this module)
- `src/docs/generateArchitectureDoc.ts` -> `src/knowledge/areaFlows.ts`, `src/knowledge/areaOrdering.ts`, `src/knowledge/fileImportance.ts`, `src/knowledge/moduleFocus.ts` (5 imports into this module)
- `src/docs/generateAreaDoc.ts` -> `src/knowledge/areaFlows.ts`, `src/knowledge/areaFocus.ts`, `src/knowledge/changeTargets.ts`, `src/knowledge/moduleFocus.ts` (5 imports into this module)
- `src/docs/generateFlowDocs.ts` -> `src/knowledge/areaFlows.ts`, `src/knowledge/areaOrdering.ts`, `src/knowledge/changeTargets.ts`, `src/knowledge/moduleFocus.ts` (5 imports into this module)
- `src/docs/generateIndexDoc.ts` -> `src/knowledge/areaFlows.ts`, `src/knowledge/areaOrdering.ts`, `src/knowledge/moduleFocus.ts`, `src/knowledge/verification.ts` (4 imports into this module)
- `src/docs/generateModuleDoc.ts` -> `src/knowledge/areaOrdering.ts`, `src/knowledge/changeTargets.ts`, `src/knowledge/moduleFocus.ts` (3 imports into this module)

## Test Consumers

- `test/knowledge.test.ts` -> `src/knowledge/areaOrdering.ts`, `src/knowledge/buildKnowledge.ts`, `src/knowledge/moduleFocus.ts` (3 imports into this module)

## Common Change Paths

- `Read the module entry files first` -> `src/knowledge/moduleFocus.ts`, `src/knowledge/areaOrdering.ts`, `src/knowledge/areaFlows.ts`, `src/knowledge/verification.ts` - These are the strongest module starting points. (evidence: `src/knowledge/moduleFocus.ts`, `src/knowledge/areaOrdering.ts`, `src/knowledge/areaFlows.ts`, `src/knowledge/verification.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/ai/contextPacks.ts`, `src/knowledge/areaFlows.ts`, `src/knowledge/areaFocus.ts`, `src/knowledge/areaOrdering.ts` - These runtime-like files depend on the module boundary. (evidence: `src/ai/contextPacks.ts`, `src/knowledge/areaFlows.ts`, `src/knowledge/areaFocus.ts`, `src/knowledge/areaOrdering.ts`)
- `Change module implementation files together` -> `src/knowledge/moduleFocus.ts`, `src/knowledge/areaOrdering.ts`, `src/knowledge/areaFlows.ts`, `src/knowledge/verification.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/knowledge/areaFlows.ts`, `src/knowledge/areaFocus.ts`, `src/knowledge/areaOrdering.ts`, `src/knowledge/buildKnowledge.ts`)

## Related Tests

- `test/areaFlows.test.ts:2` covers `src/knowledge/areaFlows.ts`, `src/knowledge/moduleAreas.ts`, `src/types/index.ts`
- `test/fileImportance.test.ts:2` covers `src/knowledge/fileImportance.ts`, `src/types/index.ts`
- `test/knowledge.test.ts:5` covers `src/knowledge/areaOrdering.ts`, `src/knowledge/buildKnowledge.ts`, `src/knowledge/moduleFocus.ts`, `src/scanner/scanRepo.ts`
- `test/moduleAreas.test.ts:2` covers `src/knowledge/moduleAreas.ts`, `src/types/index.ts`
- `test/summaries.test.ts:2` covers `src/knowledge/buildSummaries.ts`, `src/types/index.ts`

## Change Guidance

- `src/knowledge/moduleFocus.ts:18` - A connected implementation file with both imports and exports. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/ai/contextPacks.ts:57` - A directly connected implementation file. [Symbols: buildProjectContextPack@22, buildAreaContextPack@57, buildModuleContextPack@121, buildRouteContextPack@174]
- `src/scanner/scanRepo.ts:61` - A directly connected implementation file. [Symbols: scanRepo@61]
- `src/storage/metadataStore.ts:99` - A directly connected implementation file. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]
- `src/knowledge/areaOrdering.ts:24` - A connected implementation file with both imports and exports. [Symbols: orderedAreas@11, areaRoleRank@24]

## Decision Points

- Start with `src/knowledge/moduleFocus.ts:18` if you are changing public behavior.
- Use `src/ai/contextPacks.ts:57` as the next stop for supporting logic.
- Check `test/areaFlows.test.ts:2` before changing implementation details.

## Verification

- Related tests: `test/areaFlows.test.ts:2`, `test/fileImportance.test.ts:2`, `test/knowledge.test.ts:5`, `test/moduleAreas.test.ts:2`, `test/summaries.test.ts:2`
- Run: `npm run test`

## Notes For AI Agents

- Start by reading the main files listed above.
- Treat the purpose as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
