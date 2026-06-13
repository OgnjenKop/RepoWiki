# Storage

## Purpose

Likely handles persistence, metadata, cached state, or storage-backed records. 1 file belong to this module. Main files: src/storage/metadataStore.ts. Entry files: src/storage/metadataStore.ts:98. Module areas: Core application logic: storage (src/storage). Exported symbols include areaContextFilesFromScan (src/storage/metadataStore.ts:98), areaFilesFromScan (src/storage/metadataStore.ts:86), diffHashes (src/storage/metadataStore.ts:106), fileModulesFromScan (src/storage/metadataStore.ts:78), hasChanges (src/storage/metadataStore.ts:124), hashesFromScan (src/storage/metadataStore.ts:19), hasStoredHashes (src/storage/metadataStore.ts:27), loadHashes (src/storage/metadataStore.ts:23). Used by: src/commands/check.ts, src/commands/generate.ts, src/commands/review.ts, src/commands/update.ts. Runtime consumers: src/commands/check.ts -> src/storage/metadataStore.ts, src/commands/generate.ts -> src/storage/metadataStore.ts, src/commands/review.ts -> src/storage/metadataStore.ts. Test consumers: test/metadataArtifacts.test.ts -> src/storage/metadataStore.ts, test/metadataStore.test.ts -> src/storage/metadataStore.ts. Common change paths: Read the module entry files first: src/storage/metadataStore.ts - These are the strongest module starting points. (evidence: src/storage/metadataStore.ts); Inspect runtime consumers before changing shared code: src/commands/check.ts, src/storage/metadataStore.ts, src/commands/generate.ts - These runtime-like files depend on the module boundary. (evidence: src/commands/check.ts, src/storage/metadataStore.ts, src/commands/generate.ts); Review test consumers before changing behavior: test/metadataArtifacts.test.ts, src/storage/metadataStore.ts, test/metadataStore.test.ts - These tests show expected behavior around the module boundary. (evidence: test/metadataArtifacts.test.ts, src/storage/metadataStore.ts, test/metadataStore.test.ts). Verification: Run the repository build command: package.json - Use the build script after changing the module. Command: npm run build. (evidence: package.json) Inspect related tests: test/metadataArtifacts.test.ts:5, test/metadataStore.test.ts:5 - These tests exercise module behavior or its direct targets. (evidence: test/metadataArtifacts.test.ts:5, test/metadataStore.test.ts:5) Run the repository test command: package.json - Use the project test script after changing the module. Command: npm run test. (evidence: package.json)

## Module Path

`src/storage`

## Module Areas

- [Core application logic: storage (src/storage)](../areas/analysis-src-storage.md) - Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage.

## Area Summaries

- [Core application logic: storage (src/storage)](../areas/analysis-src-storage.md) - Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage. Modules: storage (src/storage). Root paths: src/storage.…

## Entry Files

- `src/storage/metadataStore.ts:98` - Imported by 6 external files.

## Main Files

- `src/storage/metadataStore.ts`

## Exported Symbols

- `MetadataWriteOptions` from `src/storage/metadataStore.ts:9`
- `areaContextFilesFromScan` from `src/storage/metadataStore.ts:98`
- `areaFilesFromScan` from `src/storage/metadataStore.ts:86`
- `diffHashes` from `src/storage/metadataStore.ts:106`
- `fileModulesFromScan` from `src/storage/metadataStore.ts:78`
- `hasChanges` from `src/storage/metadataStore.ts:124`
- `hasStoredHashes` from `src/storage/metadataStore.ts:27`
- `hashesFromScan` from `src/storage/metadataStore.ts:19`
- `loadHashes` from `src/storage/metadataStore.ts:23`
- `loadIndex` from `src/storage/metadataStore.ts:31`
- `moduleContextFilesFromScan` from `src/storage/metadataStore.ts:94`
- `routeContextFilesFromScan` from `src/storage/metadataStore.ts:102`
- `writeMetadata` from `src/storage/metadataStore.ts:35`

## Internal Dependencies

_None detected._

## External Dependencies

- `node:path`

## Runtime Consumers

- `src/commands/check.ts` -> `src/storage/metadataStore.ts` (1 imports into this module)
- `src/commands/generate.ts` -> `src/storage/metadataStore.ts` (1 imports into this module)
- `src/commands/review.ts` -> `src/storage/metadataStore.ts` (1 imports into this module)
- `src/commands/update.ts` -> `src/storage/metadataStore.ts` (1 imports into this module)

## Test Consumers

- `test/metadataArtifacts.test.ts` -> `src/storage/metadataStore.ts` (1 imports into this module)
- `test/metadataStore.test.ts` -> `src/storage/metadataStore.ts` (1 imports into this module)

## Common Change Paths

- `Read the module entry files first` -> `src/storage/metadataStore.ts` - These are the strongest module starting points. (evidence: `src/storage/metadataStore.ts`)
- `Inspect runtime consumers before changing shared code` -> `src/commands/check.ts`, `src/storage/metadataStore.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These runtime-like files depend on the module boundary. (evidence: `src/commands/check.ts`, `src/storage/metadataStore.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)
- `Review test consumers before changing behavior` -> `test/metadataArtifacts.test.ts`, `src/storage/metadataStore.ts`, `test/metadataStore.test.ts` - These tests show expected behavior around the module boundary. (evidence: `test/metadataArtifacts.test.ts`, `src/storage/metadataStore.ts`, `test/metadataStore.test.ts`)
- `Change module implementation files together` -> `src/storage/metadataStore.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts` - These files are part of the same module boundary and likely need coordinated edits. (evidence: `src/storage/metadataStore.ts`, `src/commands/check.ts`, `src/commands/generate.ts`, `src/commands/review.ts`)

## Related Tests

- `test/metadataArtifacts.test.ts:5` covers `src/ai/contextPacks.ts`, `src/scanner/scanRepo.ts`, `src/storage/metadataStore.ts`
- `test/metadataStore.test.ts:5` covers `src/storage/metadataStore.ts`

## Change Guidance

- `src/storage/metadataStore.ts:98` - A connected implementation file with both imports and exports. [Symbols: MetadataWriteOptions@9, hashesFromScan@19, loadHashes@23, hasStoredHashes@27]
- `src/commands/update.ts:87` - A directly connected implementation file. [Symbols: updateCommand@9, getAffectedModules@46, getAffectedRoutes@71, getAffectedAreas@87]
- `test/metadataArtifacts.test.ts:5` - A directly connected implementation file. (Update the test expectations if behavior changes.)
- `src/commands/check.ts:4` - A directly connected implementation file. [Symbols: checkCommand@4]
- `src/commands/generate.ts:7` - A directly connected implementation file. [Symbols: generateCommand@7]

## Decision Points

- Start with `src/storage/metadataStore.ts:98` if you are changing public behavior.
- Use `src/commands/update.ts:87` as the next stop for supporting logic.
- Check `test/metadataArtifacts.test.ts:5` before changing implementation details.

## Verification

- Related tests: `test/metadataArtifacts.test.ts:5`, `test/metadataStore.test.ts:5`
- Run: `npm run test`

## Notes For AI Agents

- Start by reading the main files listed above.
- Treat the purpose as heuristic unless confirmed by code comments, tests, or README content.
- Update this wiki after changing public exports, routing, environment config, or test behavior.
