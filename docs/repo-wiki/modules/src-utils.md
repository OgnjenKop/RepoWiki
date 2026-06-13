# Utils

## Purpose

Likely provides shared filesystem, hashing, markdown, and path helpers. 14 files belong to this module. Main files: src/utils/changePaths.ts, src/utils/changeTargets.ts, src/utils/consumers.ts, src/utils/docPaths.ts. Entry files: src/utils/moduleLabel.ts:3, src/utils/markdown.ts:6, src/utils/docPaths.ts:5. Module areas: Shared support: types (src/types) + utils (src/utils). Exported symbols include formatChangePath (src/utils/changePaths.ts:4), formatChangeTargetSymbols (src/utils/changeTargets.ts:3), renderConsumerList (src/utils/consumers.ts:11), splitConsumers (src/utils/consumers.ts:4), areaDocFileName (src/utils/docPaths.ts:5), sanitizeDocFragment (src/utils/docPaths.ts:1), pathExists (src/utils/fs.ts:4), readJson (src/utils/fs.ts:13). Used by: src/ai/contextPacks.ts, src/ai/prompt.ts, src/ai/summaryFormat.ts, src/diagrams/generateDiagrams.ts. Runtime consumers: src/docs/generateFlowDocs.ts -> src/utils/changePaths.ts, src/utils/changeTargets.ts, src/docs/generateAgentContextDoc.ts -> src/utils/changePaths.ts, src/utils/changeTargets.ts, src/docs/generateArchitectureDoc.ts -> src/utils/changePaths.ts, src/utils/consumers.ts. Common change paths: Read the module entry files first: src/utils/moduleLabel.ts, src/utils/markdown.ts, src/utils/docPaths.ts - These are the strongest module starting points. (evidence: src/utils/moduleLabel.ts, src/utils/markdown.ts, src/utils/docPaths.ts); Inspect runtime consumers before changing shared code: src/docs/generateFlowDocs.ts, src/utils/changePaths.ts, src/utils/changeTargets.ts - These runtime-like files depend on the module boundary. (evidence: src/docs/generateFlowDocs.ts, src/utils/changePaths.ts, src/utils/changeTargets.ts); Change module implementation files together: src/utils/moduleLabel.ts, src/utils/markdown.ts, src/utils/docPaths.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/utils/changePaths.ts, src/utils/changeTargets.ts, src/utils/consumers.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/cli.e2e.test.ts:8, test/packageManager.test.ts:2, test/sourceText.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/cli.e2e.test.ts:8, test/packageManager.test.ts:2, test/sourceText.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/utils/changePaths.ts -> src/utils/markdown.ts.

## Module Path

`src/utils`

## Module Areas

- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils).

## Area Summaries

- [Shared support: types (src/types) + utils (src/utils)](../areas/support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…

## Entry Files

- `src/utils/moduleLabel.ts:3` - Imported by 12 external files.
- `src/utils/markdown.ts:6` - Imported by 11 external files.
- `src/utils/docPaths.ts:5` - Imported by 11 external files.
- `src/utils/consumers.ts:11` - Imported by 8 external files.
- `src/utils/changePaths.ts:4` - Imported by 8 external files.

## Main Files

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

## Exported Symbols

- `formatChangePath` from `src/utils/changePaths.ts:4`
- `formatChangeTargetSymbols` from `src/utils/changeTargets.ts:3`
- `renderConsumerList` from `src/utils/consumers.ts:11`
- `splitConsumers` from `src/utils/consumers.ts:4`
- `areaDocFileName` from `src/utils/docPaths.ts:5`
- `sanitizeDocFragment` from `src/utils/docPaths.ts:1`
- `pathExists` from `src/utils/fs.ts:4`
- `readJson` from `src/utils/fs.ts:13`
- `writeJson` from `src/utils/fs.ts:22`
- `writeText` from `src/utils/fs.ts:27`
- `hashContent` from `src/utils/hashing.ts:3`
- `code` from `src/utils/markdown.ts:6`
- `heading` from `src/utils/markdown.ts:10`
- `list` from `src/utils/markdown.ts:1`
- `pluralize` from `src/utils/markdown.ts:16`
- `moduleLabel` from `src/utils/moduleLabel.ts:3`
- `installCommand` from `src/utils/packageManager.ts:1`
- `scriptCommand` from `src/utils/packageManager.ts:8`
- `normalizeRelative` from `src/utils/paths.ts:7`
- `slugify` from `src/utils/paths.ts:11`
- `toPosixPath` from `src/utils/paths.ts:3`
- `routeCoverageDescriptor` from `src/utils/routeCoverage.ts:9`
- `routeCoverageLabel` from `src/utils/routeCoverage.ts:5`
- `lineNumberAtIndex` from `src/utils/sourceText.ts:117`
- `stripComments` from `src/utils/sourceText.ts:1`
- `stripCommentsAndStrings` from `src/utils/sourceText.ts:81`
- `summaryExcerpt` from `src/utils/summaryExcerpt.ts:1`
- `CoverageLike` from `src/utils/testCoverage.ts:5`
- `TestCoverageConfidence` from `src/utils/testCoverage.ts:3`
- `testCoverageLabel` from `src/utils/testCoverage.ts:20`
- `testCoveragePrefix` from `src/utils/testCoverage.ts:7`

## Internal Dependencies

- `src/utils/changePaths.ts` -> `src/utils/markdown.ts`
- `src/utils/consumers.ts` -> `src/utils/markdown.ts`

## External Dependencies

- `node:crypto`
- `node:fs/promises`
- `node:path`

## Runtime Consumers

- `src/docs/generateFlowDocs.ts` -> `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (10 imports into this module)
- `src/docs/generateAgentContextDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (8 imports into this module)
- `src/docs/generateArchitectureDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts`, `src/utils/markdown.ts` (8 imports into this module)
- `src/docs/generateModuleDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts` (8 imports into this module)
- `src/docs/generateAreaDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/markdown.ts` (7 imports into this module)
- `src/docs/generateIndexDoc.ts` -> `src/utils/changePaths.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts`, `src/utils/markdown.ts` (7 imports into this module)
- `src/ai/contextPacks.ts` -> `src/utils/consumers.ts`, `src/utils/fs.ts`, `src/utils/moduleLabel.ts`, `src/utils/routeCoverage.ts` (4 imports into this module)
- `src/docs/generateAgentsMd.ts` -> `src/utils/docPaths.ts`, `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/summaryExcerpt.ts` (4 imports into this module)

## Test Consumers

_No test consumers detected._

## Common Change Paths

- `Read the module entry files first` -> `src/utils/moduleLabel.ts`, `src/utils/markdown.ts`, `src/utils/docPaths.ts`, `src/utils/consumers.ts` - These are the strongest module starting points. (evidence: `src/utils/moduleLabel.ts`, `src/utils/markdown.ts`, `src/utils/docPaths.ts`, `src/utils/consumers.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/docs/generateFlowDocs.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` - These runtime-like files depend on the module boundary. (evidence: `src/docs/generateFlowDocs.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`)
- `Change module implementation files together` -> `src/utils/moduleLabel.ts`, `src/utils/markdown.ts`, `src/utils/docPaths.ts`, `src/utils/consumers.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts`)

## Related Tests

- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/packageManager.test.ts:2` covers `src/utils/packageManager.ts`
- `test/sourceText.test.ts:2` covers `src/utils/sourceText.ts`
- `test/summaryExcerpt.test.ts:2` covers `src/utils/summaryExcerpt.ts`

## Change Guidance

- `src/knowledge/moduleFocus.ts:18` - A directly connected implementation file. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/ai/contextPacks.ts:56` - A directly connected implementation file. [Symbols: buildProjectContextPack@21, buildAreaContextPack@56, buildModuleContextPack@120, buildRouteContextPack@173]
- `src/scanner/scanRepo.ts:49` - A directly connected implementation file. [Symbols: scanRepo@49]
- `src/storage/metadataStore.ts:98` - A directly connected implementation file. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]
- `src/knowledge/moduleAreas.ts:30` - A directly connected implementation file. [Symbols: detectModuleAreas@30]

## Decision Points

- Start with `src/knowledge/moduleFocus.ts:18` if you are changing public behavior.
- Use `src/ai/contextPacks.ts:56` as the next stop for supporting logic.
- Check `test/cli.e2e.test.ts:8` before changing implementation details.

## Verification

- Related tests: `test/cli.e2e.test.ts:8`, `test/packageManager.test.ts:2`, `test/sourceText.test.ts:2`, `test/summaryExcerpt.test.ts:2`
- Run: `npm run test`

## Notes For AI Agents

- Start by reading the main files listed above.
- Treat the purpose as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
