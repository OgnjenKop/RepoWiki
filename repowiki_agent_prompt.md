# RepoWiki Agent Build Prompt

## Implementation-ready understanding

Build `repowiki` as a deterministic, non-LLM TypeScript CLI that can be run inside any local repository to generate and maintain a Git-friendly Markdown wiki.

The first version should prioritize a working end-to-end loop over deep static analysis:

1. `repowiki generate` scans the current working directory, builds metadata, writes Markdown docs, writes `.repowiki/*.json`, and creates or updates `AGENTS.md`.
2. `repowiki check` rescans the repository, compares current file hashes against `.repowiki/file-hashes.json`, and exits with the correct CI-friendly status code.
3. `repowiki update` performs the same scan, detects changed files, regenerates affected docs plus shared docs, updates metadata, and makes `check` pass again.

This is not a documentation chatbot and should not call OpenAI, Anthropic, Qwen, or any other model provider. All generated text must come from deterministic repository facts, filenames, package metadata, imports, exports, and conservative heuristics.

### MVP scope decisions

- Use regex-based parsing for the initial implementation. Do not add tree-sitter or TypeScript compiler AST parsing yet.
- If no modules are detected under `src/`, `app/`, `pages/`, `server/`, or `packages/`, create a fallback module named `project` from relevant root-level source/config files so acceptance criteria can still be met.
- Route detection should be conservative. Only report routes when patterns are clearly detected, such as Next.js `app`/`pages` routes, Express-style `router.get("/path")`, `app.post("/path")`, or common NestJS controller decorators.
- Database detection should be heuristic-based only. Look for files or folders such as `migrations`, `schema.prisma`, `models`, `entities`, `drizzle`, `typeorm`, `sequelize`, `knex`, or `db`.
- Import graph resolution can start with relative imports and obvious package imports. It does not need full TypeScript path-alias support in the first pass, but the code should isolate resolver logic so aliases can be added later.
- Generated docs must avoid fake certainty. Use phrases like "Detected from file structure" or "Likely related files" when the conclusion is heuristic.
- `simple-git` should be included as requested, but the CLI must still work in directories that are not Git repositories.

### Build sequence

Implement in this order:

1. Scaffold the package:
   - `package.json`
   - `tsconfig.json`
   - CLI executable entry
   - `src/cli.ts`
   - Vitest setup
2. Add shared types for file records, symbols, graph records, modules, routes, env vars, tests, and metadata.
3. Implement utilities:
   - path normalization
   - async filesystem helpers
   - hashing
   - Markdown escaping/formatting
4. Implement scanner:
   - ignore rules
   - relevant file detection
   - binary/large-file exclusion
   - language inference
   - file hashing
5. Implement lightweight parsing:
   - imports
   - exports
   - symbols
   - env vars
   - tests
   - routes
6. Implement project detection and package-manager detection.
7. Implement module detection with the `project` fallback.
8. Implement graph building.
9. Implement metadata storage under `.repowiki/`.
10. Implement Markdown generators.
11. Implement `generate`.
12. Implement `check`.
13. Implement `update`.
14. Add tests for the required behaviors.
15. Update README with usage, generated files, CI example, privacy notes, and roadmap.

### Definition of done for the first build

The first usable version is complete when the following manual flow works in a sample TypeScript/Node repository:

```bash
npm install
npm run build
npm run dev -- generate
npm run dev -- check
```

Then, after editing a relevant source file:

```bash
npm run dev -- check
npm run dev -- update
npm run dev -- check
```

Expected behavior:

- The first `check` exits `0`.
- The second `check`, after a source edit, exits `1`.
- `update` refreshes metadata and docs.
- The final `check` exits `0`.

### Non-goals for the first build

- No web UI.
- No hosted service.
- No LLM calls.
- No embeddings.
- No deep semantic code understanding.
- No perfect framework-specific route or database detection.
- No multi-language static analysis beyond basic file/language classification.

You are building an open-source developer tool called `repowiki`.

Goal:
Build a CLI tool that scans a software repository and generates a Git-native, Markdown-based wiki that explains the codebase for both humans and AI coding agents.

The inspiration is Qoder’s RepoWiki, but this tool should be:
- transparent
- local-first
- Markdown-first
- Git-friendly
- easy to run in CI
- useful for Claude Code, Cursor, OpenCode, Qwen Code, Gemini CLI, etc.

## Core idea

Given a repository, the tool should generate:

```txt
docs/repo-wiki/
  index.md
  architecture.md
  setup.md
  modules/
    <module-name>.md
  agent-context.md
AGENTS.md
.repowiki/
  index.json
  file-hashes.json
  graph.json
  summaries.json
```

The generated wiki should explain:
- what the project does
- how it is structured
- how to set it up
- main modules/features
- important files
- dependencies between modules
- API routes/endpoints if detectable
- database models/migrations if detectable
- environment variables if detectable
- testing strategy
- deployment/build setup
- instructions for AI coding agents

## Tech stack

Use:
- TypeScript
- Node.js
- CLI framework: `commander`
- File globbing: `fast-glob`
- Git integration: `simple-git`
- Markdown generation using plain string templates
- Local metadata stored as JSON files under `.repowiki/`

Do not build a web UI yet.

## Commands

Implement these CLI commands:

```bash
repowiki generate
repowiki update
repowiki check
```

### `repowiki generate`

Scans the current repository and generates the full wiki from scratch.

Responsibilities:
1. Detect project type:
   - Node/TypeScript
   - React
   - Next.js
   - Vite
   - NestJS / Express if possible
   - generic fallback

2. Ignore irrelevant files:
   - `node_modules`
   - `.git`
   - `dist`
   - `build`
   - `.next`
   - `coverage`
   - lockfiles
   - binary files
   - images
   - large generated files

3. Build a file inventory:
   For every relevant source/config file, collect:

```ts
type FileRecord = {
  path: string;
  language: string;
  size: number;
  hash: string;
  imports: string[];
  exports: string[];
  symbols: SymbolRecord[];
};

type SymbolRecord = {
  name: string;
  kind: "function" | "class" | "interface" | "type" | "component" | "constant" | "unknown";
  exported: boolean;
};
```

4. Build a basic code graph:

```ts
type CodeGraph = {
  files: FileRecord[];
  imports: GraphEdge[];
  modules: ModuleRecord[];
  routes: RouteRecord[];
  envVars: EnvVarRecord[];
  tests: TestRecord[];
};

type GraphEdge = {
  from: string;
  to: string;
  type: "import";
};

type ModuleRecord = {
  name: string;
  rootPath: string;
  files: string[];
  purpose?: string;
};

type RouteRecord = {
  method?: string;
  path?: string;
  file: string;
  handler?: string;
};

type EnvVarRecord = {
  name: string;
  sourceFile: string;
};

type TestRecord = {
  path: string;
  testedFile?: string;
};
```

5. Detect modules:
   Start with a simple heuristic:
   - top-level folders under `src/`
   - top-level folders under `app/`
   - top-level folders under `pages/`
   - top-level folders under `server/`
   - top-level folders under `packages/`

6. Generate Markdown docs:
   - `docs/repo-wiki/index.md`
   - `docs/repo-wiki/architecture.md`
   - `docs/repo-wiki/setup.md`
   - `docs/repo-wiki/modules/<module>.md`
   - `docs/repo-wiki/agent-context.md`
   - root-level `AGENTS.md`

7. Store metadata:
   - `.repowiki/file-hashes.json`
   - `.repowiki/graph.json`
   - `.repowiki/index.json`
   - `.repowiki/summaries.json`

For now, do not call an LLM. Generate useful deterministic docs from code structure, imports, package files, config files, and filenames. Leave clean extension points for LLM-based summaries later.

## `repowiki update`

Updates the wiki incrementally.

Responsibilities:
1. Load `.repowiki/file-hashes.json`
2. Rescan repo
3. Detect changed, added, and deleted files
4. Identify affected modules
5. Regenerate only:
   - affected module docs
   - index
   - architecture
   - agent-context
   - AGENTS.md
6. Update metadata

Print a useful summary:

```txt
RepoWiki updated.

Changed files:
- src/auth/auth.service.ts
- src/auth/jwt.strategy.ts

Affected docs:
- docs/repo-wiki/modules/auth.md
- docs/repo-wiki/architecture.md
- AGENTS.md
```

## `repowiki check`

Checks whether the wiki is stale.

Responsibilities:
1. Load stored hashes
2. Rescan current repo
3. Detect files that changed since the wiki was generated
4. Exit with:
   - code `0` if wiki is fresh
   - code `1` if stale

Output example:

```txt
RepoWiki is stale.

Changed files:
- src/billing/subscription.service.ts

Run:
  repowiki update
```

This command should be usable in CI.

## Markdown output requirements

### `index.md`

Include:
- project name
- detected project type
- package manager
- main scripts from `package.json`
- top-level structure
- module list
- links to other wiki pages

Example structure:

```md
# Repo Wiki

## Project overview

## Detected stack

## Main scripts

## Repository structure

## Modules

## Suggested reading order
```

### `architecture.md`

Include:
- high-level structure
- important config files
- import graph summary
- central files with many incoming imports
- API/routes if detected
- database/migrations if detected
- external dependencies from `package.json`

### `setup.md`

Infer from:
- `package.json`
- `.env.example`
- Dockerfile
- docker-compose
- README if present

Include:
- install command
- dev command
- build command
- test command
- env vars
- Docker notes

### `modules/<module>.md`

For each module include:

```md
# <Module Name>

## Purpose

## Main files

## Exported symbols

## Internal dependencies

## External dependencies

## Related tests

## Notes for AI agents
```

The “Purpose” can initially be heuristic-based from folder name and filenames. Do not pretend to know more than the code shows.

### `agent-context.md`

This is optimized for AI coding agents.

Include:
- project summary
- important files to read first
- module map
- change safety notes
- testing commands
- coding conventions inferred from project files
- warnings about sensitive files such as migrations, auth, payments, security, env config

### `AGENTS.md`

Generate or update root-level `AGENTS.md`.

Include:

```md
# Agent Instructions

This file was generated by RepoWiki.

## Before making changes

Read:
- docs/repo-wiki/index.md
- docs/repo-wiki/architecture.md
- docs/repo-wiki/agent-context.md

## Project structure

## Important commands

## Module-specific notes

## Safety rules

- Do not edit database migrations casually.
- Update tests when changing business logic.
- Update docs/repo-wiki when changing public APIs, auth, database models, or deployment config.
```

If an `AGENTS.md` already exists, do not overwrite it destructively. Instead:
- create a section between markers:

```md
<!-- REPOWIKI:START -->
...
<!-- REPOWIKI:END -->
```

Only replace content inside those markers.

## Code organization

Use this structure:

```txt
src/
  cli.ts
  commands/
    generate.ts
    update.ts
    check.ts
  scanner/
    scanRepo.ts
    detectProject.ts
    parseFiles.ts
    detectModules.ts
    detectRoutes.ts
    detectEnvVars.ts
    detectTests.ts
  graph/
    buildGraph.ts
  docs/
    generateIndexDoc.ts
    generateArchitectureDoc.ts
    generateSetupDoc.ts
    generateModuleDoc.ts
    generateAgentContextDoc.ts
    generateAgentsMd.ts
  storage/
    metadataStore.ts
  utils/
    hashing.ts
    paths.ts
    fs.ts
    markdown.ts
```

## Important implementation details

- Use async filesystem APIs.
- Make path handling cross-platform.
- Keep functions small and testable.
- Do not crash on unknown project types.
- Do not require a remote API key.
- Do not send code anywhere.
- Keep output deterministic.
- Add helpful console output.
- Add basic error handling.
- Add a `--verbose` flag if easy.

## Package setup

Create:
- `package.json`
- `tsconfig.json`
- executable CLI entry
- README with usage examples

The CLI should work locally with:

```bash
npm install
npm run build
npm link
repowiki generate
```

Or directly during development with:

```bash
npm run dev -- generate
```

## README requirements

The README should explain:
- what RepoWiki is
- how to install
- how to generate docs
- how to update docs
- how to run stale check in CI
- what files are generated
- privacy/local-first behavior
- future roadmap

## Tests

Add basic tests for:
- project detection
- file scanning ignores irrelevant directories
- import parsing
- module detection
- stale check behavior
- AGENTS.md marker replacement

Use Vitest.

## Future extension points

Design the code so these can be added later:
- LLM summaries
- embeddings / local RAG
- GitHub Action
- VS Code extension
- HTML export
- Mermaid diagrams
- deeper AST parsing with tree-sitter
- multi-language support

## Acceptance criteria

The task is complete when:

1. Running `repowiki generate` in a TypeScript/Node repo creates:
   - `docs/repo-wiki/index.md`
   - `docs/repo-wiki/architecture.md`
   - `docs/repo-wiki/setup.md`
   - at least one module doc
   - `docs/repo-wiki/agent-context.md`
   - `AGENTS.md`
   - `.repowiki/*.json`

2. Running `repowiki check` immediately after generation exits with code `0`.

3. Modifying a source file and running `repowiki check` exits with code `1`.

4. Running `repowiki update` refreshes affected docs and makes `repowiki check` pass again.

5. The generated Markdown is useful, readable, and does not contain fake claims.

Start by implementing the deterministic non-LLM version. Do not add OpenAI, Anthropic, Qwen, or any model integration yet.
