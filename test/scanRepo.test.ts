import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { scanRepo } from "../src/scanner/scanRepo.js";

describe("scanRepo", () => {
  it("ignores irrelevant directories", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-"));
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.mkdir(path.join(root, "node_modules/pkg"), { recursive: true });
    await fs.writeFile(path.join(root, "src/index.ts"), "export const value = 1;");
    await fs.writeFile(path.join(root, "node_modules/pkg/index.ts"), "export const ignored = 1;");
    const scan = await scanRepo(root);
    expect(scan.graph.files.map((file) => file.path)).toEqual(["src/index.ts"]);
  });

  it("ignores generated mobile native build artifacts", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-"));
    await fs.mkdir(path.join(root, "mobile/src"), { recursive: true });
    await fs.mkdir(path.join(root, "mobile/android/app/.cxx/Debug/abc/arm64-v8a"), { recursive: true });
    await fs.mkdir(path.join(root, "mobile/android/app/build/generated"), { recursive: true });
    await fs.writeFile(path.join(root, "mobile/src/App.tsx"), "export function App() { return null; }");
    await fs.writeFile(path.join(root, "mobile/android/app/.cxx/Debug/abc/arm64-v8a/ReactAndroidConfig.cmake"), "set(GENERATED 1)");
    await fs.writeFile(path.join(root, "mobile/android/app/build/generated/source.ts"), "export const generated = 1;");

    const scan = await scanRepo(root);

    expect(scan.graph.files.map((file) => file.path)).toEqual(["mobile/src/App.tsx"]);
    expect(scan.project.configFiles).not.toContain("mobile/android/app/.cxx/Debug/abc/arm64-v8a/ReactAndroidConfig.cmake");
  });

  it("uses ignored lockfiles for package manager detection without tracking them", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-"));
    await fs.writeFile(path.join(root, "package.json"), "{\"name\":\"lock-test\"}");
    await fs.writeFile(path.join(root, "pnpm-lock.yaml"), "lockfileVersion: 9");
    const scan = await scanRepo(root);
    expect(scan.project.packageManager).toBe("pnpm");
    expect(scan.graph.files.map((file) => file.path)).toEqual(["package.json"]);
  });

  it("resolves import graph edges through tsconfig aliases", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-"));
    await fs.mkdir(path.join(root, "src/lib"), { recursive: true });
    await fs.writeFile(path.join(root, "tsconfig.json"), JSON.stringify({
      compilerOptions: { baseUrl: ".", paths: { "@lib/*": ["src/lib/*"] } }
    }));
    await fs.writeFile(path.join(root, "src/index.ts"), "import { value } from '@lib/value';");
    await fs.writeFile(path.join(root, "src/lib/value.ts"), "export const value = 1;");
    const scan = await scanRepo(root);
    expect(scan.graph.imports).toContainEqual({ from: "src/index.ts", to: "src/lib/value.ts", type: "import" });
  });

  it("does not detect routes and env vars from tests or markdown examples", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "repowiki-"));
    await fs.mkdir(path.join(root, "src"), { recursive: true });
    await fs.mkdir(path.join(root, "test"), { recursive: true });
    await fs.writeFile(path.join(root, "src/server.ts"), "server.get('/real', handler); process.env.REAL_ENV;");
    await fs.writeFile(path.join(root, "test/routes.test.ts"), "router.get('/fake', handler); process.env.FAKE_ENV;");
    await fs.writeFile(path.join(root, "README.md"), "router.post('/docs', handler); process.env.DOC_ENV;");
    await fs.writeFile(path.join(root, ".env.example"), "EXAMPLE_ENV=value\n");

    const scan = await scanRepo(root);

    expect(scan.graph.routes).toEqual([{ method: "GET", path: "/real", file: "src/server.ts", handler: "handler", line: 1, confidence: "direct" }]);
    expect(scan.graph.envVars).toEqual([
      { name: "EXAMPLE_ENV", sourceFile: ".env.example", line: 1 },
      { name: "REAL_ENV", sourceFile: "src/server.ts", line: 1 }
    ]);
  });
});
