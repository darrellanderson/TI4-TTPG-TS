import { Card, GameObject, Player } from "@tabletop-playground/api";
import { DiceResult, TriggerableMulticastDelegate } from "ttpg-darrell";
import { AgendaState } from "../lib/agenda-lib/agenda-state/agenda-state";
import { CombatRollType, CombatRoll } from "../lib/combat-lib/combat-roll/combat-roll";
import { DraftActivityStartParams } from "../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { GameData } from "../lib/game-data-lib/game-data/game-data";
import { System } from "../lib/system-lib/system/system";
/**
 * TI4 events.
 *
 * There are a few related events such as TurnOrder.onTurnOrderChanged, etc.
 */
export declare class GlobalEvents {
    /**
     * Called when an agenda card is snapped to the agenda snap point.
     */
    readonly onAgendaCard: TriggerableMulticastDelegate<(agendaCard: Card, player: Player) => void>;
    /**
     * Called when an agenda card is removed from the agenda snap point.
     */
    readonly onAgendaCardRemoved: TriggerableMulticastDelegate<() => void>;
    /**
     * Called when agenda state is created.  Listeners can attach to
     * the AgendaState.onAgendaStateChanged event.
     *
     * @param agendaState state that was created.
     */
    readonly onAgendaStateCreated: TriggerableMulticastDelegate<(agendaState: AgendaState) => void>;
    readonly onAllPlayersPassed: TriggerableMulticastDelegate<() => void>;
    /**
     * Called when a player clicks a combat-initiating button.
     *
     * @param rollType The type of combat roll, e.g. "space-combat".
     * @param planetName Combat on this planet, or undefined if in space.
     * @param player The player who initiated the combat.
     */
    readonly onCombatClicked: TriggerableMulticastDelegate<(rollType: CombatRollType, planetName: string | undefined, player: Player) => void>;
    /**
     * Called when a combat roll is finished.
     *
     * @param combatRoll The combat roll that was rolled (includes player, roll type, etc).
     * @param diceResults The results of the dice roll.
     */
    readonly onCombatResult: TriggerableMulticastDelegate<(combatRoll: CombatRoll, diceResults: Array<DiceResult>) => void>;
    /**
     * Triggered when a player scores the final pooint.
     */
    readonly onGameEnd: TriggerableMulticastDelegate<() => void>;
    /**
     * Called after a player has changed their faction.
     *
     * @param playerSlot The player slot of the player seat that changed.
     */
    readonly onFactionChanged: TriggerableMulticastDelegate<(playerSlot: number) => void>;
    /**
     * Called after all game data updators finished this cycle.
     */
    readonly onGameData: TriggerableMulticastDelegate<(gameData: GameData) => void>;
    /**
     * Called when an object fall below the table.
     */
    readonly onObjectFellThroughTable: TriggerableMulticastDelegate<(object: GameObject) => void>;
    /**
     * Called when a player clicks a player color change button.
     */
    readonly onPlayerChangeColorRequest: TriggerableMulticastDelegate<(playerSlot: number, clickingPlayer: Player) => void>;
    /**
     * Called when a player changes color.  Clicking player might not
     * be the player who changed color.
     */
    readonly onPlayerChangedColor: TriggerableMulticastDelegate<(playerSlot: number, colorName: string, colorHex: string, clickingPlayer: Player) => void>;
    /**
     * Called when a player asks to start a slice draft.
     */
    readonly onSliceDraftRequest: TriggerableMulticastDelegate<(draftActivityStartParams: DraftActivityStartParams) => void>;
    /**
     * Called after start game request finishes, game is ready to start.
     * Used for any extra at-start setup.
     */
    readonly onStartGameComplete: TriggerableMulticastDelegate<() => void>;
    /**
     * Called when a player asks to start a game.
     */
    readonly onStartGameRequest: TriggerableMulticastDelegate<() => void>;
    /**
     * Called when a player plays a strategy card.
     */
    readonly onStrategyCardPlayed: TriggerableMulticastDelegate<(strategyCard: GameObject, player: Player) => void>;
    /**
     * Called when a player activates a system.  Other mechanisms may also
     * activate a system by triggering this event.
     *
     * @param system The system that was activated.
     * @param player The player who activated the system.
     */
    readonly onSystemActivated: TriggerableMulticastDelegate<(system: System, player: Player) => void>;
    /**
     * Called after a system (or planet therein) change (attachment add/remove).
     *
     * @param system The system that was changed.
     */
    readonly onSystemChanged: TriggerableMulticastDelegate<(system: System) => void>;
    /**
     * Show tech chooser to the given player.
     */
    readonly onTechChooserRequest: TriggerableMulticastDelegate<(playerSlot: number) => void>;
}
