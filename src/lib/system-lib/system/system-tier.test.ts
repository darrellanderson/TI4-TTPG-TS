import { MockGameObject } from "ttpg-mock";

import { SystemTier } from "./system-tier";
import { System } from "../system/system";

it("getTier (exclude)", () => {
  const system: System = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1000, isExcludeFromDraft: true }
  );
  expect(new SystemTier().getTier(system)).toBe("other");
});

it("getTier (red, no planets)", () => {
  const system: System = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    { tile: 1000 }
  );
  expect(new SystemTier().getTier(system)).toBe("red");
});

it("getTier (red, anomalies)", () => {
  const system: System = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      anomalies: ["gravity-rift"],
    }
  );
  expect(new SystemTier().getTier(system)).toBe("red");
});

it("getTier (med)", () => {
  const system: System = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/26" }),
    { source: "my-source", packageId: "my-package-id" },
    { tile: 26, planets: [{ name: "my-name", nsidName: "my-nsid-name" }] }
  );
  expect(new SystemTier().getTier(system)).toBe("med");
});

it("getTier (high, legendary)", () => {
  const system: System = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      planets: [
        { name: "my-name", nsidName: "my-nsid-name", isLegendary: true },
      ],
    }
  );
  expect(new SystemTier().getTier(system)).toBe("high");
});

it("getTier (med, two planets)", () => {
  const system: System = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      planets: [
        { name: "my-name-1", nsidName: "my-nsid-name-1" },
        { name: "my-name-2", nsidName: "my-nsid-name-2" },
      ],
    }
  );
  expect(new SystemTier().getTier(system)).toBe("med");
});

it("getTier (low, one planets)", () => {
  const system: System = new System(
    new MockGameObject({ templateMetadata: "tile.system:my-source/1000" }),
    { source: "my-source", packageId: "my-package-id" },
    {
      tile: 1000,
      planets: [{ name: "my-name-1", nsidName: "my-nsid-name-1" }],
    }
  );
  expect(new SystemTier().getTier(system)).toBe("low");
});
