export function list(items: string[], empty = "_None detected._"): string {
  if (items.length === 0) return empty;
  return items.map((item) => `- ${item}`).join("\n");
}

export function code(value: string): string {
  return `\`${value.replaceAll("`", "\\`")}\``;
}

export function heading(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function tableOfContents(entries: Array<{ anchor: string; label: string; depth?: number }>): string {
  if (entries.length === 0) return "";
  const lines = ["## On This Page", ""];
  for (const entry of entries) {
    const indent = "  ".repeat(Math.max(0, (entry.depth ?? 0) - 2));
    lines.push(`${indent}- [${entry.label}](#${entry.anchor})`);
  }
  return lines.join("\n");
}

export function breadcrumbs(parts: Array<{ label: string; href?: string }>): string {
  if (parts.length === 0) return "";
  const segments = parts.map((part) => part.href ? `[${part.label}](${part.href})` : part.label);
  return `**Navigation:** ${segments.join(" → ")}`;
}

export function callout(kind: "note" | "tip" | "warning" | "important", title: string, body: string): string {
  const icon: Record<typeof kind, string> = {
    note: "ℹ️",
    tip: "💡",
    warning: "⚠️",
    important: "❗"
  };
  return `> **${icon[kind]} ${title}**\n>\n> ${body.split("\n").join("\n> ")}`;
}

export function statCards(cards: Array<{ label: string; value: string | number; hint?: string }>): string {
  if (cards.length === 0) return "";
  const lines: string[] = ["| | | | |", "| --- | --- | --- | --- |"];
  const padded = [...cards];
  while (padded.length % 4 !== 0) padded.push({ label: "", value: "" });
  for (let row = 0; row < padded.length; row += 4) {
    const slice = padded.slice(row, row + 4);
    const labelRow = slice.map((c) => c.label ? `**${c.label}**` : "").join(" | ");
    const valueRow = slice.map((c) => c.value !== "" ? String(c.value) : "").join(" | ");
    const hintRow = slice.map((c) => c.hint ?? "").join(" | ");
    lines.push(`| ${labelRow} |`);
    lines.push(`| ${valueRow} |`);
    if (hintRow.trim().replaceAll("|", "").length) lines.push(`| ${hintRow} |`);
  }
  return lines.join("\n");
}

export function section(title: string, body: string): string {
  return `## ${title}\n\n${body}\n`;
}

export function linkCard(title: string, description: string, href: string): string {
  return `### [${title}](${href})\n\n${description}`;
}

export function keyValue(items: Array<{ key: string; value: string }>): string {
  if (items.length === 0) return "_None._";
  return items.map((item) => `- **${item.key}:** ${item.value}`).join("\n");
}

export function command(cmd: string, description?: string): string {
  return description ? `- ${code(cmd)} — ${description}` : `- ${code(cmd)}`;
}

export function fileRef(path: string, line?: number, label?: string): string {
  const ref = line ? `${path}:${line}` : path;
  return `[${code(label ?? path)}](${ref})`;
}

export function relativePath(fromDir: string, toPath: string): string {
  const fromParts = fromDir.split("/").filter(Boolean);
  const toParts = toPath.split("/").filter(Boolean);
  let common = 0;
  while (common < fromParts.length && common < toParts.length && fromParts[common] === toParts[common]) {
    common += 1;
  }
  const up = fromParts.length - common;
  const down = toParts.slice(common);
  if (up === 0 && down.length === 0) return ".";
  const upPath = up > 0 ? "../".repeat(up) : "";
  return `${upPath}${down.join("/")}`;
}
