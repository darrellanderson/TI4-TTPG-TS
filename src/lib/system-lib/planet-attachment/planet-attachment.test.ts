import { GameObject, Vector } from "@tabletop-playground/api";
import { MockGameObject } from "ttpg-mock";
import { PlanetAttachment } from "./planet-attachment";
import { resetGlobalThisTI4 } from "../../../global/global";
import { System } from "../system/system";
import { Planet } from "../planet/planet";

it("constructor", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(planetAttachment.getNsid()).toBe(
    "token.attachment:my-source/my-nsid-name"
  );
});

it("constructor (invalid params)", () => {
  expect(() => {
    new PlanetAttachment(
      {
        name: "",
        nsidName: "@@invalid??",
      },
      "my-source"
    );
  }).toThrow();
});

it("getAttachmentObj", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid",
    },
    "my-source"
  );
  expect(planetAttachment.getAttachmentObj()).toBeUndefined();

  const attachmentToken = new MockGameObject();
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getAttachmentObj()).toBe(attachmentToken);

  attachmentToken.destroy();
  expect(planetAttachment.getAttachmentObj()).toBeUndefined();
});

it("getAttachmentObjId", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(planetAttachment.getAttachmentObjId()).toBeUndefined();

  planetAttachment.setAttachmentObjId("my-id");
  expect(planetAttachment.getAttachmentObjId()).toBe("my-id");

  planetAttachment.setAttachmentObjId(undefined);
  expect(planetAttachment.getAttachmentObjId()).toBeUndefined();
});

it("getInfluence", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      influence: 3,
    },
    "my-source"
  );
  expect(planetAttachment.getInfluence()).toBe(3);
});

it("getInfluence (default)", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(planetAttachment.getInfluence()).toBe(0);
});

it("getInfluence (face down)", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      influence: 3,
      influenceFaceDown: 5,
    },
    "my-source"
  );
  expect(planetAttachment.getInfluence()).toBe(3);

  const attachmentToken = new MockGameObject({
    rotation: [0, 0, 180],
  });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getInfluence()).toBe(5);
});

it("getLegendaryCardNsid", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      legendaryNsidName: "legendary-1",
    },
    "my-source"
  );
  expect(planetAttachment.getLegendaryCardNsid()).toBe(
    "card.legendary_planet:my-source/legendary-1"
  );
});

it("getName", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(planetAttachment.getName()).toBe("my-name");
});

it("getNsid", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(planetAttachment.getNsid()).toBe(
    "token.attachment:my-source/my-nsid-name"
  );
});

it("getResources", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      resources: 3,
    },
    "my-source"
  );
  expect(planetAttachment.getResources()).toBe(3);
});

it("getResources (default)", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(planetAttachment.getResources()).toBe(0);
});

it("getResources (face down)", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      resources: 3,
      resourcesFaceDown: 5,
    },
    "my-source"
  );
  expect(planetAttachment.getResources()).toBe(3);

  const attachmentToken = new MockGameObject({
    rotation: [0, 0, 180],
  });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getResources()).toBe(5);
});

it("getTechs", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      techs: ["blue", "red"],
    },
    "my-source"
  );
  expect(planetAttachment.getTechs()).toEqual(["blue", "red"]);
});

it("getTechs (face down)", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      techs: ["blue", "red"],
      techsFaceDown: ["yellow"],
    },
    "my-source"
  );
  expect(planetAttachment.getTechs()).toEqual(["blue", "red"]);

  const attachmentToken = new MockGameObject({
    rotation: [0, 0, 180],
  });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getTechs()).toEqual(["yellow"]);
});

it("getTraits", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      traits: ["cultural", "industrial"],
    },
    "my-source"
  );
  expect(planetAttachment.getTraits()).toEqual(["cultural", "industrial"]);
});

it("getTraits (face down)", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      traits: ["cultural", "industrial"],
      traitsFaceDown: ["hazardous"],
    },
    "my-source"
  );
  expect(planetAttachment.getTraits()).toEqual(["cultural", "industrial"]);

  const attachmentToken = new MockGameObject({
    rotation: [0, 0, 180],
  });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getTraits()).toEqual(["hazardous"]);
});

it("isAttachmentFaceUp", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(planetAttachment.isAttachmentFaceUp()).toBe(true);

  const attachmentToken = new MockGameObject({ rotation: [0, 0, 180] });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.isAttachmentFaceUp()).toBe(false);

  attachmentToken.destroy();
  expect(planetAttachment.isAttachmentFaceUp()).toBe(true);
});

it("isDestroyPlanet", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      isDestroyPlanet: true,
    },
    "my-source"
  );
  expect(planetAttachment.isDestroyPlanet()).toBe(true);
});

it("isDestroyPlanet (default)", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(planetAttachment.isDestroyPlanet()).toBe(false);
});

it("isLegendary", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
      isLegendary: true,
    },
    "my-source"
  );
  expect(planetAttachment.isLegendary()).toBe(true);
});

it("isLegendary (default)", () => {
  const planetAttachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  expect(planetAttachment.isLegendary()).toBe(false);
});

it("attach/dettach", () => {
  resetGlobalThisTI4();
  const systemTileObj: GameObject = new MockGameObject({
    templateMetadata: "tile.system:base/1",
  });
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();
  const planet: Planet | undefined = system?.getPlanetClosest(
    new Vector(0, 0, 0)
  );
  expect(planet).toBeDefined();

  const attachment = new PlanetAttachment(
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    },
    "my-source"
  );
  const attachmentNsid: string = attachment.getNsid();

  const attachmentTokenObj: GameObject = new MockGameObject({
    templateMetadata: attachmentNsid,
  });
  attachment.setAttachmentObjId(attachmentTokenObj.getId());

  expect(planet?.hasAttachment(attachmentNsid)).toBe(false);
  attachment.attach();
  expect(planet?.hasAttachment(attachmentNsid)).toBe(true);
  attachment.detach();
  expect(planet?.hasAttachment(attachmentNsid)).toBe(false);
});
