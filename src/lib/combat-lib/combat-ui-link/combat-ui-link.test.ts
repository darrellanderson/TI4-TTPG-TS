import { Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";

import { CombatUILink } from "./combat-ui-link";
import { System } from "../../system-lib/system/system";

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

it("linked event", () => {
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(1);
  if (!system) {
    throw new Error("system is undefined");
  }
  const player: Player = new MockPlayer();
  TI4.events.onSystemActivated.trigger(system, player);

  const combatUILink = new CombatUILink();

  TI4.events.onCombatClicked.trigger("groundCombat", "Mecatol Rex", player);

  combatUILink.destroy();
});
