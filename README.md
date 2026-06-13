# RepoWiki

RepoWiki generates a deterministic, Git-friendly Markdown wiki for a software repository.

It is local-first: the CLI scans files on disk, writes Markdown and JSON metadata, and does not call any model provider or remote API.

## Install

```bash
npm install
npm run build
npm link
```

## Development

```bash
npm run dev -- generate
npm run dev -- check
npm run dev -- update
```

By default, RepoWiki uses the Git repository root when it can detect one. Use `--root` to scan a specific directory:

```bash
repowiki --root ../some-repo generate
```

## Commands

### Generate Docs

```bash
repowiki generate
```

Creates:

- `docs/repo-wiki/index.md`
- `docs/repo-wiki/architecture.md`
- `docs/repo-wiki/setup.md`
- `docs/repo-wiki/modules/*.md`
- `docs/repo-wiki/diagrams/*.mmd`
- `docs/repo-wiki/agent-context.md`
- `AGENTS.md`
- `.repowiki/*.json`
- `.repowiki/context/**/*.json`
- `.repowiki/context/routes/**/*.json`

### Update Docs

```bash
repowiki update
```

Rescans the repository, detects changed files, regenerates docs, and updates metadata.

### CI Stale Check

```bash
repowiki check
```

Exits with code `0` when docs are fresh and code `1` when tracked source files changed.

## Privacy

RepoWiki is deterministic and local-only. It does not send code to OpenAI, Anthropic, Qwen, or any other model provider.

## Roadmap

- LLM summaries as an optional extension
- local embeddings and RAG
- GitHub Action
- VS Code extension
- HTML export
- Mermaid diagrams
- deeper AST parsing
- multi-language support
