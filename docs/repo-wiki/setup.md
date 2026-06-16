# Setup

**Navigation:** [Wiki](index.md) → Setup

## At a Glance

| | | | |
| --- | --- | --- | --- |
| **Package Manager** | **Scripts** | **Env Vars** | **Docker** |
| npm | 4 | 6 | 0 |
| for installs and scripts | available | configured | files |

## On This Page

## On This Page

- [Requirements](#requirements)
- [Install](#install)
- [Quick Start](#quick-start)
- [Common Commands](#common-commands)
- [Environment Variables](#environment-variables)
- [Docker](#docker)
- [Contributor Checklist](#contributor-checklist)

## Requirements

- **Node.js 20 or newer** — required to build and run the project.
- **Package manager:** `npm` — the repository's detected package manager.

> **ℹ️ Don't have the right Node version?**
>
> Use `nvm install 20` or your preferred version manager to install Node 20+. The project uses modern ESM and TypeScript features that require a recent runtime.

## Install

Clone the repository and install dependencies:

`npm install`

## Quick Start

Get the project running in under a minute:

`npm run dev -- --root . update`

> **💡 What does this do?**
>
> The quick start command runs the project's main CLI with the `update` subcommand. This scans the repository and refreshes the wiki you're reading right now. If the project is a different kind of CLI, the command will reflect that.

## Common Commands

> **ℹ️ Script reference**
>
> These are the npm scripts defined in `package.json`. Run them with `npm run <name>`.

- `npm run build` — runs `tsc`
- `npm run dev` — runs `tsx src/cli.ts`
- `npm run pretest` — runs `npm run build`
- `npm run test` — runs `vitest run`

### Most Common Tasks

- **Build:** `npm run build` — type-check and compile the project.
- **Test:** `npm run test` — run the test suite.
- **Dev:** `npm run dev` — run the project in development mode.
- **Check docs:** `npm run dev check` — verify the wiki is up to date.

## Environment Variables

> **ℹ️ Where to set these**
>
> Put these in a `.env` file at the project root, or export them in your shell. The application reads them at startup.

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`
- `REPOWIKI_AI_API_KEY`
- `REPOWIKI_AI_BASE_URL`
- `REPOWIKI_AI_MODEL`

## Docker

_No Docker files detected._

## Contributor Checklist

Before opening a pull request:

- `npm run build` — confirm the project type-checks and builds.
- `npm run test` — run the test suite.
- Regenerate the wiki if you changed scanner, docs, CLI, or public-output code.
- Add a test for any new behavior.
- Update the relevant [module doc](modules/src-cli.md) if you changed a module's public API.

> **❗ Keep the wiki fresh**
>
> This wiki is generated from the codebase. After making changes, run `npm run dev --root . update` to refresh it. The `check` command will tell you if the wiki is stale.

## What's Next?

- [Architecture](architecture.md) — understand the system shape
- [Agent Context](agent-context.md) — what to read first as a coding agent
- [Areas](areas/index.md) — high-level functional groups
