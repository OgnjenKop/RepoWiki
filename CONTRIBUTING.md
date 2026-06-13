# Contributing

Thanks for helping improve RepoWiki.

## Local Setup

```bash
npm install
npm run build
npm test
```

For local CLI development:

```bash
npm run dev -- --root . update
npm run dev -- check
```

## Development Workflow

- Keep changes deterministic. Generated docs should not depend on timestamps, local usernames, network calls, or machine-specific paths beyond the scanned repository root.
- Prefer source changes over hand-editing generated files. After behavior changes, run `npm run dev -- update`.
- Keep the default path local-only. Do not introduce remote model/API calls unless the user explicitly opts in.
- Add or update tests for scanner, docs, metadata, command, or public-output behavior changes.
- Run `npm test` before opening a pull request.

## Pull Requests

Good pull requests include:

- A clear description of the behavior change.
- Tests or a short explanation for why tests were not added.
- Updated generated docs when public output changes.
- Notes about any compatibility risk for existing generated wikis.

## RepoWiki Output Rules

RepoWiki is designed to produce reviewable output. When changing generated docs:

- Keep wording concise and evidence-backed.
- Avoid unsupported claims about runtime behavior.
- Prefer concrete file paths, modules, routes, tests, and commands.
- Keep generated Markdown stable across repeated runs.

## Reporting Issues

When reporting a scanner or docs-quality issue, include:

- Repository shape or a minimal fixture that reproduces the issue.
- The generated section that looks wrong.
- Expected output, if known.
- Whether `repowiki generate`, `repowiki update`, or `repowiki check` was used.
