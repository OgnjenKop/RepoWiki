import { describe, expect, it } from "vitest";
import { detectRoutes } from "../src/scanner/detectRoutes.js";

describe("detectRoutes", () => {
  it("detects Next.js app root route", () => {
    expect(detectRoutes("app/page.tsx", "export default function Page() {}")).toEqual([
      { path: "/", file: "app/page.tsx", line: 1, confidence: "inferred" }
    ]);
  });

  it("detects Express-style routes", () => {
    expect(detectRoutes("src/routes.ts", "router.get('/users', listUsers);")).toEqual([
      { method: "GET", path: "/users", file: "src/routes.ts", handler: "listUsers", line: 1, confidence: "direct" }
    ]);
  });

  it("detects common Express app variable names", () => {
    expect(detectRoutes("src/server.ts", "server.delete('/sessions', removeSession);")).toEqual([
      { method: "DELETE", path: "/sessions", file: "src/server.ts", handler: "removeSession", line: 1, confidence: "direct" }
    ]);
  });

  it("detects NestJS controller routes with controller prefixes", () => {
    expect(detectRoutes("src/users.controller.ts", `@Controller("users")
export class UsersController {
  @Get(":id")
  findOne() {}

  @Post()
  create() {}
}`)).toEqual([
      { method: "GET", path: "/users/:id", file: "src/users.controller.ts", handler: "findOne", controller: "UsersController", line: 3, confidence: "direct" },
      { method: "POST", path: "/users", file: "src/users.controller.ts", handler: "create", controller: "UsersController", line: 6, confidence: "direct" }
    ]);
  });

  it("detects modern Next.js app routes with groups and dynamic segments", () => {
    expect(detectRoutes("app/(marketing)/blog/[slug]/page.tsx", "export default function Page() {}")).toEqual([
      { path: "/blog/:slug", file: "app/(marketing)/blog/[slug]/page.tsx", line: 1, confidence: "inferred" }
    ]);
  });

  it("detects Next.js pages routes including api and dynamic segments", () => {
    expect(detectRoutes("pages/api/[id].ts", "export default function handler() {}")).toEqual([
      { path: "/api/:id", file: "pages/api/[id].ts", line: 1, confidence: "inferred" }
    ]);
  });

  it("ignores routes in comments", () => {
    expect(detectRoutes("src/routes.ts", "// router.get('/fake', fake);\nrouter.post('/real', real);")).toEqual([
      { method: "POST", path: "/real", file: "src/routes.ts", handler: "real", line: 2, confidence: "direct" }
    ]);
  });
});
