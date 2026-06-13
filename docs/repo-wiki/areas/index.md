# Areas

## What This Shows

Area docs group modules into higher-level functional clusters. They are the best place to understand how the repo is organized beyond module boundaries.

## Where To Start

- [Change operations, scripts, or entry behavior](./orchestration-src-cli-src-commands.md) -> `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…
- [Change core application behavior](./analysis-src-graph-src-scanner.md) -> `Core application logic: graph (src/graph) + scanner (src/scanner)` - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…
- [Change UI, docs, or generated output](./generation-src-ai-src-diagrams-src-docs-src-knowledge.md) -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…
- [Change shared types, configuration, persistence, or helpers](./support-src-types-src-utils.md) -> `Shared support: types (src/types) + utils (src/utils)` - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…

## Area List

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](./orchestration-src-cli-src-commands.md) - 2 modules - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).
- [Core application logic: graph (src/graph) + scanner (src/scanner)](./analysis-src-graph-src-scanner.md) - 2 modules - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner).
- [Core application logic: storage (src/storage)](./analysis-src-storage.md) - 1 module - Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage.
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](./generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - 4 modules - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).
- [Shared support: types (src/types) + utils (src/utils)](./support-src-types-src-utils.md) - 2 modules - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils).

## Area Summaries

- [Operations and entry points: cli (src/cli.ts) + commands (src/commands)](./orchestration-src-cli-src-commands.md) - Coordinates runnable entry points, scripts, commands, and top-level execution flow. Covers cli (src/cli.ts), commands (src/commands).…
- [Core application logic: graph (src/graph) + scanner (src/scanner)](./analysis-src-graph-src-scanner.md) - Contains domain behavior, application state, services, routing, and data flow. Covers graph (src/graph), scanner (src/scanner). Modules: graph (src/graph), scanner (src/scanner).…
- [Core application logic: storage (src/storage)](./analysis-src-storage.md) - Contains domain behavior, application state, services, routing, and data flow. Rooted at src/storage. Modules: storage (src/storage). Root paths: src/storage.…
- [Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more](./generation-src-ai-src-diagrams-src-docs-src-knowledge.md) - Contains UI, presentation, docs, generated output, or user-facing surfaces. Covers ai (src/ai), diagrams (src/diagrams), docs (src/docs), knowledge (src/knowledge).…
- [Shared support: types (src/types) + utils (src/utils)](./support-src-types-src-utils.md) - Provides shared persistence, configuration, types, and utility helpers. Covers types (src/types), utils (src/utils). Modules: types (src/types), utils (src/utils).…

## Area Flows

- `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` -> `Shared support: types (src/types) + utils (src/utils)` (110 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Shared support: types (src/types) + utils (src/utils)` (20 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (9 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: graph (src/graph) + scanner (src/scanner)` (4 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Core application logic: storage (src/storage)` (4 imports)
- `Core application logic: storage (src/storage)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (3 imports)
- `Core application logic: storage (src/storage)` -> `Shared support: types (src/types) + utils (src/utils)` (3 imports)
- `Core application logic: graph (src/graph) + scanner (src/scanner)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)
- `Shared support: types (src/types) + utils (src/utils)` -> `Presentation and output: ai (src/ai) + diagrams (src/diagrams) + 2 more` (2 imports)
- `Operations and entry points: cli (src/cli.ts) + commands (src/commands)` -> `Shared support: types (src/types) + utils (src/utils)` (1 imports)

## Navigation

- [Repo wiki index](../index.md)
- [Architecture](../architecture.md)
- [Flow overview](../flows/index.md)

## Suggested Reading Order

- Start with the area that matches the change you plan to make.
- Open its module pages for file-level detail.
- Use the flow overview for cross-area movement.
