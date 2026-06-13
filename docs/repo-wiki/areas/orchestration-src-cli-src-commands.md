# Operations and entry points: cli (src/cli.ts) + commands (src/commands)

## Purpose

Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).

## Summary

Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands). Modules: cli (src/cli.ts), commands (src/commands). Root paths: src/cli.ts, src/commands. Entry files: src/commands/update.ts:87, src/commands/check.ts:4, src/cli.ts:34. Test consumers: test/checkCommand.test.ts -> src/commands/check.ts, test/update.test.ts -> src/commands/update.ts. Outgoing area flows: Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: graph (src/graph) + scanner (src/scanner), Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: storage (src/storage). Common change paths: Read the module entry files first: src/commands/update.ts, src/commands/check.ts, src/cli.ts - These are the strongest module starting points. (evidence: src/commands/update.ts, src/commands/check.ts, src/cli.ts); Review test consumers before changing behavior: test/checkCommand.test.ts, src/commands/check.ts, test/update.test.ts - These tests show expected behavior around the module boundary. (evidence: test/checkCommand.test.ts, src/commands/check.ts, test/update.test.ts); Change module implementation files together: src/commands/update.ts, src/commands/check.ts, src/cli.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/cli.ts, src/commands/check.ts, src/commands/generate.ts). Verification: Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json) Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json) Inspect related tests: test/checkCommand.test.ts:5, test/cli.e2e.test.ts:8, test/detectTests.test.ts:2 - These tests cover files in the area. (evidence: test/checkCommand.test.ts:5, test/cli.e2e.test.ts:8, test/detectTests.test.ts:2)

## Modules

- [cli (src/cli.ts)](../modules/src-cli.md) - 1 file
- [commands (src/commands)](../modules/src-commands.md) - 4 files

## Entry Files

- `src/commands/update.ts:87` - Imported by 1 external file.
- `src/commands/check.ts:4` - Imported by 1 external file.
- `src/cli.ts:34` - Defines 7 symbols used inside this area.
- `src/commands/generate.ts:7` - Central implementation file with exported behavior.
- `src/commands/review.ts:7` - Central implementation file with exported behavior.

## Root Paths

- `src/cli.ts`
- `src/commands`

## Key Files

- `src/commands/update.ts`
- `src/commands/check.ts`
- `src/commands/generate.ts`
- `src/commands/review.ts`
- `src/cli.ts`

## Module Connections

- `cli (src/cli.ts) -> commands (src/commands)` (4 imports)

## Area Flows In

_No incoming area flows detected._

## Area Flows Out

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (9 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: graph (src/graph) + scanner (src/scanner)` (4 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: storage (src/storage)` (4 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Shared support: types (src/types) + utils (src/utils)` (1 imports)

## Runtime Consumers

_No runtime consumers detected._

## Test Consumers

- `test/checkCommand.test.ts` -> `src/commands/check.ts` (1 imports into this area)
- `test/update.test.ts` -> `src/commands/update.ts` (1 imports into this area)

## Common Change Paths

- `Read the module entry files first` -> `src/commands/update.ts`, `src/commands/check.ts`, `src/cli.ts`, `src/commands/generate.ts` - These are the strongest module starting points. (evidence: `src/commands/update.ts`, `src/commands/check.ts`, `src/cli.ts`, `src/commands/generate.ts`)
- `Review test consumers before changing behavior` -> `test/checkCommand.test.ts`, `src/commands/check.ts`, `test/update.test.ts`, `src/commands/update.ts` - These tests show expected behavior around the module boundary. (evidence: `test/checkCommand.test.ts`, `src/commands/check.ts`, `test/update.test.ts`, `src/commands/update.ts`)
- `Change module implementation files together` -> `src/commands/update.ts`, `src/commands/check.ts`, `src/cli.ts`, `src/commands/generate.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)

## Change Guidance

- `src/cli.ts:34` - A dependency-heavy file that influences nearby code.
- `src/commands/update.ts:87` - A connected implementation file with both imports and exports. [Symbols: updateCommand@9, getAffectedModules@46, getAffectedRoutes@71, getAffectedAreas@87]
- `src/commands/check.ts:4` - A connected implementation file with both imports and exports. [Symbols: checkCommand@4]
- `src/commands/generate.ts:7` - A connected implementation file with both imports and exports. [Symbols: generateCommand@7]
- `src/commands/review.ts:7` - A connected implementation file with both imports and exports. [Symbols: reviewCommand@7]
- `test/generateDocs.test.ts:2` - Tests that verify this area. (Update the test expectations if behavior changes.)
- `test/checkCommand.test.ts:5` - Tests that verify this area. (Update the test expectations if behavior changes.)
- `test/detectTests.test.ts:2` - Tests that verify this area. (Update the test expectations if behavior changes.)

## Verification

- Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json)
- Inspect related tests: test/checkCommand.test.ts:5, test/cli.e2e.test.ts:8, test/detectTests.test.ts:2 - These tests cover files in the area. (evidence: test/checkCommand.test.ts:5, test/cli.e2e.test.ts:8, test/detectTests.test.ts:2)

## Related Tests

- `test/checkCommand.test.ts:5` covers `src/commands/check.ts`
- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/generateDocs.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateIndexDoc.ts`, `src/docs/generateModuleDoc.ts`, `src/types/index.ts`
- `test/update.test.ts:2` covers `src/commands/update.ts`, `src/types/index.ts`

## Related Routes

_No related routes detected._

## Files

- `src/cli.ts`
- `src/commands/check.ts`
- `src/commands/generate.ts`
- `src/commands/review.ts`
- `src/commands/update.ts`

## Navigation

- [Areas index](index.md)
- [Repo wiki index](../index.md)
- [Flow overview](../flows/index.md)

## Notes

- This page groups modules that appear to belong to the same functional area.
- Use the linked module pages for file-level details.
- Use the flow overview for cross-area movement.
