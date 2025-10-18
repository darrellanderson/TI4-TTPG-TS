import { MockCardHolder, MockGameObject, MockPlayer } from "ttpg-mock";
import { ControlTokenSystem } from "./control-token-system";
import { Player } from "@tabletop-playground/api";
import { Faction } from "../../../lib/faction-lib/faction/faction";

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
  const player: Player = new MockPlayer({ slot: 10 });

  success = controlTokenSystem.addControlToken(systemTileObj, player);
  expect(success).toBe(false); // no control token container

  success = controlTokenSystem.addControlToken(systemTileObj, player);
  expect(success).toBe(false); // no control token

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  }); // so player is valid
  MockGameObject.simple("sheet.faction:base/arborec");
  const faction: Faction | undefined = TI4.factionRegistry.getByPlayerSlot(10);
  expect(faction).toBeDefined();

  success = controlTokenSystem.addControlToken(systemTileObj, player);
  expect(success).toBe(true);
});

it("custom action", () => {
  new MockGameObject(); // so an object is in the world
  new ControlTokenSystem().init();

  const systemTileObj: MockGameObject = new MockGameObject({
    templateMetadata: "tile.system:base/18",
    position: [10, 0, 0],
  });
  const player: Player = new MockPlayer({ slot: 10 });

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  }); // so player is valid
  MockGameObject.simple("sheet.faction:base/arborec");
  const faction: Faction | undefined = TI4.factionRegistry.getByPlayerSlot(10);
  expect(faction).toBeDefined();

  systemTileObj._customActionAsPlayer(player, "*Add Control Token");
});
