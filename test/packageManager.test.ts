import { describe, expect, it } from "vitest";
import { installCommand, scriptCommand } from "../src/utils/packageManager.js";

describe("packageManager helpers", () => {
  it("formats install commands", () => {
    expect(installCommand("npm")).toBe("npm install");
    expect(installCommand("pnpm")).toBe("pnpm install");
    expect(installCommand("yarn")).toBe("yarn install");
    expect(installCommand("bun")).toBe("bun install");
  });

  it("formats script commands", () => {
    expect(scriptCommand("npm", "test")).toBe("npm run test");
    expect(scriptCommand("pnpm", "test")).toBe("pnpm test");
    expect(scriptCommand("yarn", "test")).toBe("yarn test");
    expect(scriptCommand("bun", "test")).toBe("bun run test");
  });
});
