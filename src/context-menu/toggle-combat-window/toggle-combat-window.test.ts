import { Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";
import { ToggleCombatWindow } from "./toggle-combat-window";
import { System } from "../../lib/system-lib/system/system";

it("constructor/init/event", () => {
  const toggleCombatWindow = new ToggleCombatWindow();
  toggleCombatWindow.init();
});

it("event", () => {
  const toggleCombatWindow = new ToggleCombatWindow();
  toggleCombatWindow.init();

  MockGameObject.simple("tile.system:base/18");
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(18);
  if (!system) {
    throw new Error("System not found");
  }

  // Add a different player's unit.
  MockGameObject.simple("unit:base/fighter", { owningPlayerSlot: 11 });

  const player: Player = new MockPlayer({ slot: 10 });
  TI4.events.onSystemActivated.trigger(system, player);
  TI4.events.onSystemActivated.trigger(system, player); // repeat to close old
});
