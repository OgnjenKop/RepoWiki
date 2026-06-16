# commands

**Navigation:** [Wiki](../index.md) → [Modules](../index.md#modules) → commands

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Files** | **Entry files** | **Exports** | **Tests** |
| 5 | 5 | 9 | 2 |
| in `src/commands` | imported by others | public API | covering files |

## What This Module Does

Likely implements CLI command entry points and orchestration. 5 files belong to this module. Main files: src/commands/check.ts, src/commands/generate.ts, src/commands/review.ts, src/commands/synthesize.ts. Entry files: src/commands/update.ts:92, src/commands/check.ts:4, src/commands/synthesize.ts:9. Module areas: Operations and entry points: cli (src/cli.ts) + commands (src/commands). Exported symbols include checkCommand (src/commands/check.ts:4), generateCommand (src/commands/generate.ts:8), reviewCommand (src/commands/review.ts:7), synthesizeCommand (src/commands/synthesize.ts:9), getAffectedAreas (src/commands/update.ts:92), getAffectedModules (src/commands/update.ts:51), getAffectedRoutes (src/commands/update.ts:76), hasGlobalWikiImpact (src/commands/update.ts:121). Used by: src/cli.ts, test/checkCommand.test.ts, test/update.test.ts. Runtime consumers: src/cli.ts -> src/commands/check.ts, src/commands/generate.ts. Test consumers: test/checkCommand.test.ts -> src/commands/check.ts, test/update.test.ts -> src/commands/update.ts. Common change paths: Read the module entry files first: src/commands/update.ts, src/commands/check.ts, src/commands/synthesize.ts - These are the strongest module starting points. (evidence: src/commands/update.ts, src/commands/check.ts, src/commands/synthesize.ts); Inspect runtime consumers before changing shared code: src/cli.ts, src/commands/check.ts, src/commands/generate.ts - These runtime-like files depend on the module boundary. (evidence: src/cli.ts, src/commands/check.ts, src/commands/generate.ts); Review test consumers before changing behavior: test/checkCommand.test.ts, src/commands/check.ts, test/update.test.ts - These tests show expected behavior around the module boundary. (evidence: test/checkCommand.test.ts, src/commands/check.ts, test/update.test.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/checkCommand.test.ts:5, test/update.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/checkCommand.test.ts:5, test/update.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)



> **ℹ️ Module path**
>
> `src/commands` contains 5 files. Open the path in your editor to see them all.

## How It Fits In

## Module Areas

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) — Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).


## Area Summaries

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) — Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…


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

- `src/commands/update.ts:92` — Imported by 2 external files.
- `src/commands/check.ts:4` — Imported by 2 external files.
- `src/commands/synthesize.ts:9` — Imported by 1 external file.
- `src/commands/generate.ts:8` — Imported by 1 external file.
- `src/commands/review.ts:7` — Imported by 1 external file.

## Main Files

- `src/commands/check.ts`
- `src/commands/generate.ts`
- `src/commands/review.ts`
- `src/commands/synthesize.ts`
- `src/commands/update.ts`

## Exported Symbols

> **ℹ️ Public API**
>
> These are the symbols other modules import. Changes here may break consumers — check [Consumers](#consumers) before editing.

- `checkCommand` from `src/commands/check.ts:4`
- `generateCommand` from `src/commands/generate.ts:8`
- `reviewCommand` from `src/commands/review.ts:7`
- `synthesizeCommand` from `src/commands/synthesize.ts:9`
- `getAffectedAreas` from `src/commands/update.ts:92`
- `getAffectedModules` from `src/commands/update.ts:51`
- `getAffectedRoutes` from `src/commands/update.ts:76`
- `hasGlobalWikiImpact` from `src/commands/update.ts:121`
- `updateCommand` from `src/commands/update.ts:11`

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

- `src/cli.ts` -> `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`, `src/commands/synthesize.ts` (5 imports into this module)


## Test Consumers

- `test/checkCommand.test.ts` -> `src/commands/check.ts` (1 imports into this module)
- `test/update.test.ts` -> `src/commands/update.ts` (1 imports into this module)


## Common Change Paths

- `Read the module entry files first` -> `src/commands/update.ts`, `src/commands/check.ts`, `src/commands/synthesize.ts`, `src/commands/generate.ts` - These are the strongest module starting points. (evidence: `src/commands/update.ts`, `src/commands/check.ts`, `src/commands/synthesize.ts`, `src/commands/generate.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These runtime-like files depend on the module boundary. (evidence: `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)
- `Review test consumers before changing behavior` -> `test/checkCommand.test.ts`, `src/commands/check.ts`, `test/update.test.ts`, `src/commands/update.ts` - These tests show expected behavior around the module boundary. (evidence: `test/checkCommand.test.ts`, `src/commands/check.ts`, `test/update.test.ts`, `src/commands/update.ts`)
- `Change module implementation files together` -> `src/commands/update.ts`, `src/commands/check.ts`, `src/commands/synthesize.ts`, `src/commands/generate.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`, `src/commands/synthesize.ts`)

## Related Tests

- `test/checkCommand.test.ts:5` covers `src/commands/check.ts`
- `test/update.test.ts:2` covers `src/commands/update.ts`, `src/types/index.ts`

## Change Guidance

- `src/cli.ts:36` — A directly connected implementation file.
- `src/commands/update.ts:92` — A connected implementation file with both imports and exports. [Symbols: updateCommand@11, getAffectedModules@51, getAffectedRoutes@76, getAffectedAreas@92]
- `src/commands/synthesize.ts:9` — A connected implementation file with both imports and exports. [Symbols: synthesizeCommand@9]
- `src/commands/generate.ts:8` — A connected implementation file with both imports and exports. [Symbols: generateCommand@8]
- `src/commands/check.ts:4` — A connected implementation file with both imports and exports. [Symbols: checkCommand@4]

## Decision Points

- Start with `src/cli.ts:36` if you are changing public behavior.
- Use `src/commands/update.ts:92` as the next stop for supporting logic.
- Check `test/checkCommand.test.ts:5` before changing implementation details.


## Verification

- Related tests: `test/checkCommand.test.ts:5`, `test/update.test.ts:2`
- Run: `npm run test`

> **❗ Before you commit**
>
> After editing this module, regenerate the wiki with `repowiki update` so the docs stay accurate.

## Notes For AI Agents

- Start by reading the entry files listed above.
- Treat the purpose summary as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
