# docs

**Navigation:** [Wiki](../index.md) → [Modules](../index.md#modules) → docs

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Files** | **Entry files** | **Exports** | **Tests** |
| 15 | 5 | 19 | 3 |
| in `src/docs` | imported by others | public API | covering files |

## What This Module Does

Likely generates repository wiki pages, flow docs, and AGENTS.md instructions. 15 files belong to this module. Main files: src/docs/generateAgentContextDoc.ts, src/docs/generateAgentsMd.ts, src/docs/generateArchitectureDoc.ts, src/docs/generateAreaDoc.ts. Entry files: src/docs/writeDocs.ts:30, src/docs/generateAgentsMd.ts:14, src/docs/generateArchitectureDoc.ts:19. Module areas: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Exported symbols include generateAgentContextDoc (src/docs/generateAgentContextDoc.ts:18), generateAgentsSection (src/docs/generateAgentsMd.ts:14), mergeAgentsMd (src/docs/generateAgentsMd.ts:88), generateArchitectureDoc (src/docs/generateArchitectureDoc.ts:19), generateAreaDoc (src/docs/generateAreaDoc.ts:16), generateAreasIndexDoc (src/docs/generateAreasIndexDoc.ts:8), generateCodexReviewDoc (src/docs/generateCodexReviewDoc.ts:7), generateDesignDoc (src/docs/generateDesignDoc.ts:4). Used by: src/commands/generate.ts, src/commands/review.ts, src/commands/synthesize.ts, src/commands/update.ts. Runtime consumers: src/commands/generate.ts -> src/docs/writeDocs.ts, src/commands/review.ts -> src/docs/writeDocs.ts, src/commands/synthesize.ts -> src/docs/writeDocs.ts. Test consumers: test/generateDocs.test.ts -> src/docs/generateAgentContextDoc.ts, src/docs/generateArchitectureDoc.ts, test/agentsMd.test.ts -> src/docs/generateAgentsMd.ts, test/detectTests.test.ts -> src/docs/generateAgentsMd.ts. Common change paths: Read the module entry files first: src/docs/writeDocs.ts, src/docs/generateAgentsMd.ts, src/docs/generateArchitectureDoc.ts - These are the strongest module starting points. (evidence: src/docs/writeDocs.ts, src/docs/generateAgentsMd.ts, src/docs/generateArchitectureDoc.ts); Inspect runtime consumers before changing shared code: src/commands/generate.ts, src/docs/writeDocs.ts, src/commands/review.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/generate.ts, src/docs/writeDocs.ts, src/commands/review.ts); Review test consumers before changing behavior: test/generateDocs.test.ts, src/docs/generateAgentContextDoc.ts, src/docs/generateArchitectureDoc.ts - These tests show expected behavior around the module boundary. (evidence: test/generateDocs.test.ts, src/docs/generateAgentContextDoc.ts, src/docs/generateArchitectureDoc.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/agentsMd.test.ts:2, test/detectTests.test.ts:2, test/generateDocs.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/agentsMd.test.ts:2, test/detectTests.test.ts:2, test/generateDocs.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/docs/generateAgentContextDoc.ts -> src/docs/repoWikiCli.ts.



> **ℹ️ Module path**
>
> `src/docs` contains 15 files. Open the path in your editor to see them all.

## How It Fits In

## Module Areas

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).


## Area Summaries

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) — Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…


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

- `src/docs/writeDocs.ts:30` — Imported by 4 external files.
- `src/docs/generateAgentsMd.ts:14` — Imported by 2 external files.
- `src/docs/generateArchitectureDoc.ts:19` — Imported by 1 external file.
- `src/docs/generateAreaDoc.ts:16` — Imported by 1 external file.
- `src/docs/generateModuleDoc.ts:17` — Imported by 1 external file.

## Main Files

- `src/docs/generateAgentContextDoc.ts`
- `src/docs/generateAgentsMd.ts`
- `src/docs/generateArchitectureDoc.ts`
- `src/docs/generateAreaDoc.ts`
- `src/docs/generateAreasIndexDoc.ts`
- `src/docs/generateCodexReviewDoc.ts`
- `src/docs/generateDesignDoc.ts`
- `src/docs/generateDesignHtml.ts`
- `src/docs/generateFlowDocs.ts`
- `src/docs/generateIndexDoc.ts`
- `src/docs/generateModuleDoc.ts`
- `src/docs/generateQualityDoc.ts`
- `src/docs/generateSetupDoc.ts`
- `src/docs/repoWikiCli.ts`
- `src/docs/writeDocs.ts`

## Exported Symbols

> **ℹ️ Public API**
>
> These are the symbols other modules import. Changes here may break consumers — check [Consumers](#consumers) before editing.

- `generateAgentContextDoc` from `src/docs/generateAgentContextDoc.ts:18`
- `generateAgentsSection` from `src/docs/generateAgentsMd.ts:14`
- `mergeAgentsMd` from `src/docs/generateAgentsMd.ts:88`
- `generateArchitectureDoc` from `src/docs/generateArchitectureDoc.ts:19`
- `generateAreaDoc` from `src/docs/generateAreaDoc.ts:16`
- `generateAreasIndexDoc` from `src/docs/generateAreasIndexDoc.ts:8`
- `generateCodexReviewDoc` from `src/docs/generateCodexReviewDoc.ts:7`
- `generateDesignDoc` from `src/docs/generateDesignDoc.ts:4`
- `generateDesignHtml` from `src/docs/generateDesignHtml.ts:4`
- `generateFlowsIndexDoc` from `src/docs/generateFlowDocs.ts:18`
- `generateModuleFlowDoc` from `src/docs/generateFlowDocs.ts:98`
- `generateIndexDoc` from `src/docs/generateIndexDoc.ts:17`
- `generateModuleDoc` from `src/docs/generateModuleDoc.ts:17`
- `generateQualityDoc` from `src/docs/generateQualityDoc.ts:5`
- `generateSetupDoc` from `src/docs/generateSetupDoc.ts:5`
- `renderInstallCommand` from `src/docs/repoWikiCli.ts:30`
- `renderRepoWikiCommands` from `src/docs/repoWikiCli.ts:5`
- `renderRepoWikiFlags` from `src/docs/repoWikiCli.ts:18`
- `writeDocs` from `src/docs/writeDocs.ts:30`

## Dependencies

> **ℹ️ Internal vs external**
>
> Internal dependencies are imports from other files in this module. External dependencies are npm packages or other outside code.

## Internal Dependencies

- `src/docs/generateAgentContextDoc.ts` → `src/docs/repoWikiCli.ts`
- `src/docs/generateAgentsMd.ts` → `src/docs/repoWikiCli.ts`
- `src/docs/generateIndexDoc.ts` → `src/docs/repoWikiCli.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateAgentContextDoc.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateAgentsMd.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateArchitectureDoc.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateAreaDoc.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateAreasIndexDoc.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateCodexReviewDoc.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateDesignDoc.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateDesignHtml.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateFlowDocs.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateIndexDoc.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateModuleDoc.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateQualityDoc.ts`
- `src/docs/writeDocs.ts` → `src/docs/generateSetupDoc.ts`


## External Dependencies

- `node:fs/promises`
- `node:path`


## Consumers

> **ℹ️ Runtime vs test consumers**
>
> Runtime consumers are other source files that import this module. Test consumers are test files that exercise it. Both matter: runtime changes affect behavior, test changes affect coverage.

## Runtime Consumers

- `src/commands/generate.ts` -> `src/docs/writeDocs.ts` (1 imports into this module)
- `src/commands/review.ts` -> `src/docs/writeDocs.ts` (1 imports into this module)
- `src/commands/synthesize.ts` -> `src/docs/writeDocs.ts` (1 imports into this module)
- `src/commands/update.ts` -> `src/docs/writeDocs.ts` (1 imports into this module)


## Test Consumers

- `test/generateDocs.test.ts` -> `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts` (8 imports into this module)
- `test/agentsMd.test.ts` -> `src/docs/generateAgentsMd.ts` (1 imports into this module)
- `test/detectTests.test.ts` -> `src/docs/generateAgentsMd.ts` (1 imports into this module)


## Common Change Paths

- `Read the module entry files first` -> `src/docs/writeDocs.ts`, `src/docs/generateAgentsMd.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts` - These are the strongest module starting points. (evidence: `src/docs/writeDocs.ts`, `src/docs/generateAgentsMd.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/generate.ts`, `src/docs/writeDocs.ts`, `src/commands/review.ts`, `src/commands/synthesize.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/generate.ts`, `src/docs/writeDocs.ts`, `src/commands/review.ts`, `src/commands/synthesize.ts`)
- `Review test consumers before changing behavior` -> `test/generateDocs.test.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts` - These tests show expected behavior around the module boundary. (evidence: `test/generateDocs.test.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`)
- `Change module implementation files together` -> `src/docs/writeDocs.ts`, `src/docs/generateAgentsMd.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/docs/generateAgentContextDoc.ts`, `src/docs/generateAgentsMd.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`)

## Related Tests

- `test/agentsMd.test.ts:2` covers `src/docs/generateAgentsMd.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/generateDocs.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateIndexDoc.ts`, `src/docs/generateModuleDoc.ts`, `src/docs/generateQualityDoc.ts`, `src/types/index.ts`

## Change Guidance

- `src/docs/generateArchitectureDoc.ts:19` — A connected implementation file with both imports and exports. [Symbols: generateArchitectureDoc@19]
- `src/docs/writeDocs.ts:30` — A connected implementation file with both imports and exports. [Symbols: writeDocs@30]
- `src/docs/generateFlowDocs.ts:18` — A connected implementation file with both imports and exports. [Symbols: generateFlowsIndexDoc@18, generateModuleFlowDoc@98]
- `src/docs/generateAreaDoc.ts:16` — A connected implementation file with both imports and exports. [Symbols: generateAreaDoc@16]
- `src/docs/generateModuleDoc.ts:17` — A connected implementation file with both imports and exports. [Symbols: generateModuleDoc@17]

## Decision Points

- Start with `src/docs/generateArchitectureDoc.ts:19` if you are changing public behavior.
- Use `src/docs/writeDocs.ts:30` as the next stop for supporting logic.
- Check `test/agentsMd.test.ts:2` before changing implementation details.


## Verification

- Related tests: `test/agentsMd.test.ts:2`, `test/detectTests.test.ts:2`, `test/generateDocs.test.ts:2`
- Run: `npm run test`

> **❗ Before you commit**
>
> After editing this module, regenerate the wiki with `repowiki update` so the docs stay accurate.

## Notes For AI Agents

- Start by reading the entry files listed above.
- Treat the purpose summary as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
