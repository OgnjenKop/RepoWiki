# graph Flow

`src/graph`

## Overview

Likely builds the repository import graph and route relationships. 1 file belong to this module. Main files: src/graph/buildGraph.ts. Entry files: src/graph/buildGraph.ts:4. Module areas: Core application logic: graph (src/graph) + scanner (src/scanner). Exported symbols include buildGraph (src/graph/buildGraph.ts:4). Used by: src/scanner/scanRepo.ts, test/buildGraph.test.ts. Runtime consumers: src/scanner/scanRepo.ts -> src/graph/buildGraph.ts. Test consumers: test/buildGraph.test.ts -> src/graph/buildGraph.ts. Common change paths: Read the module entry files first: src/graph/buildGraph.ts - These are the strongest module starting points. (evidence: src/graph/buildGraph.ts); Inspect runtime consumers before changing shared code: src/scanner/scanRepo.ts, src/graph/buildGraph.ts - These runtime-like files depend on the module boundary. (evidence: src/scanner/scanRepo.ts, src/graph/buildGraph.ts); Review test consumers before changing behavior: test/buildGraph.test.ts, src/graph/buildGraph.ts - These tests show expected behavior around the module boundary. (evidence: test/buildGraph.test.ts, src/graph/buildGraph.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/buildGraph.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/buildGraph.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)

## Module Areas

- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner).

## Area Summaries

- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…

## Entry Files

- `src/graph/buildGraph.ts:4` - Imported by 2 external files.

## Area Flows

- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Shared support: types (src/types) + utils (src/utils)` (20 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: graph (src/graph) + scanner (src/scanner)` (5 imports)

## Entry Points

- `test/buildGraph.test.ts:2` covers `src/graph/buildGraph.ts`, `src/types/index.ts`
- `src/scanner/scanRepo.ts` imports this module
- `test/buildGraph.test.ts` imports this module

## Common Change Paths

- `Read the module entry files first` -> `src/graph/buildGraph.ts` - These are the strongest module starting points. (evidence: `src/graph/buildGraph.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/scanner/scanRepo.ts`, `src/graph/buildGraph.ts` - These runtime-like files depend on the module boundary. (evidence: `src/scanner/scanRepo.ts`, `src/graph/buildGraph.ts`)
- `Review test consumers before changing behavior` -> `test/buildGraph.test.ts`, `src/graph/buildGraph.ts` - These tests show expected behavior around the module boundary. (evidence: `test/buildGraph.test.ts`, `src/graph/buildGraph.ts`)
- `Change module implementation files together` -> `src/graph/buildGraph.ts`, `src/scanner/scanRepo.ts`, `test/buildGraph.test.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/graph/buildGraph.ts`, `src/scanner/scanRepo.ts`, `test/buildGraph.test.ts`)

## Module Connections

- `graph (src/graph) -> types (src/types)`
- `graph (src/graph) <- scanner (src/scanner)`

## Internal Flow

_No internal module-to-module flow detected._

## External Dependencies

- `node:path`

## Runtime Consumers

- `src/scanner/scanRepo.ts` -> `src/graph/buildGraph.ts` (1 imports into this module)

## Test Consumers

- `test/buildGraph.test.ts` -> `src/graph/buildGraph.ts` (1 imports into this module)

## Related Tests

- `test/buildGraph.test.ts:2` covers `src/graph/buildGraph.ts`, `src/types/index.ts`

## Change Targets

- `src/scanner/scanRepo.ts:49` - A directly connected implementation file. [Symbols: scanRepo@49]
- `src/graph/buildGraph.ts:4` - A connected implementation file with both imports and exports. [Symbols: buildGraph@4]
- `test/buildGraph.test.ts:2` - Tests that verify this area. (Update the test expectations if behavior changes.)

## Verification

- Run: `npm run build`
- Related tests: `test/buildGraph.test.ts:2`
- Run: `npm run test`
