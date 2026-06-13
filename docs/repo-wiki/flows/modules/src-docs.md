# docs Flow

`src/docs`

## Overview

Likely generates repository wiki pages, flow docs, and AGENTS.md instructions. 13 files belong to this module. Main files: src/docs/generateAgentContextDoc.ts, src/docs/generateAgentsMd.ts, src/docs/generateArchitectureDoc.ts, src/docs/generateAreaDoc.ts. Entry files: src/docs/writeDocs.ts:28, src/docs/generateAgentsMd.ts:13, src/docs/generateFlowDocs.ts:18. Module areas: Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Exported symbols include generateAgentContextDoc (src/docs/generateAgentContextDoc.ts:17), generateAgentsSection (src/docs/generateAgentsMd.ts:13), mergeAgentsMd (src/docs/generateAgentsMd.ts:77), generateArchitectureDoc (src/docs/generateArchitectureDoc.ts:17), generateAreaDoc (src/docs/generateAreaDoc.ts:15), generateAreasIndexDoc (src/docs/generateAreasIndexDoc.ts:8), generateCodexReviewDoc (src/docs/generateCodexReviewDoc.ts:7), generateFlowsIndexDoc (src/docs/generateFlowDocs.ts:18). Used by: src/commands/generate.ts, src/commands/review.ts, src/commands/synthesize.ts, src/commands/update.ts. Runtime consumers: src/commands/generate.ts -> src/docs/writeDocs.ts, src/commands/review.ts -> src/docs/writeDocs.ts, src/commands/synthesize.ts -> src/docs/writeDocs.ts. Test consumers: test/generateDocs.test.ts -> src/docs/generateAgentContextDoc.ts, src/docs/generateArchitectureDoc.ts, test/agentsMd.test.ts -> src/docs/generateAgentsMd.ts, test/detectTests.test.ts -> src/docs/generateAgentsMd.ts. Common change paths: Read the module entry files first: src/docs/writeDocs.ts, src/docs/generateAgentsMd.ts, src/docs/generateFlowDocs.ts - These are the strongest module starting points. (evidence: src/docs/writeDocs.ts, src/docs/generateAgentsMd.ts, src/docs/generateFlowDocs.ts); Inspect runtime consumers before changing shared code: src/commands/generate.ts, src/docs/writeDocs.ts, src/commands/review.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/generate.ts, src/docs/writeDocs.ts, src/commands/review.ts); Review test consumers before changing behavior: test/generateDocs.test.ts, src/docs/generateAgentContextDoc.ts, src/docs/generateArchitectureDoc.ts - These tests show expected behavior around the module boundary. (evidence: test/generateDocs.test.ts, src/docs/generateAgentContextDoc.ts, src/docs/generateArchitectureDoc.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/agentsMd.test.ts:2, test/detectTests.test.ts:2, test/generateDocs.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/agentsMd.test.ts:2, test/detectTests.test.ts:2, test/generateDocs.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/docs/generateAgentContextDoc.ts -> src/docs/repoWikiCli.ts.

## Module Areas

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).

## Area Summaries

- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](../areas/generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…

## Entry Files

- `src/docs/writeDocs.ts:28` - Imported by 4 external files.
- `src/docs/generateAgentsMd.ts:13` - Imported by 2 external files.
- `src/docs/generateFlowDocs.ts:18` - Imported by 1 external file.
- `src/docs/generateAreaDoc.ts:15` - Imported by 1 external file.
- `src/docs/generateArchitectureDoc.ts:17` - Imported by 1 external file.

## Area Flows

- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)
- `Core application logic: storage (src/storage)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (12 imports)
- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (110 imports)
- `Shared support: types (src/types) + utils (src/utils)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)

## Entry Points

- `test/agentsMd.test.ts:2` covers `src/docs/generateAgentsMd.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/generateDocs.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateIndexDoc.ts`, `src/docs/generateModuleDoc.ts`, `src/docs/generateQualityDoc.ts`, `src/types/index.ts`
- `src/commands/generate.ts` imports this module
- `src/commands/review.ts` imports this module
- `src/commands/synthesize.ts` imports this module
- `src/commands/update.ts` imports this module
- `test/agentsMd.test.ts` imports this module
- `test/detectTests.test.ts` imports this module
- `test/generateDocs.test.ts` imports this module

## Common Change Paths

- `Read the module entry files first` -> `src/docs/writeDocs.ts`, `src/docs/generateAgentsMd.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateAreaDoc.ts` - These are the strongest module starting points. (evidence: `src/docs/writeDocs.ts`, `src/docs/generateAgentsMd.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateAreaDoc.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/generate.ts`, `src/docs/writeDocs.ts`, `src/commands/review.ts`, `src/commands/synthesize.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/generate.ts`, `src/docs/writeDocs.ts`, `src/commands/review.ts`, `src/commands/synthesize.ts`)
- `Review test consumers before changing behavior` -> `test/generateDocs.test.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts` - These tests show expected behavior around the module boundary. (evidence: `test/generateDocs.test.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`)
- `Change module implementation files together` -> `src/docs/writeDocs.ts`, `src/docs/generateAgentsMd.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateAreaDoc.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/docs/generateAgentContextDoc.ts`, `src/docs/generateAgentsMd.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`)

## Module Connections

- `docs (src/docs) -> diagrams (src/diagrams)` (2 imports)
- `docs (src/docs) -> knowledge (src/knowledge)` (33 imports)
- `docs (src/docs) -> types (src/types)` (13 imports)
- `docs (src/docs) -> utils (src/utils)` (65 imports)
- `docs (src/docs) <- commands (src/commands)` (4 imports)

## Internal Flow

- `src/docs/generateAgentContextDoc.ts` -> `src/docs/repoWikiCli.ts`
- `src/docs/generateAgentsMd.ts` -> `src/docs/repoWikiCli.ts`
- `src/docs/generateIndexDoc.ts` -> `src/docs/repoWikiCli.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateAgentContextDoc.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateAgentsMd.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateArchitectureDoc.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateAreaDoc.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateAreasIndexDoc.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateCodexReviewDoc.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateFlowDocs.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateIndexDoc.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateModuleDoc.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateQualityDoc.ts`
- `src/docs/writeDocs.ts` -> `src/docs/generateSetupDoc.ts`

## External Dependencies

- `node:fs/promises`
- `node:path`

## Runtime Consumers

- `src/commands/generate.ts` -> `src/docs/writeDocs.ts` (1 imports into this module)
- `src/commands/review.ts` -> `src/docs/writeDocs.ts` (1 imports into this module)
- `src/commands/synthesize.ts` -> `src/docs/writeDocs.ts` (1 imports into this module)
- `src/commands/update.ts` -> `src/docs/writeDocs.ts` (1 imports into this module)

## Test Consumers

- `test/generateDocs.test.ts` -> `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts` (8 imports into this module)
- `test/agentsMd.test.ts` -> `src/docs/generateAgentsMd.ts` (1 imports into this module)
- `test/detectTests.test.ts` -> `src/docs/generateAgentsMd.ts` (1 imports into this module)

## Related Tests

- `test/agentsMd.test.ts:2` covers `src/docs/generateAgentsMd.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/generateDocs.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentContextDoc.ts`, `src/docs/generateArchitectureDoc.ts`, `src/docs/generateAreaDoc.ts`, `src/docs/generateAreasIndexDoc.ts`, `src/docs/generateFlowDocs.ts`, `src/docs/generateIndexDoc.ts`, `src/docs/generateModuleDoc.ts`, `src/docs/generateQualityDoc.ts`, `src/types/index.ts`

## Change Targets

- `src/docs/generateFlowDocs.ts:18` - A connected implementation file with both imports and exports. [Symbols: generateFlowsIndexDoc@18, generateModuleFlowDoc@86]
- `src/docs/generateArchitectureDoc.ts:17` - A connected implementation file with both imports and exports. [Symbols: generateArchitectureDoc@17]
- `src/docs/writeDocs.ts:28` - A connected implementation file with both imports and exports. [Symbols: writeDocs@28]
- `src/docs/generateAreaDoc.ts:15` - A connected implementation file with both imports and exports. [Symbols: generateAreaDoc@15]
- `src/docs/generateAgentContextDoc.ts:17` - A connected implementation file with both imports and exports. [Symbols: generateAgentContextDoc@17]

## Verification

- Run: `npm run build`
- Related tests: `test/agentsMd.test.ts:2`, `test/detectTests.test.ts:2`, `test/generateDocs.test.ts:2`
- Run: `npm run test`
