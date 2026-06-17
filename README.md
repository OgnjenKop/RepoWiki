# RepoWiki

[![Node.js >=20](https://img.shields.io/badge/node-%3E%3D20-339933)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

RepoWiki generates Qoder-style, agent-ready documentation for a software repository.

It is built for agents and maintainers who need a fast, useful map of an unfamiliar codebase: modules, architecture, important files, change paths, tests, diagrams, and model-ready review context.

The goal is high-quality repository documentation that coding agents can use immediately. The primary path is API-backed AI synthesis, supported by deterministic local analysis so every repo has a stable evidence base and fallback baseline.

## Why RepoWiki

- Qoder-style repository maps: overview, architecture, setup, modules, areas, flows, and change paths.
- AI-first synthesis: `repowiki synthesize` requires a model and generates evidence-grounded wiki summaries.
- Deterministic baseline: local analysis can be committed, reviewed, and checked in CI.
- Agent-ready context: writes `AGENTS.md`, `docs/repo-wiki/*`, and `.repowiki/context/*`.
- Model-ready by design: output is structured for Codex, ChatGPT, and other coding agents.
- Subscription-friendly review: `repowiki review` creates a prompt you can use in Codex or ChatGPT for quality review.
- OpenAI-compatible APIs are supported for Qoder-style synthesis and summary enrichment.
- Works across common TypeScript, React, Node, and multi-root app layouts.

## Quick Start

```bash
git clone git@github.com:OgnjenKop/RepoWiki.git
cd RepoWiki
npm install
npm run build
npm link
```

Generate Qoder-style docs for another repository with AI synthesis:

```bash
repowiki --root ../some-repo --ai-model "<model>" --ai-api-key "$OPENAI_API_KEY" synthesize
```

Generate the deterministic baseline without AI:

```bash
repowiki --root ../some-repo generate
```

Update deterministic docs after code changes:

```bash
repowiki --root ../some-repo update
```

Check whether generated docs are stale:

```bash
repowiki --root ../some-repo check
```

Generate a model-review prompt for Codex or ChatGPT:

```bash
repowiki --root ../some-repo review
```

Then open `../some-repo/docs/repo-wiki/codex-review.md` and use it with Codex or ChatGPT to identify weak summaries, bad module boundaries, missing context, and fixes needed to reach Qoder-level documentation quality.

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
- `docs/repo-wiki/codex-review.md` - model-review prompt for improving generated docs.
- `AGENTS.md` - generated agent instructions.
- `.repowiki/*.json` and `.repowiki/context/**/*.json` - machine-readable metadata.

Commit `docs/repo-wiki` and `AGENTS.md` if you want the wiki available to contributors and agents. Keep `.repowiki` ignored unless you intentionally want to store machine metadata.

## Commands

```bash
repowiki generate
repowiki synthesize
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

## Model-Backed Quality Workflows

RepoWiki supports three model-backed quality paths:

1. Use `repowiki synthesize` for API-backed wiki generation.
2. Use your Codex or ChatGPT subscription with `repowiki review`.
3. Use `repowiki generate --ai` for API-backed summaries on the baseline generator.

The primary Qoder-like path is:

```bash
repowiki --root ../some-repo --ai-api-key "$OPENAI_API_KEY" synthesize
```

The default model is `deepseek/deepseek-v4-flash` (an OpenRouter route) and the default base URL is `https://openrouter.ai/api/v1`. Override either with `--ai-model` / `--ai-base-url` or the matching `REPOWIKI_AI_*` / `OPENAI_*` environment variables. For OpenAI's own API, set `REPOWIKI_AI_BASE_URL=https://api.openai.com/v1` and `REPOWIKI_AI_MODEL=gpt-5-mini`.

The subscription path is the easiest way to get model judgment without adding API credentials to the CLI:

```bash
repowiki --root ../some-repo review
```

For the baseline generator with AI summaries, provide a model and API key explicitly:

```bash
repowiki --root ../some-repo --ai --ai-api-key "$OPENAI_API_KEY" generate
```

Environment variables are also supported:

- `REPOWIKI_AI_API_KEY` (or `OPENAI_API_KEY`)
- `REPOWIKI_AI_BASE_URL` (or `OPENAI_BASE_URL`, default `https://openrouter.ai/api/v1`)
- `REPOWIKI_AI_MODEL` (or `OPENAI_MODEL`, default `deepseek/deepseek-v4-flash`)

If passing the API key on the command line, prefer `--ai-api-key=<key>` (single argument) over `--ai-api-key <key>` (two arguments) to avoid shell quoting issues with keys that contain special characters.

The first run writes AI responses to `.repowiki/ai-summaries.json` and `.repowiki/ai-insights.json` (keyed by model and content hash). Re-runs hit the cache and skip the network round-trip; change a prompt or the underlying file hashes and entries are invalidated automatically. Pass `--no-cache` to force a fresh run (still updates the cache files with the new results).

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

RepoWiki is early-stage OSS. The current focus is reaching Qoder-level documentation quality: useful module boundaries, accurate architecture maps, high-signal change guidance, and model-review loops that catch weak generated docs. The scanner intentionally favors practical heuristics over full language-server precision.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, development expectations, and pull request guidance.

## Security

RepoWiki scans repository contents and may surface file paths, environment variable names, and code-derived metadata in generated docs. See [SECURITY.md](SECURITY.md) for reporting guidance.

## License

MIT. See [LICENSE](LICENSE).
