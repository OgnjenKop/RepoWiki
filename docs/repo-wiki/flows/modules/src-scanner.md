# scanner Flow

**Navigation:** [Wiki](../../index.md) → [Flows](../index.md) → scanner

## Overview

Likely scans files and builds repository graph metadata. 12 files belong to this module. Main files: src/scanner/detectComponents.ts, src/scanner/detectDesignSystem.ts, src/scanner/detectDesignTokens.ts, src/scanner/detectEnvVars.ts. Entry files: src/scanner/scanRepo.ts:64, src/scanner/detectDesignTokens.ts:18, src/scanner/fileClassifiers.ts:13. Module areas: Core application logic: graph (src/graph) + scanner (src/scanner). Exported symbols include detectComponents (src/scanner/detectComponents.ts:4), inferFramework (src/scanner/detectComponents.ts:27), buildDesignSystem (src/scanner/detectDesignSystem.ts:10), detectDesignTokens (src/scanner/detectDesignTokens.ts:18), isTokenFile (src/scanner/detectDesignTokens.ts:32), detectEnvVars (src/scanner/detectEnvVars.ts:5), detectModules (src/scanner/detectModules.ts:54), detectPathAliases (src/scanner/detectPathAliases.ts:15). Used by: src/commands/check.ts, src/commands/generate.ts, src/commands/review.ts, src/commands/synthesize.ts. Runtime consumers: src/commands/check.ts -> src/scanner/scanRepo.ts, src/commands/generate.ts -> src/scanner/scanRepo.ts, src/commands/review.ts -> src/scanner/scanRepo.ts. Test consumers: test/detectComponents.test.ts -> src/scanner/detectComponents.ts, test/detectDesignSystem.test.ts -> src/scanner/detectDesignSystem.ts, test/detectDesignTokens.test.ts -> src/scanner/detectDesignTokens.ts. Common change paths: Read the module entry files first: src/scanner/scanRepo.ts, src/scanner/detectDesignTokens.ts, src/scanner/fileClassifiers.ts - These are the strongest module starting points. (evidence: src/scanner/scanRepo.ts, src/scanner/detectDesignTokens.ts, src/scanner/fileClassifiers.ts); Inspect runtime consumers before changing shared code: src/commands/check.ts, src/scanner/scanRepo.ts, src/commands/generate.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/check.ts, src/scanner/scanRepo.ts, src/commands/generate.ts); Review test consumers before changing behavior: test/detectComponents.test.ts, src/scanner/detectComponents.ts - These tests show expected behavior around the module boundary. (evidence: test/detectComponents.test.ts, src/scanner/detectComponents.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/detectComponents.test.ts:2, test/detectDesignSystem.test.ts:2, test/detectDesignTokens.test.ts:2 - These tests exercise module behavior or its direct targets. (evidence: test/detectComponents.test.ts:2, test/detectDesignSystem.test.ts:2, test/detectDesignTokens.test.ts:2) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/scanner/detectTests.ts -> src/scanner/fileClassifiers.ts.

> **ℹ️ Module path**
>
> `src/scanner` contains this module's files.

## Module Areas

- [Core application logic: graph (src/graph) + scanner (src/scanner)](../../areas/analysis-src-graph-src-scanner.md) — Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner).

## Area Summaries

- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) — Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…


## Entry Files

- `src/scanner/scanRepo.ts:64` — Imported by 8 external files.
- `src/scanner/detectDesignTokens.ts:18` — Imported by 1 external file.
- `src/scanner/fileClassifiers.ts:13` — Imported by 1 external file.
- `src/scanner/detectModules.ts:54` — Imported by 1 external file.
- `src/scanner/detectProject.ts:57` — Imported by 1 external file.

## Area Flows

- `Core application logic: graph (src/graph) + scanner (src/scanner)` → `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` → `Shared support: types (src/types) + utils (src/utils)` (25 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` → `Core application logic: graph (src/graph) + scanner (src/scanner)` (5 imports)

## Entry Points

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
- `src/commands/check.ts` imports this module
- `src/commands/generate.ts` imports this module
- `src/commands/review.ts` imports this module
- `src/commands/synthesize.ts` imports this module
- `src/commands/update.ts` imports this module
- `test/detectComponents.test.ts` imports this module
- `test/detectDesignSystem.test.ts` imports this module
- `test/detectDesignTokens.test.ts` imports this module
- `test/detectEnvVars.test.ts` imports this module
- `test/detectModules.test.ts` imports this module
- `test/detectPathAliases.test.ts` imports this module
- `test/detectProject.test.ts` imports this module
- `test/detectRoutes.test.ts` imports this module
- `test/detectTests.test.ts` imports this module
- `test/fileClassifiers.test.ts` imports this module
- `test/knowledge.test.ts` imports this module
- `test/metadataArtifacts.test.ts` imports this module
- `test/parseFiles.test.ts` imports this module
- `test/scanRepo.test.ts` imports this module

## Common Change Paths

- `Read the module entry files first` -> `src/scanner/scanRepo.ts`, `src/scanner/detectDesignTokens.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectModules.ts` - These are the strongest module starting points. (evidence: `src/scanner/scanRepo.ts`, `src/scanner/detectDesignTokens.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectModules.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/check.ts`, `src/scanner/scanRepo.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/check.ts`, `src/scanner/scanRepo.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)
- `Review test consumers before changing behavior` -> `test/detectComponents.test.ts`, `src/scanner/detectComponents.ts` - These tests show expected behavior around the module boundary. (evidence: `test/detectComponents.test.ts`, `src/scanner/detectComponents.ts`)
- `Change module implementation files together` -> `src/scanner/scanRepo.ts`, `src/scanner/detectDesignTokens.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectModules.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/scanner/detectComponents.ts`, `src/scanner/detectDesignSystem.ts`, `src/scanner/detectDesignTokens.ts`, `src/scanner/detectEnvVars.ts`)

## Module Connections

- `scanner (src/scanner) ← commands (src/commands)` (5 imports)
- `scanner (src/scanner) → graph (src/graph)`
- `scanner (src/scanner) → knowledge (src/knowledge)` (2 imports)
- `scanner (src/scanner) → types (src/types)` (11 imports)
- `scanner (src/scanner) → utils (src/utils)` (13 imports)

## Internal Flow

- `src/scanner/detectTests.ts` → `src/scanner/fileClassifiers.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/detectComponents.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/detectDesignSystem.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/detectDesignTokens.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/detectEnvVars.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/detectModules.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/detectPathAliases.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/detectProject.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/detectRoutes.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/detectTests.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/fileClassifiers.ts`
- `src/scanner/scanRepo.ts` → `src/scanner/parseFiles.ts`

## External Dependencies

- `fast-glob`
- `node:fs/promises`
- `node:path`

## Runtime Consumers

- `src/commands/check.ts` -> `src/scanner/scanRepo.ts` (1 imports into this module)
- `src/commands/generate.ts` -> `src/scanner/scanRepo.ts` (1 imports into this module)
- `src/commands/review.ts` -> `src/scanner/scanRepo.ts` (1 imports into this module)
- `src/commands/synthesize.ts` -> `src/scanner/scanRepo.ts` (1 imports into this module)
- `src/commands/update.ts` -> `src/scanner/scanRepo.ts` (1 imports into this module)

## Test Consumers

- `test/detectComponents.test.ts` -> `src/scanner/detectComponents.ts` (1 imports into this module)
- `test/detectDesignSystem.test.ts` -> `src/scanner/detectDesignSystem.ts` (1 imports into this module)
- `test/detectDesignTokens.test.ts` -> `src/scanner/detectDesignTokens.ts` (1 imports into this module)

## Related Tests

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

## Change Targets

- `src/scanner/scanRepo.ts:64` — A connected implementation file with both imports and exports. [Symbols: scanRepo@64]
- `src/commands/update.ts:92` — A directly connected implementation file. [Symbols: updateCommand@11, getAffectedModules@51, getAffectedRoutes@76, getAffectedAreas@92]
- `src/scanner/detectDesignTokens.ts:18` — A connected implementation file with both imports and exports. [Symbols: detectDesignTokens@18, isTokenFile@32]
- `src/scanner/detectProject.ts:57` — A connected implementation file with both imports and exports. [Symbols: detectProject@14, detectProjectType@46, detectPackageManager@57]
- `src/scanner/detectModules.ts:54` — A connected implementation file with both imports and exports. [Symbols: detectModules@54]

## Verification

- Run: `npm run build`
- Related tests: `test/detectComponents.test.ts:2`, `test/detectDesignSystem.test.ts:2`, `test/detectDesignTokens.test.ts:2`, `test/detectEnvVars.test.ts:2`, `test/detectModules.test.ts:2`, `test/detectPathAliases.test.ts:5`, `test/detectProject.test.ts:5`, `test/detectRoutes.test.ts:2`, `test/detectTests.test.ts:2`, `test/fileClassifiers.test.ts:2`, `test/knowledge.test.ts:5`, `test/metadataArtifacts.test.ts:5`, `test/parseFiles.test.ts:2`, `test/scanRepo.test.ts:5`
- Run: `npm run test`
