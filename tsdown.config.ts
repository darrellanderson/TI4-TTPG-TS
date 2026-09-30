import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    "mock/index": "./src/nsid/nsid-to-template-id.test.ts",
  },
  deps: { neverBundle: true },
  format: {
    cjs: { target: ["node16"] },
  },
});
