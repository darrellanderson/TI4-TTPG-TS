import { Card, Container, GameObject, Player } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";
import {
  MockCard,
  MockCardDetails,
  MockContainer,
  MockGameObject,
  MockPlayer,
  MockSnapPoint,
} from "ttpg-mock";

import { Planet } from "../../../lib/system-lib/planet/planet";
import { RightClickExplore } from "./right-click-explore";
import { System } from "../../../lib/system-lib/system/system";

it("constructor", () => {
  new MockGameObject(); // so there is an object in the world
  new RightClickExplore().init();
});

it("trigger custom action (system)", () => {
  const rightClickExplore = new RightClickExplore();
  const player: Player = new MockPlayer();
  const system: MockGameObject = MockGameObject.simple("tile.system:base/19");

  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.exploration.industrial:pok/my-name-1",
      }),
      new MockCardDetails({
        metadata: "card.exploration.industrial:pok/my-name-2",
      }),
    ],
  });
  const _mat: GameObject = MockGameObject.simple("mat.deck:pok/exploration", {
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-exploration-industrial"],
        snappedObject: deck,
      }),
    ],
  });
  expect(NSID.getDeck(deck)).toEqual([
    "card.exploration.industrial:pok/my-name-1",
    "card.exploration.industrial:pok/my-name-2",
  ]);
  expect(deck.getStackSize()).toBe(2);
  const found: Card | undefined =
    rightClickExplore._getExploreDeck("industrial");
  expect(found).toBe(deck);

  system._customActionAsPlayer(player, "*Explore Wellon (industrial)");
  expect(NSID.getDeck(deck)).toEqual([
    "card.exploration.industrial:pok/my-name-1",
  ]);

  // Again, one card left.
  system._customActionAsPlayer(player, "*Explore Wellon (industrial)");
});

it("trigger custom action (frontier)", () => {
  const systemObj: MockGameObject = MockGameObject.simple(
    "tile.system:base/19"
  );

  const player: Player = new MockPlayer();
  const token: MockGameObject = MockGameObject.simple(
    "token.attachment.system:pok/frontier"
  );

  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.exploration.frontier:pok/my-name-1",
      }),
      new MockCardDetails({
        metadata: "card.exploration.frontier:pok/my-name-2",
      }),
    ],
  });
  const _mat: GameObject = MockGameObject.simple("mat.deck:pok/exploration", {
    snapPoints: [
      new MockSnapPoint({
        tags: ["deck-exploration-frontier"],
        snappedObject: deck,
      }),
    ],
  });

  expect(token.isValid()).toBe(true);
  systemObj._customActionAsPlayer(player, "*Explore Frontier");
  expect(token.isValid()).toBe(false); // explore destroys token
  systemObj._customActionAsPlayer(player, "*Explore Frontier"); // again
});

it("_maybeAddPlanetAttachment", () => {
  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/19"
  );
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }

  const planet: Planet | undefined = system.getPlanets()[0];
  expect(planet).toBeDefined();
  if (!planet) {
    throw new Error("planet not found"); // for TypeScript
  }

  const cardNsid: string =
    "card.exploration.industrial:pok/biotic-research-facility";
  const tokenNsid: string =
    "token.attachment.planet:pok/biotic-research-facility";

  const attachmentToken: GameObject = MockGameObject.simple(tokenNsid);
  const container: Container = new MockContainer({ items: [attachmentToken] });
  expect(attachmentToken.getContainer()).toBeDefined();
  expect(container.getItems().includes(attachmentToken)).toBe(true);
  expect(TI4.planetAttachmentRegistry.getByCardNsid(cardNsid)).toBeDefined();

  const rightClickExplore = new RightClickExplore();
  rightClickExplore._maybeAddPlanetAttachment(planet, cardNsid);
});

it("_maybeAddSystemAttachment", () => {
  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/19"
  );
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  expect(system).toBeDefined();
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }

  const cardNsid: string = "card.exploration.frontier:pok/gamma-relay";
  const tokenNsid: string = "token.attachment.system:pok/wormhole-gamma";

  const attachmentToken: GameObject = MockGameObject.simple(tokenNsid);
  const container: Container = new MockContainer({ items: [attachmentToken] });
  expect(attachmentToken.getContainer()).toBeDefined();
  expect(container.getItems().includes(attachmentToken)).toBe(true);
  expect(TI4.systemAttachmentRegistry.getByCardNsid(cardNsid)).toBeDefined();

  const rightClickExplore = new RightClickExplore();
  rightClickExplore._maybeAddSystemAttachment(system, cardNsid);
});
