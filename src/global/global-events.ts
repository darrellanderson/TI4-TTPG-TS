import { Player } from "@tabletop-playground/api";
import { DiceResult, TriggerableMulticastDelegate } from "ttpg-darrell";

import {
  CombatRollType,
  CombatRoll,
} from "lib/combat-lib/combat-roll/combat-roll";
import { System } from "lib/system-lib/system/system";

export class GlobalEvents {
  public readonly onCombatClicked = new TriggerableMulticastDelegate<
    (
      rollType: CombatRollType,
      planetName: string | undefined,
      player: Player
    ) => void
  >();
  public readonly onCombatResult = new TriggerableMulticastDelegate<
    (
      combatRoll: CombatRoll,
      diceResults: Array<DiceResult>,
      player: Player
    ) => void
  >();
  public readonly onFactionChanged = new TriggerableMulticastDelegate<
    (playerSlot: number, player: Player) => void
  >();
  public readonly onSystemActivated = new TriggerableMulticastDelegate<
    (system: System, player: Player) => void
  >();
  public readonly onSystemChanged = new TriggerableMulticastDelegate<
    (system: System) => void
  >();
}
