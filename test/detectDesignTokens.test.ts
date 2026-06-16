import { describe, expect, it } from "vitest";
import { detectDesignTokens, isTokenFile } from "../src/scanner/detectDesignTokens.js";

describe("detectDesignTokens", () => {
  it("detects CSS custom properties", () => {
    const content = `
      :root {
        --color-primary: #007bff;
        --color-secondary: #6c757d;
        --spacing-sm: 0.5rem;
        --spacing-md: 1rem;
        --font-size-base: 16px;
      }
    `;
    const tokens = detectDesignTokens("src/styles/tokens.css", content);
    expect(tokens.length).toBeGreaterThan(0);
    const primary = tokens.find((t) => t.name === "color-primary");
    expect(primary).toBeDefined();
    expect(primary?.category).toBe("color");
    expect(primary?.source).toBe("css-variable");
    expect(primary?.value).toBe("#007bff");
  });

  it("detects SCSS variables", () => {
    const content = `
      $primary-color: #ff5722;
      $spacing-unit: 8px;
    `;
    const tokens = detectDesignTokens("src/styles/variables.scss", content);
    expect(tokens.length).toBe(2);
    expect(tokens[0].name).toBe("$primary-color");
    expect(tokens[0].source).toBe("scss-variable");
  });

  it("detects tokens from JSON files", () => {
    const content = JSON.stringify({
      color: {
        primary: "#000",
        secondary: "#fff"
      },
      spacing: {
        small: "4px",
        medium: "8px"
      }
    });
    const tokens = detectDesignTokens("tokens.json", content);
    expect(tokens.length).toBe(4);
    const primary = tokens.find((t) => t.name === "color.primary");
    expect(primary).toBeDefined();
    expect(primary?.category).toBe("color");
    expect(primary?.source).toBe("token-json");
  });

  it("detects tokens from theme objects in JS/TS", () => {
    const content = `
      export const theme = {
        colors: {
          primary: "#000",
          secondary: "#fff"
        },
        spacing: {
          sm: "4px",
          md: "8px"
        }
      };
    `;
    const tokens = detectDesignTokens("src/theme/index.ts", content);
    expect(tokens.length).toBe(4);
    expect(tokens[0].source).toBe("theme-object");
  });

  it("infers correct categories", () => {
    const content = `
      :root {
        --color-primary: #000;
        --font-family: sans-serif;
        --shadow-md: 0 2px 4px rgba(0,0,0,0.1);
        --border-radius: 4px;
        --duration-fast: 150ms;
        --breakpoint-md: 768px;
      }
    `;
    const tokens = detectDesignTokens("src/styles.css", content);
    const color = tokens.find((t) => t.name === "color-primary");
    const font = tokens.find((t) => t.name === "font-family");
    const shadow = tokens.find((t) => t.name === "shadow-md");
    const border = tokens.find((t) => t.name === "border-radius");
    const anim = tokens.find((t) => t.name === "duration-fast");
    const bp = tokens.find((t) => t.name === "breakpoint-md");
    expect(color?.category).toBe("color");
    expect(font?.category).toBe("typography");
    expect(shadow?.category).toBe("shadow");
    expect(border?.category).toBe("border");
    expect(anim?.category).toBe("animation");
    expect(bp?.category).toBe("breakpoint");
  });

  it("returns empty array for files without tokens", () => {
    const tokens = detectDesignTokens("src/data.json", JSON.stringify({ items: [1, 2, 3] }));
    expect(tokens).toEqual([]);
  });

  it("handles invalid JSON gracefully", () => {
    const tokens = detectDesignTokens("src/bad.json", "{ invalid json");
    expect(tokens).toEqual([]);
  });
});

describe("isTokenFile", () => {
  it("identifies token files by name", () => {
    expect(isTokenFile("tokens.json")).toBe(true);
    expect(isTokenFile("theme.ts")).toBe(true);
    expect(isTokenFile("design-tokens.json")).toBe(true);
  });

  it("identifies token files by path", () => {
    expect(isTokenFile("src/tokens/colors.json")).toBe(true);
    expect(isTokenFile("src/theme/index.ts")).toBe(true);
  });

  it("returns false for non-token files", () => {
    expect(isTokenFile("src/components/Button.tsx")).toBe(false);
    expect(isTokenFile("package.json")).toBe(false);
  });
});
