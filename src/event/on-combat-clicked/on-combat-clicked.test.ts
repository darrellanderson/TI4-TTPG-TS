import { Player } from "@tabletop-playground/api";
import { MockCardHolder, MockGameObject, MockPlayer } from "ttpg-mock";

import { OnCombatClicked } from "./on-combat-clicked";
import { System } from "../../lib/system-lib/system/system";

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }
});

it("init/destroy", () => {
  const onCombatClicked = new OnCombatClicked();
  onCombatClicked.init();
  onCombatClicked.destroy();
});

it("linked event", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-10, 10, 0],
  });

  // Activate a system.
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(1);
  if (!system) {
    throw new Error("system is undefined");
  }
  const player: Player = new MockPlayer({ slot: 10 });
  TI4.events.onSystemActivated.trigger(system, player);

  // Listen for combat results.
  let combatResultCount: number = 0;
  TI4.events.onCombatResult.add(() => {
    combatResultCount++;
  });
  expect(combatResultCount).toBe(0);

  TI4.events.onCombatClicked.trigger("groundCombat", "Mecatol Rex", player);
  expect(combatResultCount).toBe(1);
});
