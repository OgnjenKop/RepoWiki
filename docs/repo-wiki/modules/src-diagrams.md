# diagrams

**Navigation:** [Wiki](../index.md) → [Modules](../index.md#modules) → diagrams

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Files** | **Entry files** | **Exports** | **Tests** |
| 1 | 1 | 4 | 1 |
| in `src/diagrams` | imported by others | public API | covering files |

## What This Module Does

Likely generates repository diagrams and flow visuals. 1 file belong to this module. Main files: src/diagrams/generateDiagrams.ts. Entry files: src/diagrams/generateDiagrams.ts:35. Module areas: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Exported symbols include generateLayeredDiagram (src/diagrams/generateDiagrams.ts:35), generateModuleDiagram (src/diagrams/generateDiagrams.ts:4), generateRouteDiagram (src/diagrams/generateDiagrams.ts:20), generateTestCoverageDiagram (src/diagrams/generateDiagrams.ts:53). Used by: src/docs/generateArchitectureDoc.ts, src/docs/writeDocs.ts, test/diagrams.test.ts. Runtime consumers: src/docs/generateArchitectureDoc.ts -> src/diagrams/generateDiagrams.ts, src/docs/writeDocs.ts -> src/diagrams/generateDiagrams.ts. Test consumers: test/diagrams.test.ts -> src/diagrams/generateDiagrams.ts. Common change paths: Read the module entry files first: src/diagrams/generateDiagrams.ts - These are the strongest module starting points. (evidence: src/diagrams/generateDiagrams.ts); Inspect runtime consumers before changing shared code: src/docs/generateArchitectureDoc.ts, src/diagrams/generateDiagrams.ts, src/docs/writeDocs.ts - These runtime-like files depend on the module boundary. (evidence: src/docs/generateArchitectureDoc.ts, src/diagrams/generateDiagrams.ts, src/docs/writeDocs.ts); Review test consumers before changing behavior: test/diagrams.test.ts, src/diagrams/generateDiagrams.ts - These tests show expected behavior around the module boundary. (evidence: test/diagrams.test.ts, src/diagrams/generateDiagrams.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/diagrams.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/diagrams.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)



> **ℹ️ Module path**
>
> `src/diagrams` contains 1 file. Open the path in your editor to see them all.

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

- `src/diagrams/generateDiagrams.ts:35` — Imported by 3 external files.

## Main Files

- `src/diagrams/generateDiagrams.ts`

## Exported Symbols

> **ℹ️ Public API**
>
> These are the symbols other modules import. Changes here may break consumers — check [Consumers](#consumers) before editing.

- `generateLayeredDiagram` from `src/diagrams/generateDiagrams.ts:35`
- `generateModuleDiagram` from `src/diagrams/generateDiagrams.ts:4`
- `generateRouteDiagram` from `src/diagrams/generateDiagrams.ts:20`
- `generateTestCoverageDiagram` from `src/diagrams/generateDiagrams.ts:53`

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

- `src/docs/generateArchitectureDoc.ts` -> `src/diagrams/generateDiagrams.ts` (1 imports into this module)
- `src/docs/writeDocs.ts` -> `src/diagrams/generateDiagrams.ts` (1 imports into this module)


## Test Consumers

- `test/diagrams.test.ts` -> `src/diagrams/generateDiagrams.ts` (1 imports into this module)


## Common Change Paths

- `Read the module entry files first` -> `src/diagrams/generateDiagrams.ts` - These are the strongest module starting points. (evidence: `src/diagrams/generateDiagrams.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/docs/generateArchitectureDoc.ts`, `src/diagrams/generateDiagrams.ts`, `src/docs/writeDocs.ts` - These runtime-like files depend on the module boundary. (evidence: `src/docs/generateArchitectureDoc.ts`, `src/diagrams/generateDiagrams.ts`, `src/docs/writeDocs.ts`)
- `Review test consumers before changing behavior` -> `test/diagrams.test.ts`, `src/diagrams/generateDiagrams.ts` - These tests show expected behavior around the module boundary. (evidence: `test/diagrams.test.ts`, `src/diagrams/generateDiagrams.ts`)
- `Change module implementation files together` -> `src/diagrams/generateDiagrams.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/writeDocs.ts`, `test/diagrams.test.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/diagrams/generateDiagrams.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/writeDocs.ts`, `test/diagrams.test.ts`)

## Related Tests

- `test/diagrams.test.ts:2` covers `src/diagrams/generateDiagrams.ts`, `src/types/index.ts`

## Change Guidance

- `src/docs/generateArchitectureDoc.ts:19` — A directly connected implementation file. [Symbols: generateArchitectureDoc@19]
- `src/docs/writeDocs.ts:30` — A directly connected implementation file. [Symbols: writeDocs@30]
- `src/diagrams/generateDiagrams.ts:35` — A connected implementation file with both imports and exports. [Symbols: generateModuleDiagram@4, generateRouteDiagram@20, generateLayeredDiagram@35, generateTestCoverageDiagram@53]
- `test/diagrams.test.ts:2` — Tests that verify this area. (Update the test expectations if behavior changes.)

## Decision Points

- Start with `src/docs/generateArchitectureDoc.ts:19` if you are changing public behavior.
- Use `src/docs/writeDocs.ts:30` as the next stop for supporting logic.
- Check `test/diagrams.test.ts:2` before changing implementation details.


## Verification

- Related tests: `test/diagrams.test.ts:2`
- Run: `npm run test`

> **❗ Before you commit**
>
> After editing this module, regenerate the wiki with `repowiki update` so the docs stay accurate.

## Notes For AI Agents

- Start by reading the entry files listed above.
- Treat the purpose summary as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
