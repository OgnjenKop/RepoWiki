# Core application logic: storage (src/storage)

## Purpose

Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage.

## Summary

Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage. Modules: storage (src/storage). Root paths: src/storage. Entry files: src/storage/metadataStore.ts:98. Runtime consumers: src/commands/check.ts -> src/storage/metadataStore.ts, src/commands/generate.ts -> src/storage/metadataStore.ts, src/commands/review.ts -> src/storage/metadataStore.ts. Test consumers: test/metadataArtifacts.test.ts -> src/storage/metadataStore.ts, test/metadataStore.test.ts -> src/storage/metadataStore.ts. Incoming area flows: Operations and entry points: cli (src/cli.ts) + commands (src/commands) -> Core application logic: storage (src/storage). Outgoing area flows: Core application logic: storage (src/storage) -> Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more, Core application logic: storage (src/storage) -> Shared support: types (src/types) + utils (src/utils). Common change paths: Read the module entry files first: src/storage/metadataStore.ts - These are the strongest module starting points. (evidence: src/storage/metadataStore.ts); Inspect runtime consumers before changing shared code: src/commands/check.ts, src/storage/metadataStore.ts, src/commands/generate.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/check.ts, src/storage/metadataStore.ts, src/commands/generate.ts); Review test consumers before changing behavior: test/metadataArtifacts.test.ts, src/storage/metadataStore.ts, test/metadataStore.test.ts - These tests show expected behavior around the module boundary. (evidence: test/metadataArtifacts.test.ts, src/storage/metadataStore.ts, test/metadataStore.test.ts). Verification: Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json) Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json) Inspect related tests: test/metadataArtifacts.test.ts:5, test/metadataStore.test.ts:5 - These tests cover files in the area. (evidence: test/metadataArtifacts.test.ts:5, test/metadataStore.test.ts:5)

## Modules

- [storage (src/storage)](../modules/src-storage.md) - 1 file

## Entry Files

- `src/storage/metadataStore.ts:98` - Imported by 6 external files.

## Root Paths

- `src/storage`

## Key Files

- `src/storage/metadataStore.ts`

## Module Connections

_No module-to-module connections detected in this area._

## Area Flows In

- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: storage (src/storage)` (4 imports)

## Area Flows Out

- `Core application logic: storage (src/storage)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)
- `Core application logic: storage (src/storage)` -> `Shared support: types (src/types) + utils (src/utils)` (3 imports)

## Runtime Consumers

- `src/commands/check.ts` -> `src/storage/metadataStore.ts` (1 imports into this area)
- `src/commands/generate.ts` -> `src/storage/metadataStore.ts` (1 imports into this area)
- `src/commands/review.ts` -> `src/storage/metadataStore.ts` (1 imports into this area)
- `src/commands/update.ts` -> `src/storage/metadataStore.ts` (1 imports into this area)

## Test Consumers

- `test/metadataArtifacts.test.ts` -> `src/storage/metadataStore.ts` (1 imports into this area)
- `test/metadataStore.test.ts` -> `src/storage/metadataStore.ts` (1 imports into this area)

## Common Change Paths

- `Read the module entry files first` -> `src/storage/metadataStore.ts` - These are the strongest module starting points. (evidence: `src/storage/metadataStore.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/check.ts`, `src/storage/metadataStore.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/check.ts`, `src/storage/metadataStore.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)
- `Review test consumers before changing behavior` -> `test/metadataArtifacts.test.ts`, `src/storage/metadataStore.ts`, `test/metadataStore.test.ts` - These tests show expected behavior around the module boundary. (evidence: `test/metadataArtifacts.test.ts`, `src/storage/metadataStore.ts`, `test/metadataStore.test.ts`)
- `Change module implementation files together` -> `src/storage/metadataStore.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/storage/metadataStore.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)

## Change Guidance

- `src/storage/metadataStore.ts:98` - A connected implementation file with both imports and exports. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]
- `src/commands/update.ts:87` - A directly connected implementation file. [Symbols: updateCommand@9, getAffectedModules@46, getAffectedRoutes@71, getAffectedAreas@87]
- `test/metadataArtifacts.test.ts:5` - A directly connected implementation file. (Update the test expectations if behavior changes.)
- `src/commands/check.ts:4` - A directly connected implementation file. [Symbols: checkCommand@4]
- `src/commands/generate.ts:7` - A directly connected implementation file. [Symbols: generateCommand@7]
- `src/commands/review.ts:7` - A directly connected implementation file. [Symbols: reviewCommand@7]
- `test/metadataStore.test.ts:5` - Tests that verify this area. (Update the test expectations if behavior changes.)

## Verification

- Run the project build: package.json - Use the build script after changing the area. Command: npm run build. (evidence: package.json)
- Run the project test suite: package.json - Use the package test script after changing the area. Command: npm run test. (evidence: package.json)
- Inspect related tests: test/metadataArtifacts.test.ts:5, test/metadataStore.test.ts:5 - These tests cover files in the area. (evidence: test/metadataArtifacts.test.ts:5, test/metadataStore.test.ts:5)

## Related Tests

- `test/metadataArtifacts.test.ts:5` covers `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts`
- `test/metadataStore.test.ts:5` covers `src/storage/metadataStore.ts`

## Related Routes

_No related routes detected._

## Files

- `src/storage/metadataStore.ts`

## Navigation

- [Areas index](index.md)
- [Repo wiki index](../index.md)
- [Flow overview](../flows/index.md)

## Notes

- This page groups modules that appear to belong to the same functional area.
- Use the linked module pages for file-level details.
- Use the flow overview for cross-area movement.
