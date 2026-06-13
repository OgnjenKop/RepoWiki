# diagrams Flow

`src/diagrams`

## Overview

Likely generates repository diagrams and flow visuals. 1 file belong to this module. Main files: src/diagrams/generateDiagrams.ts. Entry files: src/diagrams/generateDiagrams.ts:4. Module areas: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Exported symbols include generateModuleDiagram (src/diagrams/generateDiagrams.ts:4), generateRouteDiagram (src/diagrams/generateDiagrams.ts:20). Used by: src/docs/generateArchitectureDoc.ts, src/docs/writeDocs.ts, test/diagrams.test.ts. Runtime consumers: src/docs/generateArchitectureDoc.ts -> src/diagrams/generateDiagrams.ts, src/docs/writeDocs.ts -> src/diagrams/generateDiagrams.ts. Test consumers: test/diagrams.test.ts -> src/diagrams/generateDiagrams.ts. Common change paths: Read the module entry files first: src/diagrams/generateDiagrams.ts - These are the strongest module starting points. (evidence: src/diagrams/generateDiagrams.ts); Inspect runtime consumers before changing shared code: src/docs/generateArchitectureDoc.ts, src/diagrams/generateDiagrams.ts, src/docs/writeDocs.ts - These runtime-like files depend on the module boundary. (evidence: src/docs/generateArchitectureDoc.ts, src/diagrams/generateDiagrams.ts, src/docs/writeDocs.ts); Review test consumers before changing behavior: test/diagrams.test.ts, src/diagrams/generateDiagrams.ts - These tests show expected behavior around the module boundary. (evidence: test/diagrams.test.ts, src/diagrams/generateDiagrams.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/diagrams.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/diagrams.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)

## Module Areas

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).

## Area Summaries

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…

## Entry Files

- `src/diagrams/generateDiagrams.ts:4` - Imported by 3 external files.

## Area Flows

- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)
- `Core application logic: storage (src/storage)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (9 imports)
- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (110 imports)
- `Shared support: types (src/types) + utils (src/utils)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)

## Entry Points

- `test/diagrams.test.ts:2` covers `src/diagrams/generateDiagrams.ts`, `src/types/index.ts`
- `src/docs/generateArchitectureDoc.ts` imports this module
- `src/docs/writeDocs.ts` imports this module
- `test/diagrams.test.ts` imports this module

## Common Change Paths

- `Read the module entry files first` -> `src/diagrams/generateDiagrams.ts` - These are the strongest module starting points. (evidence: `src/diagrams/generateDiagrams.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/docs/generateArchitectureDoc.ts`, `src/diagrams/generateDiagrams.ts`, `src/docs/writeDocs.ts` - These runtime-like files depend on the module boundary. (evidence: `src/docs/generateArchitectureDoc.ts`, `src/diagrams/generateDiagrams.ts`, `src/docs/writeDocs.ts`)
- `Review test consumers before changing behavior` -> `test/diagrams.test.ts`, `src/diagrams/generateDiagrams.ts` - These tests show expected behavior around the module boundary. (evidence: `test/diagrams.test.ts`, `src/diagrams/generateDiagrams.ts`)
- `Change module implementation files together` -> `src/diagrams/generateDiagrams.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/writeDocs.ts`, `test/diagrams.test.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/diagrams/generateDiagrams.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/writeDocs.ts`, `test/diagrams.test.ts`)

## Module Connections

- `diagrams (src/diagrams) -> types (src/types)`
- `diagrams (src/diagrams) -> utils (src/utils)`
- `diagrams (src/diagrams) <- docs (src/docs)` (2 imports)

## Internal Flow

_No internal module-to-module flow detected._

## External Dependencies

_No external dependencies detected._

## Runtime Consumers

- `src/docs/generateArchitectureDoc.ts` -> `src/diagrams/generateDiagrams.ts` (1 imports into this module)
- `src/docs/writeDocs.ts` -> `src/diagrams/generateDiagrams.ts` (1 imports into this module)

## Test Consumers

- `test/diagrams.test.ts` -> `src/diagrams/generateDiagrams.ts` (1 imports into this module)

## Related Tests

- `test/diagrams.test.ts:2` covers `src/diagrams/generateDiagrams.ts`, `src/types/index.ts`

## Change Targets

- `src/docs/generateArchitectureDoc.ts:17` - A directly connected implementation file. [Symbols: generateArchitectureDoc@17]
- `src/docs/writeDocs.ts:28` - A directly connected implementation file. [Symbols: writeDocs@28]
- `src/diagrams/generateDiagrams.ts:4` - A connected implementation file with both imports and exports. [Symbols: generateModuleDiagram@4, generateRouteDiagram@20]
- `test/diagrams.test.ts:2` - Tests that verify this area. (Update the test expectations if behavior changes.)

## Verification

- Run: `npm run build`
- Related tests: `test/diagrams.test.ts:2`
- Run: `npm run test`
