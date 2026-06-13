import { describe, expect, it } from "vitest";
import { buildAreaContextPack, buildModuleContextPack, buildProjectContextPack, buildRouteContextPack } from "../src/ai/contextPacks.js";
import type { RepoScan } from "../src/types/index.js";

const scan: RepoScan = {
  rootDir: "/tmp/project",
    project: {
      name: "fixture",
      type: "Node/TypeScript",
      packageManager: "npm",
      scripts: { build: "tsc", test: "vitest run" },
      dependencies: [],
      devDependencies: [],
      configFiles: ["package.json"]
  },
  graph: {
    files: [
      { path: "package.json", language: "JSON", size: 1, hash: "pkg", imports: [], exports: [], symbols: [] },
      { path: "src/auth/controller.ts", language: "TypeScript", size: 1, hash: "controller", imports: ["./service"], exports: ["getAuth"], symbols: [] },
      { path: "src/auth/service.ts", language: "TypeScript", size: 1, hash: "service", imports: [], exports: ["login"], symbols: [] },
      { path: "src/auth/spec.ts", language: "TypeScript", size: 1, hash: "spec", imports: ["./controller"], exports: [], symbols: [] },
      { path: "src/docs/writeDocs.ts", language: "TypeScript", size: 1, hash: "docs", imports: [], exports: [], symbols: [] }
    ],
    imports: [
      { from: "src/auth/controller.ts", to: "src/auth/service.ts", type: "import" },
      { from: "src/auth/spec.ts", to: "src/auth/controller.ts", type: "import" }
    ],
    modules: [{ id: "src-auth", name: "auth", rootPath: "src/auth", files: ["src/auth/controller.ts", "src/auth/service.ts"] }],
    areas: [
      { id: "area-auth", name: "Authentication area", modules: ["src-auth"], rootPaths: ["src/auth"], files: ["src/auth/controller.ts", "src/auth/service.ts"], purpose: "Authentication flow." },
      { id: "area-docs", name: "Presentation and output: docs", modules: ["src-docs"], rootPaths: ["src/docs"], files: ["src/docs/writeDocs.ts"], purpose: "Wiki writers." }
    ],
    routes: [{ method: "GET", path: "/auth", file: "src/auth/controller.ts", handler: "getAuth" }],
    envVars: [],
    tests: [{ path: "src/auth/spec.ts", testedFile: "src/auth/controller.ts" }]
  }
};

describe("context packs", () => {
  it("includes flows for project, module, and route packs", async () => {
    const projectPack = await buildProjectContextPack(scan);
    const modulePack = await buildModuleContextPack({ scan, module: scan.graph.modules[0]! });
    const routePack = await buildRouteContextPack({ scan, route: scan.graph.routes[0]! });

    expect(projectPack.flows.length).toBeGreaterThanOrEqual(0);
    expect(modulePack.flows.length).toBeGreaterThan(0);
    expect(routePack.flows.length).toBeGreaterThan(0);
    expect(projectPack.changeTargets.length).toBeGreaterThan(0);
    expect(projectPack.changePaths.length).toBeGreaterThan(0);
    expect(modulePack.changePaths.length).toBeGreaterThan(0);
    expect(modulePack.changeTargets.length).toBeGreaterThan(0);
    expect(routePack.changePaths.length).toBeGreaterThan(0);
    expect(routePack.changeTargets.length).toBeGreaterThan(0);
    expect(projectPack.changePaths[0]?.evidence.length).toBeGreaterThan(0);
    expect(modulePack.changePaths[0]?.evidence.length).toBeGreaterThan(0);
    expect(routePack.changePaths[0]?.evidence.length).toBeGreaterThan(0);
    expect(projectPack.verificationHints.length).toBeGreaterThan(0);
    expect(modulePack.verificationHints.length).toBeGreaterThan(0);
    expect(routePack.verificationHints.length).toBeGreaterThan(0);
    expect(projectPack.verificationHints.some((hint) => hint.task.includes("build"))).toBe(true);
    expect(modulePack.verificationHints.some((hint) => hint.task.includes("build"))).toBe(true);
    expect(routePack.verificationHints.some((hint) => hint.task.includes("build"))).toBe(true);
    const areaPack = await buildAreaContextPack({ scan, area: scan.graph.areas[0]! });
    expect(areaPack.scope).toBe("area");
    expect(areaPack.verificationHints.some((hint) => hint.task.includes("build"))).toBe(true);
    expect(areaPack.relations.some((relation) => relation.title === "Area modules")).toBe(true);
    expect(areaPack.files.map((file) => file.path)).toContain("package.json");
    expect(projectPack.files.map((file) => file.path)).toEqual(expect.arrayContaining(projectPack.changePaths.flatMap((path) => path.files)));
    expect(modulePack.files.map((file) => file.path)).toEqual(expect.arrayContaining(modulePack.changePaths.flatMap((path) => path.files)));
    expect(routePack.files.map((file) => file.path)).toEqual(expect.arrayContaining(routePack.changePaths.flatMap((path) => path.files)));
    expect(modulePack.files.map((file) => file.path)).toContain("package.json");
    expect(routePack.files.map((file) => file.path)).toContain("package.json");
    expect(routePack.flows[0]?.title).toContain("Request handling path");
    expect(routePack.flows[0]?.steps.join(" ")).toContain("/auth");
    expect(routePack.flows[0]?.steps.join(" ")).toContain("[direct]");
    expect(modulePack.flows[0]?.files).toContain("src/auth/controller.ts");
    expect(projectPack.relations.some((relation) => relation.title === "Config files")).toBe(true);
    expect(projectPack.relations.some((relation) => relation.title === "Important entry files")).toBe(true);
    expect(modulePack.relations.some((relation) => relation.title === "Entry files")).toBe(true);
    expect(modulePack.relations.some((relation) => relation.title === "Runtime consumers")).toBe(true);
    expect(modulePack.relations.some((relation) => relation.title === "Test consumers")).toBe(true);
    expect(projectPack.verificationHints.some((hint) => hint.task.includes("Review representative tests"))).toBe(true);
    expect(modulePack.verificationHints.some((hint) => hint.task.includes("Inspect related tests"))).toBe(true);
    expect(routePack.verificationHints.some((hint) => hint.task.includes("Exercise the route"))).toBe(true);
    expect(projectPack.relations.find((relation) => relation.title === "Module areas")?.files).toEqual(expect.arrayContaining(["Presentation and output: docs", "Authentication area"]));
  });
});
