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

RepoWiki is local-first by default:

- It scans files on disk.
- It writes Markdown docs and JSON metadata into the target repository.
- It does not call a model provider unless AI summaries are explicitly enabled.

Generated docs may include file paths, environment variable names, imports, exports, route strings, and test relationships. Review generated output before publishing it from private repositories.

## Optional AI Mode

When `--ai` is enabled, repository context can be sent to the configured OpenAI-compatible endpoint. Do not enable AI summaries for private or sensitive repositories unless that data sharing is acceptable for your environment.
