# utils

**Navigation:** [Wiki](../index.md) → [Modules](../index.md#modules) → utils

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Files** | **Entry files** | **Exports** | **Tests** |
| 15 | 5 | 45 | 4 |
| in `src/utils` | imported by others | public API | covering files |

## What This Module Does

Likely provides shared filesystem, hashing, markdown, and path helpers. 15 files belong to this module. Main files: src/utils/changePaths.ts, src/utils/changeTargets.ts, src/utils/consumers.ts, src/utils/docPaths.ts. Entry files: src/utils/markdown.ts:30, src/utils/moduleLabel.ts:3, src/utils/docPaths.ts:5. Module areas: Shared support: types (src/types) + utils (src/utils). Exported symbols include formatChangePath (src/utils/changePaths.ts:4), formatChangeTargetSymbols (src/utils/changeTargets.ts:3), renderConsumerList (src/utils/consumers.ts:11), splitConsumers (src/utils/consumers.ts:4), areaDocFileName (src/utils/docPaths.ts:5), sanitizeDocFragment (src/utils/docPaths.ts:1), pathExists (src/utils/fs.ts:4), readJson (src/utils/fs.ts:13). Used by: src/ai/contextPacks.ts, src/ai/prompt.ts, src/ai/summaryCache.ts, src/ai/summaryFormat.ts. Runtime consumers: src/docs/generateFlowDocs.ts -> src/utils/changePaths.ts, src/utils/changeTargets.ts, src/docs/generateArchitectureDoc.ts -> src/utils/changePaths.ts, src/utils/consumers.ts, src/docs/generateModuleDoc.ts -> src/utils/changePaths.ts, src/utils/changeTargets.ts. Common change paths: Read the module entry files first: src/utils/markdown.ts, src/utils/moduleLabel.ts, src/utils/docPaths.ts - These are the strongest module starting points. (evidence: src/utils/markdown.ts, src/utils/moduleLabel.ts, src/utils/docPaths.ts); Inspect runtime consumers before changing shared code: src/docs/generateFlowDocs.ts, src/utils/changePaths.ts, src/utils/changeTargets.ts - These runtime-like files depend on the module boundary. (evidence: src/docs/generateFlowDocs.ts, src/utils/changePaths.ts, src/utils/changeTargets.ts); Change module implementation files together: src/utils/markdown.ts, src/utils/moduleLabel.ts, src/utils/docPaths.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/utils/changePaths.ts, src/utils/changeTargets.ts, src/utils/consumers.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/cli.e2e.test.ts:8, test/packageManager.test.ts:2, test/sourceText.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/cli.e2e.test.ts:8, test/packageManager.test.ts:2, test/sourceText.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/utils/changePaths.ts -> src/utils/markdown.ts.



> **ℹ️ Module path**
>
> `src/utils` contains 15 files. Open the path in your editor to see them all.

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

- `src/utils/markdown.ts:30` — Imported by 14 external files.
- `src/utils/moduleLabel.ts:3` — Imported by 12 external files.
- `src/utils/docPaths.ts:5` — Imported by 11 external files.
- `src/utils/sourceText.ts:117` — Imported by 8 external files.
- `src/utils/consumers.ts:11` — Imported by 8 external files.

## Main Files

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

## Exported Symbols

> **ℹ️ Public API**
>
> These are the symbols other modules import. Changes here may break consumers — check [Consumers](#consumers) before editing.

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
- `renderArchitectureStory` from `src/utils/insightRenderer.ts:28`
- `renderModuleInsight` from `src/utils/insightRenderer.ts:87`
- `renderOnboardingGuide` from `src/utils/insightRenderer.ts:56`
- `renderProjectNarrative` from `src/utils/insightRenderer.ts:4`
- `breadcrumbs` from `src/utils/markdown.ts:30`
- `callout` from `src/utils/markdown.ts:36`
- `code` from `src/utils/markdown.ts:6`
- `command` from `src/utils/markdown.ts:76`
- `fileRef` from `src/utils/markdown.ts:80`
- `heading` from `src/utils/markdown.ts:10`
- `keyValue` from `src/utils/markdown.ts:71`
- `linkCard` from `src/utils/markdown.ts:67`
- `list` from `src/utils/markdown.ts:1`
- `pluralize` from `src/utils/markdown.ts:16`
- `relativePath` from `src/utils/markdown.ts:85`
- `section` from `src/utils/markdown.ts:63`
- `statCards` from `src/utils/markdown.ts:46`
- `tableOfContents` from `src/utils/markdown.ts:20`
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

## Dependencies

> **ℹ️ Internal vs external**
>
> Internal dependencies are imports from other files in this module. External dependencies are npm packages or other outside code.

## Internal Dependencies

- `src/utils/changePaths.ts` → `src/utils/markdown.ts`
- `src/utils/consumers.ts` → `src/utils/markdown.ts`
- `src/utils/insightRenderer.ts` → `src/utils/markdown.ts`


## External Dependencies

- `node:crypto`
- `node:fs/promises`
- `node:path`


## Consumers

> **ℹ️ Runtime vs test consumers**
>
> Runtime consumers are other source files that import this module. Test consumers are test files that exercise it. Both matter: runtime changes affect behavior, test changes affect coverage.

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


## Common Change Paths

- `Read the module entry files first` -> `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts`, `src/utils/sourceText.ts` - These are the strongest module starting points. (evidence: `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts`, `src/utils/sourceText.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/docs/generateFlowDocs.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts` - These runtime-like files depend on the module boundary. (evidence: `src/docs/generateFlowDocs.ts`, `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`)
- `Change module implementation files together` -> `src/utils/markdown.ts`, `src/utils/moduleLabel.ts`, `src/utils/docPaths.ts`, `src/utils/sourceText.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/utils/changePaths.ts`, `src/utils/changeTargets.ts`, `src/utils/consumers.ts`, `src/utils/docPaths.ts`)

## Related Tests

- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/packageManager.test.ts:2` covers `src/utils/packageManager.ts`
- `test/sourceText.test.ts:2` covers `src/utils/sourceText.ts`
- `test/summaryExcerpt.test.ts:2` covers `src/utils/summaryExcerpt.ts`

## Change Guidance

- `src/ai/contextPacks.ts:59` — A directly connected implementation file. [Symbols: buildProjectContextPack@23, buildAreaContextPack@59, buildModuleContextPack@123, buildRouteContextPack@176]
- `src/knowledge/moduleFocus.ts:18` — A directly connected implementation file. [Symbols: ModuleEntryFile@5, ModuleConsumer@11, ContextChangePath@18, selectModuleEntryFiles@25]
- `src/utils/markdown.ts:30` — A file that exposes behavior used elsewhere. [Symbols: list@1, code@6, heading@10, pluralize@16]
- `src/ai/summaryFormat.ts:74` — A directly connected implementation file. [Symbols: AiSummaryDraft@4, parseSummaryDraft@26, aiSummaryBody@74, renderSummaryMarkdown@78]
- `src/scanner/scanRepo.ts:64` — A directly connected implementation file. [Symbols: scanRepo@64]

## Decision Points

- Start with `src/ai/contextPacks.ts:59` if you are changing public behavior.
- Use `src/knowledge/moduleFocus.ts:18` as the next stop for supporting logic.
- Check `test/cli.e2e.test.ts:8` before changing implementation details.


## Verification

- Related tests: `test/cli.e2e.test.ts:8`, `test/packageManager.test.ts:2`, `test/sourceText.test.ts:2`, `test/summaryExcerpt.test.ts:2`
- Run: `npm run test`

> **❗ Before you commit**
>
> After editing this module, regenerate the wiki with `repowiki update` so the docs stay accurate.

## Notes For AI Agents

- Start by reading the entry files listed above.
- Treat the purpose summary as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
