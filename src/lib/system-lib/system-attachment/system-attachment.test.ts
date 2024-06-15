import { refPackageId } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";

import { System, WormholeWithWorldPosition } from "../system/system";
import { SystemAttachment } from "./system-attachment";
import { resetGlobalThisTI4 } from "../../../global/global";

it("constructor", () => {
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    anomalies: ["asteroid-field"],
    imgPackageId: "my-package-id",
    name: "my-name",
    nsidName: "my-nsid-name",
    planets: [],
    wormholes: ["alpha"],
    wormholesFaceDown: ["beta"],
  });
  expect(attachment.getAnomalies()).toEqual(["asteroid_field"]);
  expect(attachment.getImg()).toEqual(
    "token/attachment/system/my-nsid-name.png:my-package-id"
  );
  expect(attachment.getName()).toEqual("my-name");
  expect(attachment.getNsid()).toEqual(
    "token.attachment:my-source/my-nsid-name"
  );
  expect(attachment.getPlanets()).toEqual([]);
  expect(attachment.getWormholes()).toEqual(["alpha"]);
});

it("constructor (invalid params)", () => {
  expect(() => {
    new SystemAttachment(new MockGameObject(), "my-source", {
      name: "",
      nsidName: "@@invalid??",
    });
  }).toThrow();
});

it("anomalies empty", () => {
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "my-name",
    nsidName: "my-nsid-name",
  });
  expect(attachment.getAnomalies()).toEqual([]);
});

it("img no package id", () => {
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "my-name",
    nsidName: "my-nsid-name",
  });
  expect(attachment.getImg()).toBe(
    `token/attachment/system/my-nsid-name.png:${refPackageId}`
  );
});

it("planets", () => {
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "my-name",
    nsidName: "my-nsid-name",
    planets: [
      {
        name: "my-planet-name",
        nsidName: "my-planet-nsid",
      },
    ],
  });
  expect(attachment.getPlanets().length).toEqual(1);
  expect(attachment.getPlanets()[0]?.getName()).toEqual("my-planet-name");
});

it("wormholes empty", () => {
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "my-name",
    nsidName: "my-nsid-name",
  });
  expect(attachment.getWormholes()).toEqual([]);
});

it("wormholesFaceDown", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({ rotation: [0, 0, 180] }),
    "my-source",
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    }
  );
  expect(attachment.getWormholes()).toEqual(["beta"]);
});

it("wormholesWorldPosition", () => {
  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "my-name",
    nsidName: "my-nsid-name",
    wormholes: ["alpha"],
    wormholesFaceDown: ["beta"],
  });
  const out: Array<WormholeWithWorldPosition> =
    attachment.getWormholesWithPositions();
  const check = out.map((x) => `${x.wormhole}:${x.globalPosition.toString()}`);
  expect(check).toEqual(["alpha:(X=0,Y=0,Z=0)"]);
});

it("wormholesGlobalPosition (non-origin attachment)", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({ position: [1, 2, 3] }),
    "my-source",
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    }
  );
  const out: Array<WormholeWithWorldPosition> =
    attachment.getWormholesWithPositions();
  const check = out.map((x) => `${x.wormhole}:${x.globalPosition.toString()}`);
  expect(check).toEqual(["alpha:(X=1,Y=2,Z=3)"]);
});

it("wormholesWorldPosition face down", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({ rotation: [0, 0, 180] }),
    "my-source",
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    }
  );
  const out: Array<WormholeWithWorldPosition> =
    attachment.getWormholesWithPositions();
  const check = out.map((x) => `${x.wormhole}:${x.globalPosition.toString()}`);
  expect(check).toEqual(["beta:(X=0,Y=0,Z=0)"]);
});

it("attach/detach", () => {
  // Reset TI4.systemRegistry because globalEvents gets reset between tests.
  resetGlobalThisTI4();
  new MockGameObject({ templateMetadata: `tile.system:base/1` });
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileObjId("1");
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }

  const attachment = new SystemAttachment(new MockGameObject(), "my-source", {
    name: "my-name",
    nsidName: "my-nsid-name",
  });
  expect(system.hasAttachment(attachment)).toBe(false);

  let success: boolean = false;
  success = attachment.attach();
  expect(success).toBe(true);
  expect(system.hasAttachment(attachment)).toBe(true);

  success = attachment.attach();
  expect(success).toBe(false); // already attached
  expect(system.hasAttachment(attachment)).toBe(true);

  success = attachment.detach();
  expect(success).toBe(true);
  expect(system.hasAttachment(attachment)).toBe(false);

  success = attachment.detach();
  expect(success).toBe(false);
  expect(system.hasAttachment(attachment)).toBe(false);
});
