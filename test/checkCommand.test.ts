import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { checkCommand } from "../src/commands/check.js";

describe("checkCommand", () => {
  afterEach(() => {
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("prints a clear message when metadata is missing", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-check-"));
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.writeFile(path.join(root, "src/index.ts"), "export const value = 1;\n");
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);

    await checkCommand(root);

    expect(process.exitCode).toBe(1);
    expect(log.mock.calls.flat().join("\n")).toContain("RepoWiki metadata is missing.");
  });
});
