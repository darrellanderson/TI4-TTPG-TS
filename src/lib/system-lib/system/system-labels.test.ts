import { MockGameObject } from "ttpg-mock";
import { System } from "../system/system";
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

it("attach/detach", () => {
  const system = new System(
    new MockGameObject(),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1,
      planets: [{ name: "my-planet", nsidName: "my-plnaet-nsid-name" }],
      wormholes: ["alpha"],
    }
  );
  new SystemLabels(system).attach().detach();
});
