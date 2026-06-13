# RepoWiki

[![Node.js >=20](https://img.shields.io/badge/node-%3E%3D20-339933)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

RepoWiki generates a deterministic, Git-friendly Markdown wiki for a software repository.

It is built for agents and maintainers who need a fast map of an unfamiliar codebase: modules, architecture, important files, change paths, tests, diagrams, and an optional Codex review prompt.

## Why RepoWiki

- Local-first by default: scans files on disk and writes Markdown plus JSON metadata.
- Deterministic output: generated docs can be committed, reviewed, and checked in CI.
- Agent-ready context: writes `AGENTS.md`, `docs/repo-wiki/*`, and `.repowiki/context/*`.
- No API key required for the default workflow.
- Optional OpenAI-compatible summaries are available when explicitly enabled.
- Works across common TypeScript, React, Node, and multi-root app layouts.

## Quick Start

```bash
git clone git@github.com:OgnjenKop/RepoWiki.git
cd RepoWiki
npm install
npm run build
npm link
```

Generate docs for another repository:

```bash
repowiki --root ../some-repo generate
```

Update docs after code changes:

```bash
repowiki --root ../some-repo update
```

Check whether generated docs are stale:

```bash
repowiki --root ../some-repo check
```

Generate a no-API review prompt for Codex or ChatGPT:

```bash
repowiki --root ../some-repo review
```

Then open `../some-repo/docs/repo-wiki/codex-review.md` and use it with your existing Codex or ChatGPT subscription.

## Output

RepoWiki writes:

- `docs/repo-wiki/index.md` - repository overview and navigation.
- `docs/repo-wiki/architecture.md` - module areas, flows, central files, and verification notes.
- `docs/repo-wiki/setup.md` - install, build, test, and environment notes.
- `docs/repo-wiki/modules/*.md` - per-module file maps and change guidance.
- `docs/repo-wiki/areas/*.md` - higher-level functional areas.
- `docs/repo-wiki/flows/*.md` - module and route flow summaries.
- `docs/repo-wiki/diagrams/*.mmd` - Mermaid diagrams.
- `docs/repo-wiki/agent-context.md` - concise context for coding agents.
- `docs/repo-wiki/codex-review.md` - no-API review prompt.
- `AGENTS.md` - generated agent instructions.
- `.repowiki/*.json` and `.repowiki/context/**/*.json` - machine-readable metadata.

Commit `docs/repo-wiki` and `AGENTS.md` if you want the wiki available to contributors and agents. Keep `.repowiki` ignored unless you intentionally want to store machine metadata.

## Commands

```bash
repowiki generate
repowiki update
repowiki check
repowiki review
```

Global flags:

```bash
--root <path>
--verbose
--ai
--ai-base-url <url>
--ai-model <model>
--ai-api-key <key>
```

## Optional AI Summaries

The default workflow does not call a model provider.

To enable OpenAI-compatible summaries, provide an API key explicitly:

```bash
repowiki --root ../some-repo --ai --ai-model "<model>" --ai-api-key "$OPENAI_API_KEY" generate
```

Environment variables are also supported:

- `REPOWIKI_AI_API_KEY`
- `REPOWIKI_AI_BASE_URL`
- `REPOWIKI_AI_MODEL`
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

## Development

```bash
npm install
npm run build
npm test
npm run dev -- --root . update
npm run dev -- check
```

Before opening a pull request:

- Run `npm test`.
- Run `npm run dev -- update`.
- Run `npm run dev -- check`.
- Commit updated generated docs when behavior or public docs change.

## Project Status

RepoWiki is early-stage OSS. The current focus is high-quality deterministic repository maps and no-API agent review workflows. The scanner intentionally favors practical heuristics over full language-server precision.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, development expectations, and pull request guidance.

## Security

RepoWiki scans repository contents and may surface file paths, environment variable names, and code-derived metadata in generated docs. See [SECURITY.md](SECURITY.md) for reporting guidance.

## License

MIT. See [LICENSE](LICENSE).
