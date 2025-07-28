import { MockCard, MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";
import {
  AGE_OF_EXPLORATION_ACTION_NAME,
  RightClickAgeOfExploration,
} from "./right-click-age-of-exploration";
import { System } from "../../../lib/system-lib/system/system";
import { Player, Vector } from "@tabletop-playground/api";

it("_getAvailableLegalSystems", () => {
  const systemTileObj = MockGameObject.simple("tile.system:base/19");
  new MockContainer({ items: [systemTileObj] });

  const rightClickAgeOfExploration = new RightClickAgeOfExploration();
  const systems: Array<System> =
    rightClickAgeOfExploration._getAvailableLegalSystems();
  expect(systems.length).toBe(1);
});

it("_getAvailableRedSystems", () => {
  const systemTileObj = MockGameObject.simple("tile.system:base/19");
  new MockContainer({ items: [systemTileObj] });

  const rightClickAgeOfExploration = new RightClickAgeOfExploration();
  const systems: Array<System> =
    rightClickAgeOfExploration._getAvailableRedSystems();
  expect(systems.length).toBe(0);
});

it("_getAvailableBlueSystems", () => {
  const systemTileObj = MockGameObject.simple("tile.system:base/19");
  new MockContainer({ items: [systemTileObj] });

  const rightClickAgeOfExploration = new RightClickAgeOfExploration();
  const systems: Array<System> =
    rightClickAgeOfExploration._getAvailableBlueSystems();
  expect(systems.length).toBe(1);
});

it("_getAvailableSystem", () => {
  const rightClickAgeOfExploration = new RightClickAgeOfExploration();
  let system: System | undefined;

  system = rightClickAgeOfExploration._getAvailableSystem("blue");
  expect(system).toBeUndefined();

  system = rightClickAgeOfExploration._getAvailableSystem("red");
  expect(system).toBeUndefined();

  const systemTileObj = MockGameObject.simple("tile.system:base/19");
  new MockContainer({ items: [systemTileObj] });

  system = rightClickAgeOfExploration._getAvailableSystem("blue");
  expect(system?.getSystemTileNumber()).toBe(19);

  system = rightClickAgeOfExploration._getAvailableSystem("red");
  expect(system?.getSystemTileNumber()).toBe(19);
});

it("_dealSystemTile", () => {
  const systemTileObj = MockGameObject.simple("tile.system:base/19");
  new MockContainer({ items: [systemTileObj] });

  const rightClickAgeOfExploration = new RightClickAgeOfExploration();
  const pos: Vector = new Vector(0, 0, 0);
  rightClickAgeOfExploration._dealSystemTile(pos, "blue");
});

it("_chooseTileColor", () => {
  const rightClickAgeOfExploration = new RightClickAgeOfExploration();
  const _color: "red" | "blue" = rightClickAgeOfExploration._chooseTileColor();
});

it("_colorFromRoll", () => {
  const rightClickAgeOfExploration = new RightClickAgeOfExploration();
  let color: "red" | "blue";

  color = rightClickAgeOfExploration._colorFromRoll(4);
  expect(color).toBe("red");

  color = rightClickAgeOfExploration._colorFromRoll(5);
  expect(color).toBe("blue");
});

it("context menu", () => {
  const rightClickAgeOfExploration = new RightClickAgeOfExploration();
  rightClickAgeOfExploration.init();

  const card: MockCard = MockCard.simple(
    "card.event:codex.liberation/age-of-exploration"
  );
  process.flushTicks();
  const player: Player = new MockPlayer();
  card._customActionAsPlayer(player, AGE_OF_EXPLORATION_ACTION_NAME);
});
