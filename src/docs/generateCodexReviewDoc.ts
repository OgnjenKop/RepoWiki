import type { RepoScan } from "../types/index.js";
import { code, list } from "../utils/markdown.js";
import { moduleLabel } from "../utils/moduleLabel.js";
import { areaDocFileName } from "../utils/docPaths.js";
import { orderedAreas } from "../knowledge/areaOrdering.js";

export function generateCodexReviewDoc(scan: RepoScan): string {
  const areas = orderedAreas(scan);
  return `# Codex RepoWiki Review Prompt

Use this prompt with Codex or ChatGPT when you want subscription-backed review without an API key.

## Prompt

You are reviewing the RepoWiki output for this repository. Do not call an external model API. Work from the generated wiki, metadata, context packs, and source files in this checkout.

Read these files first:

${list([
  "docs/repo-wiki/index.md",
  "docs/repo-wiki/architecture.md",
  "docs/repo-wiki/agent-context.md",
  "docs/repo-wiki/areas/index.md",
  "docs/repo-wiki/flows/index.md",
  ".repowiki/context/project.json",
  ".repowiki/graph.json",
  ".repowiki/knowledge.json",
  ".repowiki/summaries.json"
].map(code))}

Then sample the generated area and module pages:

${list([
  ...areas.slice(0, 4).map((area) => `Area: ${code(`docs/repo-wiki/areas/${areaDocFileName(area.id)}`)} (${area.name})`),
  ...scan.graph.modules.slice(0, 8).map((module) => `Module: ${code(`docs/repo-wiki/modules/${module.id}.md`)} (${moduleLabel(module)})`),
  ...scan.graph.modules.slice(0, 4).map((module) => `Flow: ${code(`docs/repo-wiki/flows/modules/${module.id}.md`)} (${moduleLabel(module)})`)
], "_No area or module pages were generated._")}

Assess the wiki against these criteria:

- Does the top-level overview explain the repo shape without repeating details already rendered below?
- Are module areas coherent and useful for deciding where to start?
- Are runtime consumers separated from test consumers correctly?
- Are important entry files actually good starting points?
- Are common change paths specific enough to guide an edit?
- Are verification hints actionable and tied to real scripts/tests?
- Are AI context packs grounded in the same evidence as the docs?
- Are any summaries misleading, too generic, or unsupported by code evidence?

Return:

- Findings first, ordered by severity.
- For each finding, include the generated doc path and the source files or context packs that prove it.
- Separate deterministic-generator issues from issues that only affect AI summary quality.
- End with concrete changes to make in RepoWiki, not generic advice.

## Local Commands

${list([
  code("repowiki generate"),
  code("repowiki update"),
  code("repowiki check"),
  code("repowiki review")
])}
`;
}
