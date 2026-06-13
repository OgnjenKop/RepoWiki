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
