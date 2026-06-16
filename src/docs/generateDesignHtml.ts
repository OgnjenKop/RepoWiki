import type { ComponentRecord, DesignTokenCategory, DesignTokenRecord, RepoScan } from "../types/index.js";
import { code, heading, pluralize } from "../utils/markdown.js";

export function generateDesignHtml(scan: RepoScan): string {
  const designSystem = scan.graph.designSystem;
  const components = scan.graph.components.filter((c) => !c.isStory);
  const stories = scan.graph.components.filter((c) => c.isStory);
  const tokens = scan.graph.designTokens;
  const hasData = designSystem || components.length > 0 || tokens.length > 0;

  if (!hasData) {
    return renderHtml("Design System", `
      <main class="empty">
        <h1>Design System</h1>
        <p class="lead">No design system, UI components, or design tokens were detected in this repository.</p>
        <p>This page is generated when the project contains UI components, design tokens, or a design system configuration. Add a framework like React, Vue, or Svelte, or define design tokens in CSS variables, theme files, or token JSON to populate this page.</p>
        <p><a href="index.md">← Back to the wiki</a></p>
      </main>
    `, { stats: [] });
  }

  const componentsByFramework = groupComponentsByFramework(components);
  const tokensByCategory = groupTokensByCategory(tokens);

  return renderHtml("Design System", `
    <main>
      <header class="page-header">
        <h1>Design System</h1>
        <p class="lead">Components, design tokens, and the visual language of this project.</p>
        <p class="breadcrumb"><a href="index.md">← Back to the wiki</a></p>
      </header>

      <section class="stats">
        ${renderStat("UI framework", designSystem?.framework ?? "none")}
        ${renderStat("Components", pluralize(components.length, "component"))}
        ${renderStat("Stories", pluralize(stories.length, "story"))}
        ${renderStat("Tokens", pluralize(tokens.length, "token"))}
        ${renderStat("Libraries", designSystem?.componentLibraries.length ? `${designSystem.componentLibraries.length} detected` : "none")}
      </section>

      ${designSystem?.componentLibraries.length ? `
        <section>
          <h2>Component Libraries</h2>
          <ul class="chips">
            ${designSystem.componentLibraries.map((lib) => `<li class="chip">${escapeHtml(lib)}</li>`).join("")}
          </ul>
        </section>
      ` : ""}

      ${designSystem?.tokenFiles.length ? `
        <section>
          <h2>Token Files</h2>
          <ul class="file-list">
            ${designSystem.tokenFiles.map((file) => `<li>${code(file)}</li>`).join("")}
          </ul>
        </section>
      ` : ""}

      ${components.length ? `
        <section>
          <h2>Components <span class="count">${components.length}</span></h2>
          ${Object.entries(componentsByFramework).map(([framework, items]) => `
            <div class="framework-group">
              <h3>${escapeHtml(framework)} <span class="count">${items.length}</span></h3>
              <div class="component-grid">
                ${items.map((component) => renderComponentCard(component)).join("")}
              </div>
            </div>
          `).join("")}
        </section>
      ` : ""}

      ${stories.length ? `
        <section>
          <h2>Storybook Stories <span class="count">${stories.length}</span></h2>
          <div class="component-grid">
            ${stories.map((story) => renderComponentCard(story, true)).join("")}
          </div>
        </section>
      ` : ""}

      ${tokens.length ? `
        <section>
          <h2>Design Tokens <span class="count">${tokens.length}</span></h2>
          ${Object.entries(tokensByCategory).filter(([, items]) => items.length > 0).map(([category, items]) => `
            <div class="token-group">
              <h3>${escapeHtml(category)} <span class="count">${items.length}</span></h3>
              <div class="token-grid">
                ${items.map((token) => renderTokenCard(token)).join("")}
              </div>
            </div>
          `).join("")}
        </section>
      ` : ""}

      <footer class="page-footer">
        <h2>Notes</h2>
        <ul>
          <li>Component detection is based on PascalCase exports in <code>.tsx</code>/<code>.jsx</code> files, <code>.vue</code> files, <code>.svelte</code> files, and Angular <code>@Component</code> decorators.</li>
          <li>Design token detection covers CSS custom properties, SCSS variables, theme objects in JS/TS, and token JSON files.</li>
          <li>Storybook stories are detected by the <code>.stories.{ts,tsx,js,jsx}</code> file naming convention.</li>
          <li>Add or update design tokens in the listed token files; this page is regenerated each time the wiki is updated.</li>
        </ul>
      </footer>
    </main>
  `, { stats: [] });
}

function renderComponentCard(component: ComponentRecord, isStory = false): string {
  const ref = component.line ? `${component.file}:${component.line}` : component.file;
  const propsHtml = component.props?.length
    ? `<div class="props"><strong>Props:</strong> ${component.props.map((p) => `<code>${escapeHtml(p)}</code>`).join(", ")}</div>`
    : "";
  return `
    <div class="card component-card ${isStory ? "story" : ""}">
      <div class="card-header">
        <span class="component-name">${escapeHtml(component.name)}</span>
        <span class="badge badge-${component.framework}">${escapeHtml(component.framework)}</span>
      </div>
      <div class="card-body">
        <div class="file-ref">${code(ref)}</div>
        ${propsHtml}
      </div>
    </div>
  `;
}

function renderTokenCard(token: DesignTokenRecord): string {
  const swatch = isColorToken(token.value) ? `<div class="swatch" style="background-color: ${escapeAttr(token.value)};"></div>` : "";
  return `
    <div class="card token-card token-${token.category}">
      ${swatch}
      <div class="card-body">
        <div class="token-name">${code(token.name)}</div>
        <div class="token-value">${escapeHtml(token.value)}</div>
        <div class="token-meta">
          <span class="badge badge-${token.category}">${escapeHtml(token.category)}</span>
          <span class="token-source">${escapeHtml(token.source)}</span>
        </div>
        <div class="file-ref">${code(token.file)}${token.line ? `:${token.line}` : ""}</div>
      </div>
    </div>
  `;
}

function renderStat(label: string, value: string): string {
  return `<div class="stat"><div class="stat-value">${escapeHtml(value)}</div><div class="stat-label">${escapeHtml(label)}</div></div>`;
}

function isColorToken(value: string): boolean {
  return /^#[0-9a-f]{3,8}$/i.test(value) || /^rgba?\(|^hsla?\(/.test(value);
}

function groupComponentsByFramework(components: ComponentRecord[]): Record<string, ComponentRecord[]> {
  const grouped: Record<string, ComponentRecord[]> = {};
  for (const component of components) {
    const key = component.framework;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(component);
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => a.name.localeCompare(b.name));
  }
  return grouped;
}

function groupTokensByCategory(tokens: DesignTokenRecord[]): Record<DesignTokenCategory, DesignTokenRecord[]> {
  const grouped = {
    color: [] as DesignTokenRecord[],
    spacing: [] as DesignTokenRecord[],
    typography: [] as DesignTokenRecord[],
    shadow: [] as DesignTokenRecord[],
    border: [] as DesignTokenRecord[],
    animation: [] as DesignTokenRecord[],
    breakpoint: [] as DesignTokenRecord[],
    other: [] as DesignTokenRecord[]
  };
  for (const token of tokens) {
    grouped[token.category].push(token);
  }
  for (const key of Object.keys(grouped) as DesignTokenCategory[]) {
    grouped[key].sort((a, b) => a.name.localeCompare(b.name));
  }
  return grouped;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value: string): string {
  return value.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function renderHtml(title: string, body: string, options: { stats: string[] }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>${getStyles()}</style>
</head>
<body>
${body}
</body>
</html>`;
}

function getStyles(): string {
  return `
    :root {
      --bg: #ffffff;
      --bg-alt: #f8fafc;
      --bg-card: #ffffff;
      --border: #e2e8f0;
      --border-strong: #cbd5e1;
      --text: #0f172a;
      --text-muted: #64748b;
      --text-subtle: #94a3b8;
      --primary: #3b82f6;
      --primary-soft: #dbeafe;
      --success: #10b981;
      --success-soft: #d1fae5;
      --warning: #f59e0b;
      --warning-soft: #fef3c7;
      --danger: #ef4444;
      --danger-soft: #fee2e2;
      --code-bg: #f1f5f9;
      --shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0f172a;
        --bg-alt: #1e293b;
        --bg-card: #1e293b;
        --border: #334155;
        --border-strong: #475569;
        --text: #f1f5f9;
        --text-muted: #cbd5e1;
        --text-subtle: #94a3b8;
        --primary: #60a5fa;
        --primary-soft: #1e3a8a;
        --code-bg: #334155;
        --shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
      }
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 15px;
      line-height: 1.6;
      color: var(--text);
      background: var(--bg);
      margin: 0;
      padding: 0;
    }
    main { max-width: 1100px; margin: 0 auto; padding: 3rem 1.5rem; }
    .empty { text-align: center; padding: 4rem 1rem; }
    .empty h1 { font-size: 2rem; margin-bottom: 1rem; }
    .empty .lead { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1.5rem; }
    .page-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
    .page-header h1 { font-size: 2.25rem; font-weight: 700; margin: 0 0 0.5rem 0; letter-spacing: -0.025em; }
    .lead { font-size: 1.15rem; color: var(--text-muted); margin: 0 0 1rem 0; }
    .breadcrumb { font-size: 0.9rem; color: var(--text-muted); margin: 0; }
    .breadcrumb a { color: var(--primary); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    h2 { font-size: 1.5rem; font-weight: 600; margin: 2.5rem 0 1rem 0; letter-spacing: -0.02em; display: flex; align-items: center; gap: 0.5rem; }
    h3 { font-size: 1.15rem; font-weight: 600; margin: 1.5rem 0 0.75rem 0; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; }
    .count { font-size: 0.85rem; font-weight: 500; color: var(--text-subtle); background: var(--bg-alt); padding: 0.125rem 0.5rem; border-radius: 999px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin: 2rem 0; }
    .stat { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align: center; box-shadow: var(--shadow); }
    .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text); margin-bottom: 0.25rem; }
    .stat-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .chips { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .chip { background: var(--primary-soft); color: var(--primary); padding: 0.375rem 0.75rem; border-radius: 999px; font-size: 0.85rem; font-weight: 500; }
    .file-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
    .file-list li { background: var(--bg-card); border: 1px solid var(--border); padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.9rem; }
    .framework-group { margin-bottom: 2rem; }
    .component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem; }
    .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow); transition: box-shadow 0.15s, transform 0.15s; }
    .card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
    .component-card .card-header { padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border); background: var(--bg-alt); }
    .component-name { font-weight: 600; font-size: 0.95rem; }
    .component-card .card-body { padding: 0.75rem 1rem; }
    .file-ref { font-size: 0.8rem; color: var(--text-muted); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; margin-top: 0.25rem; }
    .props { font-size: 0.85rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border); }
    .props strong { color: var(--text-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .token-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.75rem; }
    .token-card { display: flex; flex-direction: column; }
    .token-card .swatch { height: 60px; width: 100%; }
    .token-card .card-body { padding: 0.75rem 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.375rem; }
    .token-name { font-weight: 600; font-size: 0.9rem; }
    .token-value { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.8rem; color: var(--text-muted); word-break: break-all; }
    .token-meta { display: flex; gap: 0.5rem; align-items: center; margin-top: 0.25rem; }
    .token-source { font-size: 0.75rem; color: var(--text-subtle); }
    .badge { display: inline-block; font-size: 0.7rem; font-weight: 600; padding: 0.125rem 0.5rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-react { background: #61dafb20; color: #61dafb; }
    .badge-vue { background: #42b88320; color: #42b883; }
    .badge-svelte { background: #ff3e0020; color: #ff3e00; }
    .badge-angular { background: #dd003120; color: #dd0031; }
    .badge-solid { background: #2c4f7c20; color: #2c4f7c; }
    .badge-unknown { background: var(--bg-alt); color: var(--text-muted); }
    .badge-color { background: #ec489920; color: #ec4899; }
    .badge-spacing { background: #8b5cf620; color: #8b5cf6; }
    .badge-typography { background: #06b6d420; color: #06b6d4; }
    .badge-shadow { background: #1e293b20; color: var(--text); }
    .badge-border { background: #f59e0b20; color: #f59e0b; }
    .badge-animation { background: #10b98120; color: #10b981; }
    .badge-breakpoint { background: #6366f120; color: #6366f1; }
    .badge-other { background: var(--bg-alt); color: var(--text-muted); }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.85em; background: var(--code-bg); padding: 0.125rem 0.375rem; border-radius: 4px; }
    .page-footer { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); }
    .page-footer h2 { margin-top: 0; }
    .page-footer ul { color: var(--text-muted); padding-left: 1.25rem; }
    .page-footer li { margin-bottom: 0.5rem; }
    .story .card-header { background: linear-gradient(135deg, #ff478520 0%, #ff478510 100%); }
    @media (max-width: 640px) {
      main { padding: 1.5rem 1rem; }
      .page-header h1 { font-size: 1.75rem; }
      .stats { grid-template-columns: repeat(2, 1fr); }
      .component-grid, .token-grid { grid-template-columns: 1fr; }
    }
  `;
}
