import { MockGameObject } from "ttpg-mock";
import { System } from "./system";
import { SystemLabels } from "./system-labels";

it("constructor", () => {
  const system = new System(
    new MockGameObject(),
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1 }
  );
  const systemLabels = new SystemLabels(system);
  expect(systemLabels).toBeDefined();
});
