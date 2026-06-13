# commands Flow

`src/commands`

## Overview

Likely implements CLI command entry points and orchestration. 5 files belong to this module. Main files: src/commands/check.ts, src/commands/generate.ts, src/commands/review.ts, src/commands/synthesize.ts. Entry files: src/commands/update.ts:87, src/commands/check.ts:4, src/commands/generate.ts:7. Module areas: Operations and entry points: cli (src/cli.ts) + commands (src/commands). Exported symbols include checkCommand (src/commands/check.ts:4), generateCommand (src/commands/generate.ts:7), reviewCommand (src/commands/review.ts:7), synthesizeCommand (src/commands/synthesize.ts:7), getAffectedAreas (src/commands/update.ts:87), getAffectedModules (src/commands/update.ts:46), getAffectedRoutes (src/commands/update.ts:71), hasGlobalWikiImpact (src/commands/update.ts:116). Used by: src/cli.ts, test/checkCommand.test.ts, test/update.test.ts. Runtime consumers: src/cli.ts -> src/commands/check.ts, src/commands/generate.ts. Test consumers: test/checkCommand.test.ts -> src/commands/check.ts, test/update.test.ts -> src/commands/update.ts. Common change paths: Read the module entry files first: src/commands/update.ts, src/commands/check.ts, src/commands/generate.ts - These are the strongest module starting points. (evidence: src/commands/update.ts, src/commands/check.ts, src/commands/generate.ts); Inspect runtime consumers before changing shared code: src/cli.ts, src/commands/check.ts, src/commands/generate.ts - These runtime-like files depend on the module boundary. (evidence: src/cli.ts, src/commands/check.ts, src/commands/generate.ts); Review test consumers before changing behavior: test/checkCommand.test.ts, src/commands/check.ts, test/update.test.ts - These tests show expected behavior around the module boundary. (evidence: test/checkCommand.test.ts, src/commands/check.ts, test/update.test.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/checkCommand.test.ts:5, test/update.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/checkCommand.test.ts:5, test/update.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)

## Module Areas

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).

## Area Summaries

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…

## Entry Files

- `src/commands/update.ts:87` - Imported by 2 external files.
- `src/commands/check.ts:4` - Imported by 2 external files.
- `src/commands/generate.ts:7` - Imported by 1 external file.
- `src/commands/review.ts:7` - Imported by 1 external file.
- `src/commands/synthesize.ts:7` - Imported by 1 external file.

## Area Flows

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: graph (src/graph) + scanner (src/scanner)` (5 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: storage (src/storage)` (5 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (12 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Shared support: types (src/types) + utils (src/utils)` (1 imports)

## Entry Points

- `test/checkCommand.test.ts:5` covers `src/commands/check.ts`
- `test/update.test.ts:2` covers `src/commands/update.ts`, `src/types/index.ts`
- `src/cli.ts` imports this module
- `test/checkCommand.test.ts` imports this module
- `test/update.test.ts` imports this module

## Common Change Paths

- `Read the module entry files first` -> `src/commands/update.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These are the strongest module starting points. (evidence: `src/commands/update.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These runtime-like files depend on the module boundary. (evidence: `src/cli.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)
- `Review test consumers before changing behavior` -> `test/checkCommand.test.ts`, `src/commands/check.ts`, `test/update.test.ts`, `src/commands/update.ts` - These tests show expected behavior around the module boundary. (evidence: `test/checkCommand.test.ts`, `src/commands/check.ts`, `test/update.test.ts`, `src/commands/update.ts`)
- `Change module implementation files together` -> `src/commands/update.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`, `src/commands/synthesize.ts`)

## Module Connections

- `commands (src/commands) -> ai (src/ai)` (8 imports)
- `commands (src/commands) -> docs (src/docs)` (4 imports)
- `commands (src/commands) -> scanner (src/scanner)` (5 imports)
- `commands (src/commands) -> storage (src/storage)` (5 imports)
- `commands (src/commands) -> types (src/types)`
- `commands (src/commands) <- cli (src/cli.ts)` (5 imports)

## Internal Flow

_No internal module-to-module flow detected._

## External Dependencies

- `node:path`

## Runtime Consumers

- `src/cli.ts` -> `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`, `src/commands/synthesize.ts` (5 imports into this module)

## Test Consumers

- `test/checkCommand.test.ts` -> `src/commands/check.ts` (1 imports into this module)
- `test/update.test.ts` -> `src/commands/update.ts` (1 imports into this module)

## Related Tests

- `test/checkCommand.test.ts:5` covers `src/commands/check.ts`
- `test/update.test.ts:2` covers `src/commands/update.ts`, `src/types/index.ts`

## Change Targets

- `src/cli.ts:36` - A directly connected implementation file.
- `src/commands/update.ts:87` - A connected implementation file with both imports and exports. [Symbols: updateCommand@9, getAffectedModules@46, getAffectedRoutes@71, getAffectedAreas@87]
- `src/commands/check.ts:4` - A connected implementation file with both imports and exports. [Symbols: checkCommand@4]
- `src/commands/generate.ts:7` - A connected implementation file with both imports and exports. [Symbols: generateCommand@7]
- `src/commands/review.ts:7` - A connected implementation file with both imports and exports. [Symbols: reviewCommand@7]

## Verification

- Run: `npm run build`
- Related tests: `test/checkCommand.test.ts:5`, `test/update.test.ts:2`
- Run: `npm run test`
