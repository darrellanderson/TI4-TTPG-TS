import {
  Card,
  Container,
  GameObject,
  Player,
  Widget,
  world,
} from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";
import {
  clickAll,
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockContainer,
  MockGameObject,
  MockPlayer,
  MockSnapPoint,
} from "ttpg-mock";

import { Planet } from "../../../lib/system-lib/planet/planet";
import { RightClickExplore } from "./right-click-explore";
import { System } from "../../../lib/system-lib/system/system";

it("static _checkIsDistantSuns (true)", () => {
  new MockCardHolder({ templateMetadata: "card-holder:base/player-hand" });
  MockGameObject.simple("sheet.faction:pok/naazrokha");

  const distantSuns: boolean = RightClickExplore._checkIsDistantSuns();
  expect(distantSuns).toBe(true);
});

it("static _checkIsDistantSuns (false)", () => {
  const distantSuns: boolean = RightClickExplore._checkIsDistantSuns();
  expect(distantSuns).toBe(false);
});

it("constructor", () => {
  new MockGameObject(); // so there is an object in the world
  new RightClickExplore().init();
});

it("faction changed", () => {
  new RightClickExplore();

  // No Naaz-Rokha.
  TI4.events.onFactionChanged.trigger(1);

  // Yes Naaz-Rokha.
  new MockCardHolder({ templateMetadata: "card-holder:base/player-hand" });
  MockGameObject.simple("sheet.faction:pok/naazrokha");
  TI4.events.onFactionChanged.trigger(1);
});

it("system changed", () => {
  new RightClickExplore();

  MockGameObject.simple("tile.system:base/19");
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(19);
  if (!system) {
    throw new Error("system not found");
  }

  TI4.events.onSystemChanged.trigger(system);
});

it("trigger custom action (system)", () => {
  new MockCardHolder({ templateMetadata: "card-holder:base/player-hand" });
  MockGameObject.simple("sheet.faction:pok/naazrokha");

  const rightClickExplore = new RightClickExplore();
  rightClickExplore.init();

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

  // Distant suns explore.
  system._customActionAsPlayer(player, "*Distant-Suns Wellon (industrial)");
});

it("trigger custom action (frontier)", () => {
  const systemObj: MockGameObject = MockGameObject.simple(
    "tile.system:base/39"
  ); // no planets

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

  // Create new token and explore again.
  MockGameObject.simple("token.attachment.system:pok/frontier");
  systemObj._customActionAsPlayer(player, "*Explore Frontier"); // again

  // Again, but missing frontier token.
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

it("_exploreDistantSuns (only one card)", () => {
  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/19"
  );
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  if (!planet) {
    throw new Error("planet not found"); // for TypeScript
  }
  const player: Player = new MockPlayer();

  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.exploration.industrial:pok/my-name-1",
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

  const rightClickExplore = new RightClickExplore();
  rightClickExplore._exploreDistantSuns(system, planet, "industrial", player);
});

it("_exploreDistantSuns (two cards)", () => {
  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/19"
  );
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  if (!planet) {
    throw new Error("planet not found"); // for TypeScript
  }
  const player: Player = new MockPlayer();

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

  const rightClickExplore = new RightClickExplore();
  rightClickExplore._exploreDistantSuns(system, planet, "industrial", player);
});

it("_exploreDistantSuns (three cards)", () => {
  const systemTileObj: GameObject = MockGameObject.simple(
    "tile.system:base/19"
  );
  const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
    systemTileObj.getId()
  );
  if (!system) {
    throw new Error("system not found"); // for TypeScript
  }
  const planet: Planet | undefined = system.getPlanets()[0];
  if (!planet) {
    throw new Error("planet not found"); // for TypeScript
  }
  const player: Player = new MockPlayer();

  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.exploration.industrial:pok/my-name-1",
      }),
      new MockCardDetails({
        metadata: "card.exploration.industrial:pok/my-name-2",
      }),
      new MockCardDetails({
        metadata: "card.exploration.industrial:pok/my-name-3",
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

  const rightClickExplore = new RightClickExplore();
  rightClickExplore._exploreDistantSuns(system, planet, "industrial", player);

  // Click all the buttons.
  const widgets: Array<Widget> = [];
  for (const obj of world.getAllObjects()) {
    for (const ui of obj.getUIs()) {
      const widget: Widget = ui.widget;
      widgets.push(widget);
    }
  }
  for (const widget of widgets) {
    clickAll(widget);
  }
});
