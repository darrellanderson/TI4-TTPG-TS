import { Player, Vector, world } from "@tabletop-playground/api";
import { HexType, IGlobal } from "ttpg-darrell";
import {
  CombatRollType,
  CombatRollParams,
  CombatRoll,
} from "../../lib/combat-lib/combat-roll/combat-roll";
import { OnSystemActivated } from "../on-system-activated/on-system-activated";
import { System } from "../../lib/system-lib/system/system";

/**
 * Listen for combat UI clicks, turn into combat rolls.
 */
export class OnCombatClicked implements IGlobal {
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

      // Choose a roll position based on the rolling player.
      let rollPos: Vector = new Vector(0, 0, 0);
      for (const seat of TI4.playerSeats.getAllSeats()) {
        if (seat.playerSlot === rollingPlayerSlot) {
          rollPos = seat.cardHolder.getPosition();
          rollPos.x *= 0.75; // move toward center
          break;
        }
      }
      rollPos.z = world.getTableHeight() + 10;

      const combatRoll: CombatRoll = CombatRoll.createCooked(params);
      combatRoll.roll(player, rollPos);
    }
  };

  init() {
    TI4.events.onCombatClicked.add(this._onCombatClickedHandler);
  }

  destroy(): void {
    TI4.events.onCombatClicked.remove(this._onCombatClickedHandler);
  }
}
