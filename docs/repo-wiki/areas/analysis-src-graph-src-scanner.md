# Core application logic: graph (src/graph) + scanner (src/scanner)

**Navigation:** [Wiki](../index.md) → [Areas](index.md) → Core application logic: graph (src/graph) + scanner (src/scanner)

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Modules** | **Files** | **Tests** | **Entry files** |
| 2 | 13 | 15 | 5 |
| in this area | scanned | covering files | imported by others |

## What This Area Is

Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner). Root paths: src/graph, src/scanner. Entry files: src/scanner/scanRepo.ts:64, src/scanner/detectDesignTokens.ts:18, src/scanner/fileClassifiers.ts:13. Runtime consumers: src/commands/check.ts -> src/scanner/scanRepo.ts, src/commands/generate.ts -> src/scanner/scanRepo.ts, src/commands/review.ts -> src/scanner/scanRepo.ts. Test consumers: test/buildGraph.test.ts -> src/graph/buildGraph.ts, test/detectComponents.test.ts -> src/scanner/detectComponents.ts, test/detectDesignSystem.test.ts -> src/scanner/detectDesignSystem.ts. Incoming area flows: Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: graph (src/graph) + scanner (src/scanner). Outgoing area flows: Core application logic: graph (src/graph) + scanner (src/scanner) -> Shared support: types (src/types) + utils (src/utils), Core application logic: graph (src/graph) + scanner (src/scanner) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more. Common change paths: Read the module entry files first: src/scanner/scanRepo.ts, src/scanner/detectDesignTokens.ts, src/scanner/fileClassifiers.ts - These are the strongest module starting points. (evidence: src/scanner/scanRepo.ts, src/scanner/detectDesignTokens.ts, src/scanner/fileClassifiers.ts); Inspect runtime consumers before changing shared code: src/commands/check.ts, src/scanner/scanRepo.ts, src/commands/generate.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/check.ts, src/scanner/scanRepo.ts, src/commands/generate.ts); Review test consumers before changing behavior: test/buildGraph.test.ts, src/graph/buildGraph.ts - These tests show expected behavior around the module boundary. (evidence: test/buildGraph.test.ts, src/graph/buildGraph.ts). Verification: Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json) Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json) Inspect related tests: test/buildGraph.test.ts:2, test/detectComponents.test.ts:2, test/detectDesignSystem.test.ts:2 - These tests cover files in the area. (evidence: test/buildGraph.test.ts:2, test/detectComponents.test.ts:2, test/detectDesignSystem.test.ts:2)

> **ℹ️ Purpose**
>
> Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner).

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

- [graph (src/graph)](../modules/src-graph.md) — 1 file
- [scanner (src/scanner)](../modules/src-scanner.md) — 12 files

## Entry Files

- `src/scanner/scanRepo.ts:64` — Imported by 8 external files.
- `src/scanner/detectDesignTokens.ts:18` — Imported by 1 external file.
- `src/scanner/fileClassifiers.ts:13` — Imported by 1 external file.
- `src/scanner/detectModules.ts:54` — Imported by 1 external file.
- `src/scanner/detectProject.ts:57` — Imported by 1 external file.

## Root Paths

- `src/graph`
- `src/scanner`

## Key Files

> **💡 What makes a file "key"?**
>
> Key files are the ones other files import from most often within this area. They're the highest-leverage files to read.

- `src/scanner/scanRepo.ts`
- `src/scanner/detectDesignTokens.ts`
- `src/scanner/fileClassifiers.ts`
- `src/scanner/detectModules.ts`
- `src/scanner/detectProject.ts`
- `src/scanner/detectDesignSystem.ts`
- `src/scanner/detectTests.ts`
- `src/graph/buildGraph.ts`

## Module Connections

- `scanner (src/scanner) → graph (src/graph)`

## Area Flows

## Flows In

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Core application logic: graph (src/graph) + scanner (src/scanner)` (5 imports)


## Flows Out

- `Core application logic: graph (src/graph) + scanner (src/scanner)` → `Shared support: types (src/types) + utils (src/utils)` (25 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)


## Consumers

## Runtime Consumers

- `src/commands/check.ts` -> `src/scanner/scanRepo.ts` (1 imports into this area)
- `src/commands/generate.ts` -> `src/scanner/scanRepo.ts` (1 imports into this area)
- `src/commands/review.ts` -> `src/scanner/scanRepo.ts` (1 imports into this area)
- `src/commands/synthesize.ts` -> `src/scanner/scanRepo.ts` (1 imports into this area)
- `src/commands/update.ts` -> `src/scanner/scanRepo.ts` (1 imports into this area)


## Test Consumers

- `test/buildGraph.test.ts` -> `src/graph/buildGraph.ts` (1 imports into this area)
- `test/detectComponents.test.ts` -> `src/scanner/detectComponents.ts` (1 imports into this area)
- `test/detectDesignSystem.test.ts` -> `src/scanner/detectDesignSystem.ts` (1 imports into this area)


## Common Change Paths

- `Read the module entry files first` -> `src/scanner/scanRepo.ts`, `src/scanner/detectDesignTokens.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectModules.ts` - These are the strongest module starting points. (evidence: `src/scanner/scanRepo.ts`, `src/scanner/detectDesignTokens.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectModules.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/check.ts`, `src/scanner/scanRepo.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/check.ts`, `src/scanner/scanRepo.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)
- `Review test consumers before changing behavior` -> `test/buildGraph.test.ts`, `src/graph/buildGraph.ts` - These tests show expected behavior around the module boundary. (evidence: `test/buildGraph.test.ts`, `src/graph/buildGraph.ts`)
- `Change module implementation files together` -> `src/scanner/scanRepo.ts`, `src/scanner/detectDesignTokens.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectModules.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/graph/buildGraph.ts`, `src/scanner/detectComponents.ts`, `src/scanner/detectDesignSystem.ts`, `src/scanner/detectDesignTokens.ts`)

## Change Guidance

- `src/scanner/scanRepo.ts:64` — A connected implementation file with both imports and exports. [Symbols: scanRepo@64]
- `src/commands/update.ts:92` — A directly connected implementation file. [Symbols: updateCommand@11, getAffectedModules@51, getAffectedRoutes@76, getAffectedAreas@92]
- `src/scanner/detectDesignTokens.ts:18` — A connected implementation file with both imports and exports. [Symbols: detectDesignTokens@18, isTokenFile@32]
- `src/scanner/detectProject.ts:57` — A connected implementation file with both imports and exports. [Symbols: detectProject@14, detectProjectType@46, detectPackageManager@57]
- `src/scanner/detectModules.ts:54` — A connected implementation file with both imports and exports. [Symbols: detectModules@54]
- `src/scanner/fileClassifiers.ts:13` — A connected implementation file with both imports and exports. [Symbols: isTestFile@5, isMarkdownFile@9, isCodeFile@13, isEnvFile@17]
- `src/scanner/detectTests.ts:6` — A connected implementation file with both imports and exports. [Symbols: detectTests@6]
- `src/graph/buildGraph.ts:4` — A connected implementation file with both imports and exports. [Symbols: buildGraph@4]

## Verification

- Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json)
- Inspect related tests: test/buildGraph.test.ts:2, test/detectComponents.test.ts:2, test/detectDesignSystem.test.ts:2 - These tests cover files in the area. (evidence: test/buildGraph.test.ts:2, test/detectComponents.test.ts:2, test/detectDesignSystem.test.ts:2)

## Related Tests

- `test/buildGraph.test.ts:2` covers `src/graph/buildGraph.ts`, `src/types/index.ts`
- `test/detectComponents.test.ts:2` covers `src/scanner/detectComponents.ts`
- `test/detectDesignSystem.test.ts:2` covers `src/scanner/detectDesignSystem.ts`, `src/types/index.ts`
- `test/detectDesignTokens.test.ts:2` covers `src/scanner/detectDesignTokens.ts`
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
- `src/scanner/detectComponents.ts`
- `src/scanner/detectDesignSystem.ts`
- `src/scanner/detectDesignTokens.ts`
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
