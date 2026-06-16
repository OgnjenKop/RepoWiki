import { describe, expect, it } from "vitest";
import type { ComponentRecord, DesignTokenRecord } from "../src/types/index.js";
import { buildDesignSystem } from "../src/scanner/detectDesignSystem.js";

describe("buildDesignSystem", () => {
  it("returns undefined when no components or tokens", () => {
    const result = buildDesignSystem([], [], ["src/index.ts"]);
    expect(result).toBeUndefined();
  });

  it("detects React as primary framework", () => {
    const components: ComponentRecord[] = [
      { name: "Button", file: "src/Button.tsx", framework: "react", exported: true },
      { name: "Card", file: "src/Card.tsx", framework: "react", exported: true },
      { name: "Item", file: "src/Item.vue", framework: "vue", exported: true }
    ];
    const result = buildDesignSystem(components, [], ["src/index.ts"]);
    expect(result?.framework).toBe("react");
    expect(result?.componentFiles).toHaveLength(3);
  });

  it("separates story files from component files", () => {
    const components: ComponentRecord[] = [
      { name: "Button", file: "src/Button.tsx", framework: "react", exported: true },
      { name: "Button", file: "src/Button.stories.tsx", framework: "react", exported: true, isStory: true }
    ];
    const result = buildDesignSystem(components, [], []);
    expect(result?.componentFiles).toEqual(["src/Button.tsx"]);
    expect(result?.storyFiles).toEqual(["src/Button.stories.tsx"]);
    expect(result?.hasStorybook).toBe(true);
  });

  it("collects token files", () => {
    const tokens: DesignTokenRecord[] = [
      { name: "primary", value: "#000", category: "color", file: "tokens.json", source: "token-json" },
      { name: "secondary", value: "#fff", category: "color", file: "src/theme.css", source: "css-variable" }
    ];
    const result = buildDesignSystem([], tokens, []);
    expect(result?.tokenFiles).toEqual(["src/theme.css", "tokens.json"]);
  });
});
