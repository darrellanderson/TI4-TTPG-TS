import { Player } from "@tabletop-playground/api";
import { MockGameObject, MockPlayer } from "ttpg-mock";

import { CombatUIHex } from "./combat-ui-hex";
import { System } from "../../../lib/system-lib/system/system";

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

it("constructor/destroy", () => {
  new CombatUIHex(1).destroy();
});

it("_onSystemActivatedHandler", () => {
  new CombatUIHex(1);

  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(19);
  if (!system) {
    throw new Error("system is undefined");
  }
  const player: Player = new MockPlayer();
  TI4.events.onSystemActivated.trigger(system, player);
});

it("update", () => {
  const combatUiHex: CombatUIHex = new CombatUIHex(1);
  combatUiHex.update();
  combatUiHex.update(); // again
});
