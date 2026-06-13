# Core application logic: graph (src/graph) + scanner (src/scanner)

## Purpose

Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner).

## Summary

Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner). Root paths: src/graph, src/scanner. Entry files: src/scanner/scanRepo.ts:49, src/scanner/detectModules.ts:54, src/scanner/fileClassifiers.ts:13. Runtime consumers: src/commands/check.ts -> src/scanner/scanRepo.ts, src/commands/generate.ts -> src/scanner/scanRepo.ts, src/commands/review.ts -> src/scanner/scanRepo.ts. Test consumers: test/buildGraph.test.ts -> src/graph/buildGraph.ts, test/detectEnvVars.test.ts -> src/scanner/detectEnvVars.ts, test/detectModules.test.ts -> src/scanner/detectModules.ts. Incoming area flows: Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: graph (src/graph) + scanner (src/scanner). Outgoing area flows: Core application logic: graph (src/graph) + scanner (src/scanner) -> Shared support: types (src/types) + utils (src/utils), Core application logic: graph (src/graph) + scanner (src/scanner) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Common change paths: Read the module entry files first: src/scanner/scanRepo.ts, src/scanner/detectModules.ts, src/scanner/fileClassifiers.ts - These are the strongest module starting points. (evidence: src/scanner/scanRepo.ts, src/scanner/detectModules.ts, src/scanner/fileClassifiers.ts); Inspect runtime consumers before changing shared code: src/commands/check.ts, src/scanner/scanRepo.ts, src/commands/generate.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/check.ts, src/scanner/scanRepo.ts, src/commands/generate.ts); Review test consumers before changing behavior: test/buildGraph.test.ts, src/graph/buildGraph.ts, test/detectEnvVars.test.ts - These tests show expected behavior around the module boundary. (evidence: test/buildGraph.test.ts, src/graph/buildGraph.ts, test/detectEnvVars.test.ts). Verification: Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json) Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json) Inspect related tests: test/buildGraph.test.ts:2, test/detectEnvVars.test.ts:2, test/detectModules.test.ts:2 - These tests cover files in the area. (evidence: test/buildGraph.test.ts:2, test/detectEnvVars.test.ts:2, test/detectModules.test.ts:2)

## Modules

- [graph (src/graph)](../modules/src-graph.md) - 1 file
- [scanner (src/scanner)](../modules/src-scanner.md) - 9 files

## Entry Files

- `src/scanner/scanRepo.ts:49` - Imported by 7 external files.
- `src/scanner/detectModules.ts:54` - Imported by 1 external file.
- `src/scanner/fileClassifiers.ts:13` - Imported by 1 external file.
- `src/scanner/detectProject.ts:57` - Imported by 1 external file.
- `src/scanner/detectTests.ts:6` - Imported by 1 external file.

## Root Paths

- `src/graph`
- `src/scanner`

## Key Files

- `src/scanner/scanRepo.ts`
- `src/scanner/fileClassifiers.ts`
- `src/scanner/detectModules.ts`
- `src/scanner/detectProject.ts`
- `src/scanner/detectTests.ts`
- `src/graph/buildGraph.ts`
- `src/scanner/detectPathAliases.ts`
- `src/scanner/detectEnvVars.ts`

## Module Connections

- `scanner (src/scanner) -> graph (src/graph)`

## Area Flows In

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: graph (src/graph) + scanner (src/scanner)` (4 imports)

## Area Flows Out

- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Shared support: types (src/types) + utils (src/utils)` (20 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)

## Runtime Consumers

- `src/commands/check.ts` -> `src/scanner/scanRepo.ts` (1 imports into this area)
- `src/commands/generate.ts` -> `src/scanner/scanRepo.ts` (1 imports into this area)
- `src/commands/review.ts` -> `src/scanner/scanRepo.ts` (1 imports into this area)
- `src/commands/update.ts` -> `src/scanner/scanRepo.ts` (1 imports into this area)

## Test Consumers

- `test/buildGraph.test.ts` -> `src/graph/buildGraph.ts` (1 imports into this area)
- `test/detectEnvVars.test.ts` -> `src/scanner/detectEnvVars.ts` (1 imports into this area)
- `test/detectModules.test.ts` -> `src/scanner/detectModules.ts` (1 imports into this area)
- `test/detectPathAliases.test.ts` -> `src/scanner/detectPathAliases.ts` (1 imports into this area)

## Common Change Paths

- `Read the module entry files first` -> `src/scanner/scanRepo.ts`, `src/scanner/detectModules.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectProject.ts` - These are the strongest module starting points. (evidence: `src/scanner/scanRepo.ts`, `src/scanner/detectModules.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectProject.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/check.ts`, `src/scanner/scanRepo.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/check.ts`, `src/scanner/scanRepo.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)
- `Review test consumers before changing behavior` -> `test/buildGraph.test.ts`, `src/graph/buildGraph.ts`, `test/detectEnvVars.test.ts`, `src/scanner/detectEnvVars.ts` - These tests show expected behavior around the module boundary. (evidence: `test/buildGraph.test.ts`, `src/graph/buildGraph.ts`, `test/detectEnvVars.test.ts`, `src/scanner/detectEnvVars.ts`)
- `Change module implementation files together` -> `src/scanner/scanRepo.ts`, `src/scanner/detectModules.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectProject.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/graph/buildGraph.ts`, `src/scanner/detectEnvVars.ts`, `src/scanner/detectModules.ts`, `src/scanner/detectPathAliases.ts`)

## Change Guidance

- `src/scanner/scanRepo.ts:49` - A connected implementation file with both imports and exports. [Symbols: scanRepo@49]
- `src/commands/update.ts:87` - A directly connected implementation file. [Symbols: updateCommand@9, getAffectedModules@46, getAffectedRoutes@71, getAffectedAreas@87]
- `src/scanner/detectProject.ts:57` - A connected implementation file with both imports and exports. [Symbols: detectProject@14, detectProjectType@46, detectPackageManager@57]
- `src/scanner/detectModules.ts:54` - A connected implementation file with both imports and exports. [Symbols: detectModules@54]
- `src/scanner/detectTests.ts:6` - A connected implementation file with both imports and exports. [Symbols: detectTests@6]
- `src/scanner/fileClassifiers.ts:13` - A connected implementation file with both imports and exports. [Symbols: isTestFile@5, isMarkdownFile@9, isCodeFile@13, isEnvFile@17]
- `src/graph/buildGraph.ts:4` - A connected implementation file with both imports and exports. [Symbols: buildGraph@4]
- `src/scanner/detectPathAliases.ts:15` - A connected implementation file with both imports and exports. [Symbols: detectPathAliases@15]

## Verification

- Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json)
- Inspect related tests: test/buildGraph.test.ts:2, test/detectEnvVars.test.ts:2, test/detectModules.test.ts:2 - These tests cover files in the area. (evidence: test/buildGraph.test.ts:2, test/detectEnvVars.test.ts:2, test/detectModules.test.ts:2)

## Related Tests

- `test/buildGraph.test.ts:2` covers `src/graph/buildGraph.ts`, `src/types/index.ts`
- `test/detectEnvVars.test.ts:2` covers `src/scanner/detectEnvVars.ts`, `src/types/index.ts`
- `test/detectModules.test.ts:2` covers `src/scanner/detectModules.ts`, `src/types/index.ts`
- `test/detectPathAliases.test.ts:5` covers `src/scanner/detectPathAliases.ts`
- `test/detectProject.test.ts:5` covers `src/scanner/detectProject.ts`
- `test/detectRoutes.test.ts:2` covers `src/scanner/detectRoutes.ts`
- `test/detectTests.test.ts:2` covers `src/cli.ts`, `src/docs/generateAgentsMd.ts`, `src/scanner/detectTests.ts`, `src/types/index.ts`
- `test/fileClassifiers.test.ts:2` covers `src/scanner/fileClassifiers.ts`
- `test/knowledge.test.ts:5` covers `src/knowledge/areaOrdering.ts`, `src/knowledge/buildKnowledge.ts`, `src/knowledge/moduleFocus.ts`, `src/scanner/scanRepo.ts`
- `test/metadataArtifacts.test.ts:5` covers `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts`
- `test/parseFiles.test.ts:2` covers `src/scanner/parseFiles.ts`
- `test/scanRepo.test.ts:5` covers `src/scanner/scanRepo.ts`

## Related Routes

_No related routes detected._

## Files

- `src/graph/buildGraph.ts`
- `src/scanner/detectEnvVars.ts`
- `src/scanner/detectModules.ts`
- `src/scanner/detectPathAliases.ts`
- `src/scanner/detectProject.ts`
- `src/scanner/detectRoutes.ts`
- `src/scanner/detectTests.ts`
- `src/scanner/fileClassifiers.ts`
- `src/scanner/parseFiles.ts`
- `src/scanner/scanRepo.ts`

## Navigation

- [Areas index](index.md)
- [Repo wiki index](../index.md)
- [Flow overview](../flows/index.md)

## Notes

- This page groups modules that appear to belong to the same functional area.
- Use the linked module pages for file-level details.
- Use the flow overview for cross-area movement.
