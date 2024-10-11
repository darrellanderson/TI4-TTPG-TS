import {
  GameObject,
  MockContainer,
  MockGameObject,
  MockPlayer,
} from "ttpg-mock";
import { DiplomacySystem } from "./diplomacy-system";
import { Container, Player } from "@tabletop-playground/api";

it("constructor", () => {
  new DiplomacySystem().init();
});

it("diplomacySystem", () => {
  const systemTileObj: MockGameObject = new MockGameObject({
    templateMetadata: "tile.system:base/18",
    position: [10, 0, 0],
  });
  const player: Player = new MockPlayer({ slot: 3 });

  const myToken: GameObject = new MockGameObject({
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 3,
  });
  const myContainer: Container = new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: 3,
    items: [myToken],
  });

  const otherToken: GameObject = new MockGameObject({
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 4,
  });
  const otherContainer: Container = new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: 4,
    items: [otherToken],
  });
  const _otherTokenOnSystem: GameObject = new MockGameObject({
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 4,
    position: [10, 0, 0],
  });

  const grabToken: GameObject = new MockGameObject({
    templateMetadata: "token.command:base/sol",
    owningPlayerSlot: 5,
  });
  const grabContainer: Container = new MockContainer({
    templateMetadata: "container.token.command:base/generic",
    owningPlayerSlot: 5,
    items: [grabToken],
  });

  expect(myContainer.getNumItems()).toBe(1);
  expect(otherContainer.getNumItems()).toBe(1);
  expect(grabContainer.getNumItems()).toBe(1);

  new DiplomacySystem().diplomacySystem(systemTileObj, player);

  expect(myContainer.getNumItems()).toBe(1);
  expect(otherContainer.getNumItems()).toBe(1);
  expect(grabContainer.getNumItems()).toBe(0);
});

it("custom action", () => {
  new MockGameObject(); // so an object is in the world
  new DiplomacySystem().init();
  const systemTileObj: MockGameObject = new MockGameObject({
    templateMetadata: "tile.system:base/18",
    position: [10, 0, 0],
  });
  systemTileObj._customActionAsPlayer(new MockPlayer(), "*Diplomacy System");
});
