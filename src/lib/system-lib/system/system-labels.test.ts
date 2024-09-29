import { MockGameObject } from "ttpg-mock";
import { System } from "../system/system";
import { SystemLabels } from "./system-labels";
import { SystemAttachment } from "../system-attachment/system-attachment";
import { PlanetAttachment } from "../planet-attachment/planet-attachment";

it("constructor", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1000 },
  );
  const systemLabels = new SystemLabels(system);
  expect(systemLabels).toBeDefined();
});

it("attach/detach", () => {
  const system = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      planets: [{ name: "my-planet", nsidName: "my-plnaet-nsid-name" }],
      wormholes: ["alpha"],
    },
  );

  system.addAttachment(
    new SystemAttachment(
      new MockGameObject({
        templateMetadata: "token.attachment.system:my-source/my-nsid-name",
      }),
      { source: "my-source", packageId: "my-package-id" },
      { name: "my-name", nsidName: "my-nsid-name" },
    ),
  );

  system.getPlanets()[0]?.addAttachment(
    new PlanetAttachment(
      new MockGameObject({
        templateMetadata:
          "token.attachment.planet:my-source/my-planet-nsid-name",
      }),
      { source: "my-source", packageId: "my-package-id" },
      { name: "my-planet-name", nsidName: "my-planet-nsid-name" },
    ),
  );

  const systemLabels = new SystemLabels(system);
  systemLabels.attach().detach();

  systemLabels.attach(); // leave lines for pruning
  SystemLabels.removePlanetLines();
});
