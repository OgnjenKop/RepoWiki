# Scanner

## Purpose

Likely scans files and builds repository graph metadata. 9 files belong to this module. Main files: src/scanner/detectEnvVars.ts, src/scanner/detectModules.ts, src/scanner/detectPathAliases.ts, src/scanner/detectProject.ts. Entry files: src/scanner/scanRepo.ts:49, src/scanner/detectModules.ts:54, src/scanner/fileClassifiers.ts:13. Module areas: Core application logic: graph (src/graph) + scanner (src/scanner). Exported symbols include detectEnvVars (src/scanner/detectEnvVars.ts:5), detectModules (src/scanner/detectModules.ts:54), detectPathAliases (src/scanner/detectPathAliases.ts:15), detectPackageManager (src/scanner/detectProject.ts:57), detectProject (src/scanner/detectProject.ts:14), detectProjectType (src/scanner/detectProject.ts:46), detectRoutes (src/scanner/detectRoutes.ts:4), detectTests (src/scanner/detectTests.ts:6). Used by: src/commands/check.ts, src/commands/generate.ts, src/commands/review.ts, src/commands/update.ts. Runtime consumers: src/commands/check.ts -> src/scanner/scanRepo.ts, src/commands/generate.ts -> src/scanner/scanRepo.ts, src/commands/review.ts -> src/scanner/scanRepo.ts. Test consumers: test/detectEnvVars.test.ts -> src/scanner/detectEnvVars.ts, test/detectModules.test.ts -> src/scanner/detectModules.ts, test/detectPathAliases.test.ts -> src/scanner/detectPathAliases.ts. Common change paths: Read the module entry files first: src/scanner/scanRepo.ts, src/scanner/detectModules.ts, src/scanner/fileClassifiers.ts - These are the strongest module starting points. (evidence: src/scanner/scanRepo.ts, src/scanner/detectModules.ts, src/scanner/fileClassifiers.ts); Inspect runtime consumers before changing shared code: src/commands/check.ts, src/scanner/scanRepo.ts, src/commands/generate.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/check.ts, src/scanner/scanRepo.ts, src/commands/generate.ts); Review test consumers before changing behavior: test/detectEnvVars.test.ts, src/scanner/detectEnvVars.ts, test/detectModules.test.ts - These tests show expected behavior around the module boundary. (evidence: test/detectEnvVars.test.ts, src/scanner/detectEnvVars.ts, test/detectModules.test.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/detectEnvVars.test.ts:2, test/detectModules.test.ts:2, test/detectPathAliases.test.ts:5 - These tests exercise module behavior or its direct targets. (evidence: test/detectEnvVars.test.ts:2, test/detectModules.test.ts:2, test/detectPathAliases.test.ts:5) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json) Internal flow: src/scanner/detectTests.ts -> src/scanner/fileClassifiers.ts.

## Module Path

`src/scanner`

## Module Areas

- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner).

## Area Summaries

- [Core application logic: graph (src/graph) + scanner (src/scanner)](../areas/analysis-src-graph-src-scanner.md) - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…

## Entry Files

- `src/scanner/scanRepo.ts:49` - Imported by 7 external files.
- `src/scanner/detectModules.ts:54` - Imported by 1 external file.
- `src/scanner/fileClassifiers.ts:13` - Imported by 1 external file.
- `src/scanner/detectProject.ts:57` - Imported by 1 external file.
- `src/scanner/detectTests.ts:6` - Imported by 1 external file.

## Main Files

- `src/scanner/detectEnvVars.ts`
- `src/scanner/detectModules.ts`
- `src/scanner/detectPathAliases.ts`
- `src/scanner/detectProject.ts`
- `src/scanner/detectRoutes.ts`
- `src/scanner/detectTests.ts`
- `src/scanner/fileClassifiers.ts`
- `src/scanner/parseFiles.ts`
- `src/scanner/scanRepo.ts`

## Exported Symbols

- `detectEnvVars` from `src/scanner/detectEnvVars.ts:5`
- `detectModules` from `src/scanner/detectModules.ts:54`
- `detectPathAliases` from `src/scanner/detectPathAliases.ts:15`
- `detectPackageManager` from `src/scanner/detectProject.ts:57`
- `detectProject` from `src/scanner/detectProject.ts:14`
- `detectProjectType` from `src/scanner/detectProject.ts:46`
- `detectRoutes` from `src/scanner/detectRoutes.ts:4`
- `detectTests` from `src/scanner/detectTests.ts:6`
- `isCodeFile` from `src/scanner/fileClassifiers.ts:13`
- `isEnvFile` from `src/scanner/fileClassifiers.ts:17`
- `isMarkdownFile` from `src/scanner/fileClassifiers.ts:9`
- `isTestFile` from `src/scanner/fileClassifiers.ts:5`
- `shouldDetectEnvVars` from `src/scanner/fileClassifiers.ts:25`
- `shouldDetectRuntimeSignals` from `src/scanner/fileClassifiers.ts:21`
- `parseImports` from `src/scanner/parseFiles.ts:4`
- `scanRepo` from `src/scanner/scanRepo.ts:49`

## Internal Dependencies

- `src/scanner/detectTests.ts` -> `src/scanner/fileClassifiers.ts`
- `src/scanner/scanRepo.ts` -> `src/scanner/detectEnvVars.ts`
- `src/scanner/scanRepo.ts` -> `src/scanner/detectModules.ts`
- `src/scanner/scanRepo.ts` -> `src/scanner/detectPathAliases.ts`
- `src/scanner/scanRepo.ts` -> `src/scanner/detectProject.ts`
- `src/scanner/scanRepo.ts` -> `src/scanner/detectRoutes.ts`
- `src/scanner/scanRepo.ts` -> `src/scanner/detectTests.ts`
- `src/scanner/scanRepo.ts` -> `src/scanner/fileClassifiers.ts`
- `src/scanner/scanRepo.ts` -> `src/scanner/parseFiles.ts`

## External Dependencies

- `fast-glob`
- `node:fs/promises`
- `node:path`

## Runtime Consumers

- `src/commands/check.ts` -> `src/scanner/scanRepo.ts` (1 imports into this module)
- `src/commands/generate.ts` -> `src/scanner/scanRepo.ts` (1 imports into this module)
- `src/commands/review.ts` -> `src/scanner/scanRepo.ts` (1 imports into this module)
- `src/commands/update.ts` -> `src/scanner/scanRepo.ts` (1 imports into this module)

## Test Consumers

- `test/detectEnvVars.test.ts` -> `src/scanner/detectEnvVars.ts` (1 imports into this module)
- `test/detectModules.test.ts` -> `src/scanner/detectModules.ts` (1 imports into this module)
- `test/detectPathAliases.test.ts` -> `src/scanner/detectPathAliases.ts` (1 imports into this module)
- `test/detectProject.test.ts` -> `src/scanner/detectProject.ts` (1 imports into this module)

## Common Change Paths

- `Read the module entry files first` -> `src/scanner/scanRepo.ts`, `src/scanner/detectModules.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectProject.ts` - These are the strongest module starting points. (evidence: `src/scanner/scanRepo.ts`, `src/scanner/detectModules.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectProject.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/check.ts`, `src/scanner/scanRepo.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/check.ts`, `src/scanner/scanRepo.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)
- `Review test consumers before changing behavior` -> `test/detectEnvVars.test.ts`, `src/scanner/detectEnvVars.ts`, `test/detectModules.test.ts`, `src/scanner/detectModules.ts` - These tests show expected behavior around the module boundary. (evidence: `test/detectEnvVars.test.ts`, `src/scanner/detectEnvVars.ts`, `test/detectModules.test.ts`, `src/scanner/detectModules.ts`)
- `Change module implementation files together` -> `src/scanner/scanRepo.ts`, `src/scanner/detectModules.ts`, `src/scanner/fileClassifiers.ts`, `src/scanner/detectProject.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/scanner/detectEnvVars.ts`, `src/scanner/detectModules.ts`, `src/scanner/detectPathAliases.ts`, `src/scanner/detectProject.ts`)

## Related Tests

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

## Change Guidance

- `src/scanner/scanRepo.ts:49` - A connected implementation file with both imports and exports. [Symbols: scanRepo@49]
- `src/commands/update.ts:87` - A directly connected implementation file. [Symbols: updateCommand@9, getAffectedModules@46, getAffectedRoutes@71, getAffectedAreas@87]
- `src/scanner/detectProject.ts:57` - A connected implementation file with both imports and exports. [Symbols: detectProject@14, detectProjectType@46, detectPackageManager@57]
- `src/scanner/detectModules.ts:54` - A connected implementation file with both imports and exports. [Symbols: detectModules@54]
- `src/scanner/detectTests.ts:6` - A connected implementation file with both imports and exports. [Symbols: detectTests@6]

## Decision Points

- Start with `src/scanner/scanRepo.ts:49` if you are changing public behavior.
- Use `src/commands/update.ts:87` as the next stop for supporting logic.
- Check `test/detectEnvVars.test.ts:2` before changing implementation details.

## Verification

- Related tests: `test/detectEnvVars.test.ts:2`, `test/detectModules.test.ts:2`, `test/detectPathAliases.test.ts:5`, `test/detectProject.test.ts:5`, `test/detectRoutes.test.ts:2`, `test/detectTests.test.ts:2`, `test/fileClassifiers.test.ts:2`, `test/knowledge.test.ts:5`, `test/metadataArtifacts.test.ts:5`, `test/parseFiles.test.ts:2`, `test/scanRepo.test.ts:5`
- Run: `npm run test`

## Notes For AI Agents

- Start by reading the main files listed above.
- Treat the purpose as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
