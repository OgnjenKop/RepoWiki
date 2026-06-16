# graph

**Navigation:** [Wiki](../index.md) → [Modules](../index.md#modules) → graph

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Files** | **Entry files** | **Exports** | **Tests** |
| 1 | 1 | 1 | 1 |
| in `src/graph` | imported by others | public API | covering files |

## What This Module Does

Likely builds the repository import graph and route relationships. 1 file belong to this module. Main files: src/graph/buildGraph.ts. Entry files: src/graph/buildGraph.ts:4. Module areas: Core application logic: graph (src/graph) + scanner (src/scanner). Exported symbols include buildGraph (src/graph/buildGraph.ts:4). Used by: src/scanner/scanRepo.ts, test/buildGraph.test.ts. Runtime consumers: src/scanner/scanRepo.ts -> src/graph/buildGraph.ts. Test consumers: test/buildGraph.test.ts -> src/graph/buildGraph.ts. Common change paths: Read the module entry files first: src/graph/buildGraph.ts - These are the strongest module starting points. (evidence: src/graph/buildGraph.ts); Inspect runtime consumers before changing shared code: src/scanner/scanRepo.ts, src/graph/buildGraph.ts - These runtime-like files depend on the module boundary. (evidence: src/scanner/scanRepo.ts, src/graph/buildGraph.ts); Review test consumers before changing behavior: test/buildGraph.test.ts, src/graph/buildGraph.ts - These tests show expected behavior around the module boundary. (evidence: test/buildGraph.test.ts, src/graph/buildGraph.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/buildGraph.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/buildGraph.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)



> **ℹ️ Module path**
>
> `src/graph` contains 1 file. Open the path in your editor to see them all.

## How It Fits In

## Module Areas

- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) — Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner).


## Area Summaries

- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) — Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…


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

- `src/graph/buildGraph.ts:4` — Imported by 2 external files.

## Main Files

- `src/graph/buildGraph.ts`

## Exported Symbols

> **ℹ️ Public API**
>
> These are the symbols other modules import. Changes here may break consumers — check [Consumers](#consumers) before editing.

- `buildGraph` from `src/graph/buildGraph.ts:4`

## Dependencies

> **ℹ️ Internal vs external**
>
> Internal dependencies are imports from other files in this module. External dependencies are npm packages or other outside code.

## Internal Dependencies

_No internal dependencies._


## External Dependencies

- `node:path`


## Consumers

> **ℹ️ Runtime vs test consumers**
>
> Runtime consumers are other source files that import this module. Test consumers are test files that exercise it. Both matter: runtime changes affect behavior, test changes affect coverage.

## Runtime Consumers

- `src/scanner/scanRepo.ts` -> `src/graph/buildGraph.ts` (1 imports into this module)


## Test Consumers

- `test/buildGraph.test.ts` -> `src/graph/buildGraph.ts` (1 imports into this module)


## Common Change Paths

- `Read the module entry files first` -> `src/graph/buildGraph.ts` - These are the strongest module starting points. (evidence: `src/graph/buildGraph.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/scanner/scanRepo.ts`, `src/graph/buildGraph.ts` - These runtime-like files depend on the module boundary. (evidence: `src/scanner/scanRepo.ts`, `src/graph/buildGraph.ts`)
- `Review test consumers before changing behavior` -> `test/buildGraph.test.ts`, `src/graph/buildGraph.ts` - These tests show expected behavior around the module boundary. (evidence: `test/buildGraph.test.ts`, `src/graph/buildGraph.ts`)
- `Change module implementation files together` -> `src/graph/buildGraph.ts`, `src/scanner/scanRepo.ts`, `test/buildGraph.test.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/graph/buildGraph.ts`, `src/scanner/scanRepo.ts`, `test/buildGraph.test.ts`)

## Related Tests

- `test/buildGraph.test.ts:2` covers `src/graph/buildGraph.ts`, `src/types/index.ts`

## Change Guidance

- `src/scanner/scanRepo.ts:64` — A directly connected implementation file. [Symbols: scanRepo@64]
- `src/graph/buildGraph.ts:4` — A connected implementation file with both imports and exports. [Symbols: buildGraph@4]
- `test/buildGraph.test.ts:2` — Tests that verify this area. (Update the test expectations if behavior changes.)

## Decision Points

- Start with `src/scanner/scanRepo.ts:64` if you are changing public behavior.
- Use `src/graph/buildGraph.ts:4` as the next stop for supporting logic.
- Check `test/buildGraph.test.ts:2` before changing implementation details.


## Verification

- Related tests: `test/buildGraph.test.ts:2`
- Run: `npm run test`

> **❗ Before you commit**
>
> After editing this module, regenerate the wiki with `repowiki update` so the docs stay accurate.

## Notes For AI Agents

- Start by reading the entry files listed above.
- Treat the purpose summary as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
