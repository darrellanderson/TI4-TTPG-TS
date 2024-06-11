import { MockGameObject } from "ttpg-mock";
import { PlanetAttachment } from "./planet-attachment";

it("getAttachmentObj", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(planetAttachment.getAttachmentObj()).toBeUndefined();

  const attachmentToken = new MockGameObject();
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getAttachmentObj()).toBe(attachmentToken);

  attachmentToken.destroy();
  expect(planetAttachment.getAttachmentObj()).toBeUndefined();
});

it("getAttachmentObjId", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(planetAttachment.getAttachmentObjId()).toBeUndefined();

  planetAttachment.setAttachmentObjId("my-id");
  expect(planetAttachment.getAttachmentObjId()).toBe("my-id");

  planetAttachment.setAttachmentObjId(undefined);
  expect(planetAttachment.getAttachmentObjId()).toBeUndefined();
});

it("getInfluence", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    influence: 3,
  });
  expect(planetAttachment.getInfluence()).toBe(3);
});

it("getInfluence (default)", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(planetAttachment.getInfluence()).toBe(0);
});

it("getInfluence (face down)", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    influence: 3,
    influenceFaceDown: 5,
  });
  expect(planetAttachment.getInfluence()).toBe(3);

  const attachmentToken = new MockGameObject({
    rotation: [0, 0, 180],
  });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getInfluence()).toBe(5);
});

it("getLegendaryCardNsid", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    legendaryCardNsid: "legendary-1",
  });
  expect(planetAttachment.getLegendaryCardNsid()).toBe("legendary-1");
});

it("getName", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(planetAttachment.getName()).toBe("my-name");
});

it("getNsid", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(planetAttachment.getNsid()).toBe("my-nsid");
});

it("getResources", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    resources: 3,
  });
  expect(planetAttachment.getResources()).toBe(3);
});

it("getResources (default)", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(planetAttachment.getResources()).toBe(0);
});

it("getResources (face down)", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    resources: 3,
    resourcesFaceDown: 5,
  });
  expect(planetAttachment.getResources()).toBe(3);

  const attachmentToken = new MockGameObject({
    rotation: [0, 0, 180],
  });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getResources()).toBe(5);
});

it("getTechs", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    techs: ["blue", "red"],
  });
  expect(planetAttachment.getTechs()).toEqual(["blue", "red"]);
});

it("getTechs (face down)", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    techs: ["blue", "red"],
    techsFaceDown: ["yellow"],
  });
  expect(planetAttachment.getTechs()).toEqual(["blue", "red"]);

  const attachmentToken = new MockGameObject({
    rotation: [0, 0, 180],
  });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getTechs()).toEqual(["yellow"]);
});

it("getTraits", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    traits: ["cultural", "industrial"],
  });
  expect(planetAttachment.getTraits()).toEqual(["cultural", "industrial"]);
});

it("getTraits (face down)", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    traits: ["cultural", "industrial"],
    traitsFaceDown: ["hazardous"],
  });
  expect(planetAttachment.getTraits()).toEqual(["cultural", "industrial"]);

  const attachmentToken = new MockGameObject({
    rotation: [0, 0, 180],
  });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.getTraits()).toEqual(["hazardous"]);
});

it("isAttachmentFaceUp", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(planetAttachment.isAttachmentFaceUp()).toBe(true);

  const attachmentToken = new MockGameObject({ rotation: [0, 0, 180] });
  planetAttachment.setAttachmentObjId(attachmentToken.getId());
  expect(planetAttachment.isAttachmentFaceUp()).toBe(false);

  attachmentToken.destroy();
  expect(planetAttachment.isAttachmentFaceUp()).toBe(true);
});

it("isDestroyPlanet", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    isDestroyPlanet: true,
  });
  expect(planetAttachment.isDestroyPlanet()).toBe(true);
});

it("isDestroyPlanet (default)", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(planetAttachment.isDestroyPlanet()).toBe(false);
});

it("isLegendary", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
    isLegendary: true,
  });
  expect(planetAttachment.isLegendary()).toBe(true);
});

it("isLegendary (default)", () => {
  const planetAttachment = new PlanetAttachment({
    name: "my-name",
    nsid: "my-nsid",
  });
  expect(planetAttachment.isLegendary()).toBe(false);
});
