import { Card, Vector } from "@tabletop-playground/api";
import { MockCard, MockGameObject, MockUIElement } from "ttpg-mock";
import { PlanetCardLayout } from "./planet-card-layout";
import { System } from "../system/system";
import { Planet } from "../planet/planet";
import { PlanetAttachment } from "./planet-attachment";

it("_getCard", () => {
  // Create system tile obj, TI4.systemRegistry picks it up.
  MockGameObject.simple("tile.system:base/1");
  MockCard.simple("card.planet:base/jord");

  const system: System | undefined = TI4.systemRegistry.getByPosition(
    new Vector(0, 0, 0)
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }
  const planet: Planet | undefined = system.getPlanetClosest(
    new Vector(0, 0, 0)
  );
  expect(planet).toBeDefined();
  if (!planet) {
    throw new Error("planet not found"); // for TypeScript
  }

  const planetCardLayout = new PlanetCardLayout();
  const card: Card | undefined = planetCardLayout._getCard(planet);
  expect(card).toBeDefined();
});

it("_removeUIs", () => {
  const card: Card = new MockCard();
  card.addUI(new MockUIElement());
  expect(card.getUIs().length).toBe(1);

  const planetCardLayout = new PlanetCardLayout();
  planetCardLayout._removeUIs(card);

  expect(card.getUIs().length).toBe(0);
});

it("_addImageCardFace/back", () => {
  const attachment: PlanetAttachment = new PlanetAttachment(
    new MockGameObject({
      templateMetadata: "token.attachment.planet:my-source/my-nsid-name",
    }),
    { source: "my-source", packageId: "my-package-id" },
    {
      name: "my-name",
      nsidName: "my-nsid-name",
    }
  );

  const planetCardLayout = new PlanetCardLayout();
  const card: Card = new MockCard();

  const index: number = 0;
  planetCardLayout._addImageCardFace(card, attachment, index);
  planetCardLayout._addImageCardFace(card, attachment, 10);
  expect(card.getUIs().length).toBe(2);

  planetCardLayout._addImageCardBack(card, attachment, index);
  planetCardLayout._addImageCardBack(card, attachment, 10);
  expect(card.getUIs().length).toBe(4);
});
