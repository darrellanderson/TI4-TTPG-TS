import { GameObject, Player, Vector } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";

import { System, WormholeWithPosition } from "../system/system";
import { SystemAttachment } from "./system-attachment";

it("static schemaToNsid", () => {
  expect(
    SystemAttachment.schemaToNsid("my-source", {
      name: "my-name",
      nsidName: "my-nsid-name",
    })
  ).toBe("token.attachment.system:my-source/my-nsid-name");
});

it("constructor", () => {
  const attachmentTokenObj = new MockGameObject({
    templateMetadata: "token.attachment.system:my-source/my-nsid-name",
  });
  const attachment = new SystemAttachment(
    attachmentTokenObj,
    { source: "my-source", packageId: "my-package-id" },
    {
      anomalies: ["asteroid-field"],
      name: "my-name",
      nsidName: "my-nsid-name",
      planets: [],
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    }
  );
  expect(attachment.getAnomalies()).toEqual(["asteroid-field"]);
  expect(attachment.getImg()).toEqual(
    "token/attachment/system/my-nsid-name.png"
  );
  expect(attachment.getImgPackageId()).toEqual("my-package-id");
  expect(attachment.getName()).toEqual("my-name");
  expect(attachment.getObj()).toBe(attachmentTokenObj);
  expect(attachment.getPlanets()).toEqual([]);
  expect(attachment.getWormholes()).toEqual(["alpha"]);
});

it("constructor (invalid params)", () => {
  expect(() => {
    new SystemAttachment(
      new MockGameObject({
        templateMetadata: "token.attachment.system:my-source/my-nsid-name",
      }),
      { source: "my-source", packageId: "my-package-id" },
      {
        name: "my-name",
        nsidName: "@@invalid??",
      }
    );
  }).toThrow();
});

it("constructor (invalid nsid)", () => {
  expect(() => {
    new SystemAttachment(
      new MockGameObject({
        templateMetadata: "nope",
      }),
      { source: "my-source", packageId: "my-package-id" },
      { name: "my-name", nsidName: "my-nsid-name" }
    );
  }).toThrow(
    'NSID mismatch: expected "token.attachment.system:my-source/my-nsid-name", got "nope"'
  );
});

it("anomalies empty", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(attachment.getAnomalies()).toEqual([]);
  expect(attachment.getName()).toEqual("my-name");
  expect(attachment.getNsidName()).toEqual("my-nsid-name");
});

it("img", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(attachment.getImg()).toBe("token/attachment/system/my-nsid-name.png");
});

it("img face down", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      imgFaceDown: true,
    }
  );
  expect(attachment.getImg()).toBe(
    `token/attachment/system/my-nsid-name.back.png`
  );
});

it("img homebrew", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:homebrew-x/my-nsid-name",
    }),
    { source: "homebrew-x", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(attachment.getImg()).toBe(
    "homebrew-x/token/attachment/system/my-nsid-name.png"
  );
});

it("planets", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      planets: [
        {
          name: "my-planet-name",
          nsidName: "my-planet-nsid",
        },
      ],
    }
  );
  expect(attachment.getPlanets().length).toEqual(1);
  expect(attachment.getPlanets()[0]?.getName()).toEqual("my-planet-name");
});

it("wormholes empty", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(attachment.getWormholes()).toEqual([]);
});

it("wormholesFaceDown", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      rotation: [0, 0, 180],
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    }
  );
  expect(attachment.getWormholes()).toEqual(["beta"]);
});

it("wormholesGlobalPosition", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      position: [1, 2, 3],
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    }
  );
  const out: Array<WormholeWithPosition> =
    attachment.getWormholesWithPositions();
  const check = out.map((x) => `${x.wormhole}:${x.position.toString()}`);
  expect(check).toEqual(["alpha:(X=1,Y=2,Z=3)"]);
});

it("wormholesWorldPosition face down", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      position: [1, 2, 3],
      rotation: [0, 0, 180],
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      wormholes: ["alpha"],
      wormholesFaceDown: ["beta"],
    }
  );
  const out: Array<WormholeWithPosition> =
    attachment.getWormholesWithPositions();
  const check = out.map((x) => `${x.wormhole}:${x.position.toString()}`);
  expect(check).toEqual(["beta:(X=1,Y=2,Z=3)"]);
});

it("attach/detach", () => {
  let onSystemChangedCound: number = 0;
  TI4.events.onSystemChanged.add(() => {
    onSystemChangedCound++;
  });

  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      planets: [
        {
          name: "my-planet-name",
          nsidName: "my-planet-nsid",
          localPosition: { x: 0, y: 0 },
        },
      ],
    }
  );
  let success: boolean = false;

  success = attachment.attach();
  expect(success).toBe(false); // no system
  expect(onSystemChangedCound).toBe(0);

  // Create system tile object, TI4.systemRegistry picks it up.
  new MockGameObject({ templateMetadata: `tile.system:base/1` });
  const system: System | undefined = TI4.systemRegistry.getByPosition(
    new Vector(0, 0, 0)
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }
  expect(system.hasAttachment(attachment)).toBe(false);
  expect(onSystemChangedCound).toBe(0);

  success = attachment.attach();
  attachment.doLayout();
  expect(success).toBe(true);
  expect(system.hasAttachment(attachment)).toBe(true);
  expect(onSystemChangedCound).toBe(1);

  success = attachment.attach();
  attachment.doLayout();
  expect(success).toBe(false); // already attached
  expect(system.hasAttachment(attachment)).toBe(true);
  expect(onSystemChangedCound).toBe(1);

  success = attachment.detach();
  attachment.doLayout();
  expect(success).toBe(true);
  expect(system.hasAttachment(attachment)).toBe(false);
  expect(onSystemChangedCound).toBe(2);

  success = attachment.detach();
  attachment.doLayout();
  expect(success).toBe(false);
  expect(system.hasAttachment(attachment)).toBe(false);
  expect(onSystemChangedCound).toBe(2);
});

it("grab/release", () => {
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not defined"); // for TypeScript
  }

  const attachmentTokenObj: MockGameObject = new MockGameObject({
    templateMetadata: "token.attachment.system:my-source/my-nsid-name",
  });
  const attachment = new SystemAttachment(
    attachmentTokenObj,
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );

  const player: Player = new MockPlayer();

  expect(system.hasAttachment(attachment)).toBe(false);
  attachmentTokenObj._releaseAsPlayer(player, false);
  expect(system.hasAttachment(attachment)).toBe(true);
  attachmentTokenObj._grabAsPlayer(player);
  expect(system.hasAttachment(attachment)).toBe(false);
});

it("isDestroyWormhole", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      isDestroyWormhole: true,
    }
  );
  expect(attachment.isDestroyWormhole()).toBe(true);
});

it("isDestroyWormhole (default)", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );
  expect(attachment.isDestroyWormhole()).toBe(false);
});

it("breach", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      isBreach: true,
    }
  );
  expect(attachment.isBreach()).toBe(true);
});

it("ingress", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      isIngress: true,
    }
  );
  expect(attachment.isIngress()).toBe(true);
  expect(attachment.isEgress()).toBe(false);
});

it("egress", () => {
  const attachment = new SystemAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.system:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      isEgress: true,
    }
  );
  expect(attachment.isEgress()).toBe(true);
  expect(attachment.isIngress()).toBe(false);
});
