# Diagrams

## Purpose

Likely generates repository diagrams and flow visuals. 1 file belong to this module. Main files: src/diagrams/generateDiagrams.ts. Entry files: src/diagrams/generateDiagrams.ts:4. Module areas: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Exported symbols include generateModuleDiagram (src/diagrams/generateDiagrams.ts:4), generateRouteDiagram (src/diagrams/generateDiagrams.ts:20). Used by: src/docs/generateArchitectureDoc.ts, src/docs/writeDocs.ts, test/diagrams.test.ts. Runtime consumers: src/docs/generateArchitectureDoc.ts -> src/diagrams/generateDiagrams.ts, src/docs/writeDocs.ts -> src/diagrams/generateDiagrams.ts. Test consumers: test/diagrams.test.ts -> src/diagrams/generateDiagrams.ts. Common change paths: Read the module entry files first: src/diagrams/generateDiagrams.ts - These are the strongest module starting points. (evidence: src/diagrams/generateDiagrams.ts); Inspect runtime consumers before changing shared code: src/docs/generateArchitectureDoc.ts, src/diagrams/generateDiagrams.ts, src/docs/writeDocs.ts - These runtime-like files depend on the module boundary. (evidence: src/docs/generateArchitectureDoc.ts, src/diagrams/generateDiagrams.ts, src/docs/writeDocs.ts); Review test consumers before changing behavior: test/diagrams.test.ts, src/diagrams/generateDiagrams.ts - These tests show expected behavior around the module boundary. (evidence: test/diagrams.test.ts, src/diagrams/generateDiagrams.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/diagrams.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/diagrams.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)

## Module Path

`src/diagrams`

## Module Areas

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).

## Area Summaries

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…

## Entry Files

- `src/diagrams/generateDiagrams.ts:4` - Imported by 3 external files.

## Main Files

- `src/diagrams/generateDiagrams.ts`

## Exported Symbols

- `generateModuleDiagram` from `src/diagrams/generateDiagrams.ts:4`
- `generateRouteDiagram` from `src/diagrams/generateDiagrams.ts:20`

## Internal Dependencies

_None detected._

## External Dependencies

_None detected._

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

- `src/docs/generateArchitectureDoc.ts:17` - A directly connected implementation file. [Symbols: generateArchitectureDoc@17]
- `src/docs/writeDocs.ts:28` - A directly connected implementation file. [Symbols: writeDocs@28]
- `src/diagrams/generateDiagrams.ts:4` - A connected implementation file with both imports and exports. [Symbols: generateModuleDiagram@4, generateRouteDiagram@20]
- `test/diagrams.test.ts:2` - Tests that verify this area. (Update the test expectations if behavior changes.)

## Decision Points

- Start with `src/docs/generateArchitectureDoc.ts:17` if you are changing public behavior.
- Use `src/docs/writeDocs.ts:28` as the next stop for supporting logic.
- Check `test/diagrams.test.ts:2` before changing implementation details.

## Verification

- Related tests: `test/diagrams.test.ts:2`
- Run: `npm run test`

## Notes For AI Agents

- Start by reading the main files listed above.
- Treat the purpose as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
