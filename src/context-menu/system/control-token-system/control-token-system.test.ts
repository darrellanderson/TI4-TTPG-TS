import { MockContainer, MockGameObject, MockPlayer } from "ttpg-mock";
import { ControlTokenSystem } from "./control-token-system";
import { Container, GameObject, Player } from "@tabletop-playground/api";

it("constructor", () => {
  new ControlTokenSystem().init();
});

it("addControlToken", () => {
  let success: boolean;
  const controlTokenSystem: ControlTokenSystem = new ControlTokenSystem();

  const systemTileObj: MockGameObject = new MockGameObject({
    templateMetadata: "tile.system:base/18",
    position: [10, 0, 0],
  });
  const player: Player = new MockPlayer({ slot: 3 });

  success = controlTokenSystem.addControlToken(systemTileObj, player);
  expect(success).toBe(false); // no control token container

  const myContainer: Container = new MockContainer({
    templateMetadata: "container.token.control:base/generic",
    owningPlayerSlot: 3,
  });

  success = controlTokenSystem.addControlToken(systemTileObj, player);
  expect(success).toBe(false); // no control token

  const myToken: GameObject = new MockGameObject({
    templateMetadata: "token.control:base/sol",
    owningPlayerSlot: 3,
  });
  myContainer.insert([myToken]);

  expect(myContainer.getNumItems()).toBe(1);
  success = controlTokenSystem.addControlToken(systemTileObj, player);
  expect(success).toBe(true);
  expect(myContainer.getNumItems()).toBe(1);
});

it("custom action", () => {
  new MockGameObject(); // so an object is in the world
  new ControlTokenSystem().init();

  const systemTileObj: MockGameObject = new MockGameObject({
    templateMetadata: "tile.system:base/18",
    position: [10, 0, 0],
  });
  const player: Player = new MockPlayer({ slot: 3 });

  systemTileObj._customActionAsPlayer(player, "*Add Control Token");
});
