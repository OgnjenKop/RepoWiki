# Cli

## Purpose

Likely implements CLI command entry points and orchestration. 1 file belong to this module. Main files: src/cli.ts. Entry files: src/cli.ts:36. Module areas: Operations and entry points: cli (src/cli.ts) + commands (src/commands). Common change paths: Read the module entry files first: src/cli.ts - These are the strongest module starting points. (evidence: src/cli.ts); Change module implementation files together: src/cli.ts - These files are part of the same module boundary and likely need coordinated edits. (evidence: src/cli.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/cli.e2e.test.ts:8, test/detectTests.test.ts:2, test/generateDocs.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/cli.e2e.test.ts:8, test/detectTests.test.ts:2, test/generateDocs.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)

## Module Path

`src/cli.ts`

## Module Areas

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).

## Area Summaries

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](../areas/orchestration-src-cli-src-commands.md) - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…

## Entry Files

- `src/cli.ts:36` - Defines 7 symbols used inside this module.

## Main Files

- `src/cli.ts`

## Exported Symbols

_None detected._

## Internal Dependencies

_None detected._

## External Dependencies

- `commander`
- `node:path`
- `simple-git`

## Runtime Consumers

_No runtime consumers detected._

## Test Consumers

_No test consumers detected._

## Common Change Paths

- `Read the module entry files first` -> `src/cli.ts` - These are the strongest module starting points. (evidence: `src/cli.ts`)
- `Change module implementation files together` -> `src/cli.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/cli.ts`)

## Related Tests

- `test/cli.e2e.test.ts:8` covers `src/ai/contextPacks.ts`, `src/cli.ts`, `src/utils/docPaths.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/generateDocs.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateIndexDoc.ts`, `src/docs/generateModuleDoc.ts`, `src/docs/generateQualityDoc.ts`, `src/types/index.ts`

## Change Guidance

- `src/cli.ts:36` - A dependency-heavy file that influences nearby code.
- `test/generateDocs.test.ts:2` - Tests that verify this area. (Update the test expectations if behavior changes.)
- `test/detectTests.test.ts:2` - Tests that verify this area. (Update the test expectations if behavior changes.)

## Decision Points

- Start with `src/cli.ts:36` if you are changing public behavior.
- Use `test/generateDocs.test.ts:2` as the next stop for supporting logic.
- Check `test/cli.e2e.test.ts:8` before changing implementation details.

## Verification

- Related tests: `test/cli.e2e.test.ts:8`, `test/detectTests.test.ts:2`, `test/generateDocs.test.ts:2`
- Run: `npm run test`

## Notes For AI Agents

- Start by reading the main files listed above.
- Treat the purpose as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
