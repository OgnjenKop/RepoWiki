export function stripComments(content: string): string {
  let output = "";
  let index = 0;
  let state: "code" | "lineComment" | "blockComment" | "single" | "double" | "template" | "regex" = "code";
  let lastSignificant = "";

  while (index < content.length) {
    const char = content[index];
    const next = content[index + 1];

    if (state === "lineComment") {
      if (char === "\n") {
        output += "\n";
        state = "code";
      } else {
        output += " ";
      }
      index += 1;
      continue;
    }

    if (state === "blockComment") {
      if (char === "*" && next === "/") {
        output += "  ";
        index += 2;
        state = "code";
      } else {
        output += char === "\n" ? "\n" : " ";
        index += 1;
      }
      continue;
    }

    if (state === "single" || state === "double" || state === "template" || state === "regex") {
      output += char;
      if (char === "\\") {
        output += next ?? "";
        index += 2;
        continue;
      }
      if (
        (state === "single" && char === "'") ||
        (state === "double" && char === "\"") ||
        (state === "template" && char === "`") ||
        (state === "regex" && char === "/")
      ) {
        state = "code";
      }
      index += 1;
      continue;
    }

    if (char === "/" && next === "/") {
      output += "  ";
      index += 2;
      state = "lineComment";
      continue;
    }
    if (char === "/" && next === "*") {
      output += "  ";
      index += 2;
      state = "blockComment";
      continue;
    }
    if (char === "'") state = "single";
    if (char === "\"") state = "double";
    if (char === "`") state = "template";
    if (char === "/" && isRegexStart(lastSignificant)) state = "regex";
    output += char;
    if (!/\s/.test(char)) lastSignificant = char;
    index += 1;
  }

  return output;
}

function isRegexStart(previous: string): boolean {
  return previous === "" || "([{=,:;!&|?+-*%^~<>".includes(previous);
}

export function stripCommentsAndStrings(content: string): string {
  const withoutComments = stripComments(content);
  let output = "";
  let index = 0;
  let quote: "'" | "\"" | "`" | undefined;

  while (index < withoutComments.length) {
    const char = withoutComments[index];
    const next = withoutComments[index + 1];
    if (!quote && (char === "'" || char === "\"" || char === "`")) {
      quote = char;
      output += " ";
      index += 1;
      continue;
    }
    if (quote) {
      if (char === "\\") {
        output += " ";
        if (next) output += " ";
        index += 2;
        continue;
      }
      if (char === quote) {
        quote = undefined;
      }
      output += char === "\n" ? "\n" : " ";
      index += 1;
      continue;
    }
    output += char;
    index += 1;
  }

  return output;
}

export function lineNumberAtIndex(content: string, index: number): number {
  if (index <= 0) return 1;
  let line = 1;
  for (let i = 0; i < Math.min(index, content.length); i += 1) {
    if (content[i] === "\n") line += 1;
  }
  return line;
}
