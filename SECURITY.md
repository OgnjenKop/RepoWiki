# Security Policy

## Supported Versions

RepoWiki is pre-1.0. Security fixes are made on the `main` branch.

## Reporting a Vulnerability

Please report security issues privately instead of opening a public issue.

Email: `ognjenkoprivica@gmail.com`

Include:

- A short description of the issue.
- Steps to reproduce or a minimal fixture.
- Impact, including whether generated docs can expose sensitive data.
- Any suggested mitigation.

## Data Handling

RepoWiki has a local deterministic baseline:

- It scans files on disk.
- It writes Markdown docs and JSON metadata into the target repository.
- It does not call a model provider during baseline generation unless AI summaries are explicitly enabled.

Generated docs may include file paths, environment variable names, imports, exports, route strings, and test relationships. Review generated output before publishing it from private repositories.

## Model-Backed Workflows

RepoWiki supports model-backed review and summary workflows:

- `repowiki review` writes a prompt that you can use with Codex or ChatGPT through your existing subscription.
- `--ai` sends repository context to the configured OpenAI-compatible endpoint for automated summaries.

Do not use model-backed workflows for private or sensitive repositories unless that data sharing is acceptable for your environment.
