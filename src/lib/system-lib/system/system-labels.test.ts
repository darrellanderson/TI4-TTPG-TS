import { System } from "./system";
import { SystemLabels } from "./system-labels";

it("constructor", () => {
  const system = new System({ tile: 1 }, "my-source");
  const systemLabels = new SystemLabels(system);
  expect(systemLabels).toBeDefined();
});
