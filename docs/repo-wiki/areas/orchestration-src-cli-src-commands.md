# Operations and entry points: cli (src/cli.ts) + commands (src/commands)

**Navigation:** [Wiki](../index.md) → [Areas](index.md) → Operations and entry points: cli (src/cli.ts) + commands (src/commands)

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Modules** | **Files** | **Tests** | **Entry files** |
| 2 | 6 | 5 | 5 |
| in this area | scanned | covering files | imported by others |

## What This Area Is

Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands). Modules: cli (src/cli.ts), commands (src/commands). Root paths: src/cli.ts, src/commands. Entry files: src/commands/update.ts:92, src/commands/check.ts:4, src/cli.ts:36. Test consumers: test/checkCommand.test.ts -> src/commands/check.ts, test/update.test.ts -> src/commands/update.ts. Outgoing area flows: Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: graph (src/graph) + scanner (src/scanner), Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: storage (src/storage). Common change paths: Read the module entry files first: src/commands/update.ts, src/commands/check.ts, src/cli.ts - These are the strongest module starting points. (evidence: src/commands/update.ts, src/commands/check.ts, src/cli.ts); Review test consumers before changing behavior: test/checkCommand.test.ts, src/commands/check.ts, test/update.test.ts - These tests show expected behavior around the module boundary. (evidence: test/checkCommand.test.ts, src/commands/check.ts, test/update.test.ts); Change module implementation files together: src/commands/update.ts, src/commands/check.ts, src/cli.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/cli.ts, src/commands/check.ts, src/commands/generate.ts). Verification: Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json) Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json) Inspect related tests: test/checkCommand.test.ts:5, test/cli.e2e.test.ts:8, test/detectTests.test.ts:2 - These tests cover files in the area. (evidence: test/checkCommand.test.ts:5, test/cli.e2e.test.ts:8, test/detectTests.test.ts:2)

> **ℹ️ Purpose**
>
> Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).

## On This Page

## On This Page

- [What This Area Is](#what-this-area-is)
- [Modules](#modules)
- [Entry Files](#entry-files)
- [Key Files](#key-files)
- [Module Connections](#module-connections)
- [Area Flows](#area-flows)
- [Consumers](#consumers)
- [Common Change Paths](#common-change-paths)
- [Change Guidance](#change-guidance)
- [Verification](#verification)

## Modules

- [cli (src/cli.ts)](../modules/src-cli.md) — 1 file
- [commands (src/commands)](../modules/src-commands.md) — 5 files

## Entry Files

- `src/commands/update.ts:92` — Imported by 1 external file.
- `src/commands/check.ts:4` — Imported by 1 external file.
- `src/cli.ts:36` — Defines 7 symbols used inside this area.
- `src/commands/synthesize.ts:9` — Central implementation file with exported behavior.
- `src/commands/generate.ts:8` — Central implementation file with exported behavior.

## Root Paths

- `src/cli.ts`
- `src/commands`

## Key Files

> **💡 What makes a file "key"?**
>
> Key files are the ones other files import from most often within this area. They're the highest-leverage files to read.

- `src/commands/update.ts`
- `src/commands/check.ts`
- `src/commands/synthesize.ts`
- `src/commands/generate.ts`
- `src/commands/review.ts`
- `src/cli.ts`

## Module Connections

- `cli (src/cli.ts) → commands (src/commands)` (5 imports)

## Area Flows

## Flows In

_No incoming area flows detected._


## Flows Out

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (17 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Core application logic: graph (src/graph) + scanner (src/scanner)` (5 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Core application logic: storage (src/storage)` (5 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Shared support: types (src/types) + utils (src/utils)` (1 imports)


## Consumers

## Runtime Consumers

_No runtime consumers detected._


## Test Consumers

- `test/checkCommand.test.ts` -> `src/commands/check.ts` (1 imports into this area)
- `test/update.test.ts` -> `src/commands/update.ts` (1 imports into this area)


## Common Change Paths

- `Read the module entry files first` -> `src/commands/update.ts`, `src/commands/check.ts`, `src/cli.ts`, `src/commands/synthesize.ts` - These are the strongest module starting points. (evidence: `src/commands/update.ts`, `src/commands/check.ts`, `src/cli.ts`, `src/commands/synthesize.ts`)
- `Review test consumers before changing behavior` -> `test/checkCommand.test.ts`, `src/commands/check.ts`, `test/update.test.ts`, `src/commands/update.ts` - These tests show expected behavior around the module boundary. (evidence: `test/checkCommand.test.ts`, `src/commands/check.ts`, `test/update.test.ts`, `src/commands/update.ts`)
- `Change module implementation files together` -> `src/commands/update.ts`, `src/commands/check.ts`, `src/cli.ts`, `src/commands/synthesize.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)

## Change Guidance

- `src/cli.ts:36` — A dependency-heavy file that influences nearby code.
- `src/commands/update.ts:92` — A connected implementation file with both imports and exports. [Symbols: updateCommand@11, getAffectedModules@51, getAffectedRoutes@76, getAffectedAreas@92]
- `src/commands/synthesize.ts:9` — A connected implementation file with both imports and exports. [Symbols: synthesizeCommand@9]
- `src/commands/generate.ts:8` — A connected implementation file with both imports and exports. [Symbols: generateCommand@8]
- `test/generateDocs.test.ts:2` — Tests that verify this area. (Update the test expectations if behavior changes.)
- `src/commands/check.ts:4` — A connected implementation file with both imports and exports. [Symbols: checkCommand@4]
- `src/commands/review.ts:7` — A connected implementation file with both imports and exports. [Symbols: reviewCommand@7]
- `test/checkCommand.test.ts:5` — Tests that verify this area. (Update the test expectations if behavior changes.)

## Verification

- Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json)
- Inspect related tests: test/checkCommand.test.ts:5, test/cli.e2e.test.ts:8, test/detectTests.test.ts:2 - These tests cover files in the area. (evidence: test/checkCommand.test.ts:5, test/cli.e2e.test.ts:8, test/detectTests.test.ts:2)

## Related Tests

- `test/checkCommand.test.ts:5` covers `src/commands/check.ts`
- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/generateDocs.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateIndexDoc.ts`, `src/docs/generateModuleDoc.ts`, `src/docs/generateQualityDoc.ts`, `src/types/index.ts`
- `test/update.test.ts:2` covers `src/commands/update.ts`, `src/types/index.ts`

## Related Routes

_No related routes detected._

## Files

- `src/cli.ts`
- `src/commands/check.ts`
- `src/commands/generate.ts`
- `src/commands/review.ts`
- `src/commands/synthesize.ts`
- `src/commands/update.ts`

## Navigation

- [Areas index](index.md)
- [Repo wiki index](../index.md)
- [Flow overview](../flows/index.md)
