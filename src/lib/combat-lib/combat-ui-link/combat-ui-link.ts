import { Player, Vector, world } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";

import {
  CombatRoll,
  CombatRollParams,
  CombatRollType,
} from "../combat-roll/combat-roll";
import { OnSystemActivated } from "../../../event/on-system-activated/on-system-activated";
import { System } from "../../system-lib/system/system";

/**
 * Listen for combat UI clicks, turn into combat rolls.
 */
export class CombatUILink {
  private readonly _onCombatClickedHandler = (
    rollType: CombatRollType,
    planetName: string | undefined,
    player: Player
  ): void => {
    const system: System | undefined =
      OnSystemActivated.getLastActivatedSystem();
    const activatingPlayerSlot: number | undefined =
      OnSystemActivated.getLastActivatingPlayerSlot();
    const rollingPlayerSlot: number = player.getSlot();

    if (system && activatingPlayerSlot !== undefined) {
      const pos: Vector = system.getObj().getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);

      const params: CombatRollParams = {
        rollType,
        hex,
        planetName,
        activatingPlayerSlot,
        rollingPlayerSlot,
      };

      const z: number = world.getTableHeight() + 10;
      const rollPos: Vector = new Vector(0, 0, z);
      const combatRoll: CombatRoll = CombatRoll.createCooked(params);
      combatRoll.roll(player, rollPos);
    }
  };

  constructor() {
    TI4.events.onCombatClicked.add(this._onCombatClickedHandler);
  }

  destroy(): void {
    TI4.events.onCombatClicked.remove(this._onCombatClickedHandler);
  }
}
