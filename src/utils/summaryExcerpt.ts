export function summaryExcerpt(value: string, maxLength = 180): string {
  const lines = value.replace(/\r\n/g, "\n").split("\n").map((line) => line.trim());
  const paragraph: string[] = [];
  let started = false;
  for (const line of lines) {
    if (!line) {
      if (started && paragraph.length > 0) break;
      continue;
    }
    if (/^#+\s/.test(line)) {
      if (started && paragraph.length > 0) break;
      continue;
    }
    if (/^(\d+\.\s+|[-*]\s+)/.test(line)) {
      if (started && paragraph.length > 0) break;
      continue;
    }
    started = true;
    paragraph.push(line);
  }
  const content = paragraph.join(" ").replace(/\s+/g, " ").trim();
  if (!content) return "";
  if (content.length <= maxLength) return content;
  const slice = content.slice(0, maxLength);
  const lastSentence = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
  if (lastSentence > 60) return `${slice.slice(0, lastSentence + 1).trim()}…`;
  return `${slice.replace(/\s+\S*$/, "").trim()}…`;
}
