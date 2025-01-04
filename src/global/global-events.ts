import { Card, Player } from "@tabletop-playground/api";
import { DiceResult, TriggerableMulticastDelegate } from "ttpg-darrell";

import {
  CombatRollType,
  CombatRoll,
} from "../lib/combat-lib/combat-roll/combat-roll";
import { System } from "../lib/system-lib/system/system";

/**
 * TI4 events.
 *
 * There are a few related events such as TurnOrder.onTurnOrderChanged, etc.
 */
export class GlobalEvents {
  /**
   * Called when an agenda card is snapped to the agenda snap point.
   */
  public readonly onAgendaCard = new TriggerableMulticastDelegate<
    (agendaCard: Card, player: Player) => void
  >();

  /**
   * Called when a player clicks a combat-initiating button.
   *
   * @param rollType The type of combat roll, e.g. "space-combat".
   * @param planetName Combat on this planet, or undefined if in space.
   * @param player The player who initiated the combat.
   */
  public readonly onCombatClicked = new TriggerableMulticastDelegate<
    (
      rollType: CombatRollType,
      planetName: string | undefined,
      player: Player
    ) => void
  >();

  /**
   * Called when a combat roll is finished.
   *
   * @param combatRoll The combat roll that was rolled (includes player, roll type, etc).
   * @param diceResults The results of the dice roll.
   */
  public readonly onCombatResult = new TriggerableMulticastDelegate<
    (combatRoll: CombatRoll, diceResults: Array<DiceResult>) => void
  >();

  /**
   * Called after a player has changed their faction.
   *
   * @param playerSlot The player slot of the player seat that changed.
   */
  public readonly onFactionChanged = new TriggerableMulticastDelegate<
    (playerSlot: number) => void
  >();

  /**
   * Called when a player activates a system.  Other mechanisms may also
   * activate a system by triggering this event.
   *
   * @param system The system that was activated.
   * @param player The player who activated the system.
   */
  public readonly onSystemActivated = new TriggerableMulticastDelegate<
    (system: System, player: Player) => void
  >();

  /**
   * Called after a system (or planet therein) change (attachment add/remove).
   *
   * @param system The system that was changed.
   */
  public readonly onSystemChanged = new TriggerableMulticastDelegate<
    (system: System) => void
  >();
}
