"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalEvents = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * TI4 events.
 *
 * There are a few related events such as TurnOrder.onTurnOrderChanged, etc.
 */
class GlobalEvents {
    constructor() {
        /**
         * Called when an agenda card is snapped to the agenda snap point.
         */
        this.onAgendaCard = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when an agenda card is removed from the agenda snap point.
         */
        this.onAgendaCardRemoved = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when agenda state is created.  Listeners can attach to
         * the AgendaState.onAgendaStateChanged event.
         *
         * @param agendaState state that was created.
         */
        this.onAgendaStateCreated = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this.onAllPlayersPassed = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when a player clicks a combat-initiating button.
         *
         * @param rollType The type of combat roll, e.g. "space-combat".
         * @param planetName Combat on this planet, or undefined if in space.
         * @param player The player who initiated the combat.
         */
        this.onCombatClicked = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when a combat roll is finished.
         *
         * @param combatRoll The combat roll that was rolled (includes player, roll type, etc).
         * @param diceResults The results of the dice roll.
         */
        this.onCombatResult = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Triggered when a player scores the final pooint.
         */
        this.onGameEnd = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called after a player has changed their faction.
         *
         * @param playerSlot The player slot of the player seat that changed.
         */
        this.onFactionChanged = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called after all game data updators finished this cycle.
         */
        this.onGameData = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when an object fall below the table.
         */
        this.onObjectFellThroughTable = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when a player clicks a player color change button.
         */
        this.onPlayerChangeColorRequest = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when a player changes color.  Clicking player might not
         * be the player who changed color.
         */
        this.onPlayerChangedColor = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when a player asks to start a slice draft.
         */
        this.onSliceDraftRequest = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called after start game request finishes, game is ready to start.
         * Used for any extra at-start setup.
         */
        this.onStartGameComplete = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when a player asks to start a game.
         */
        this.onStartGameRequest = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when a player plays a strategy card.
         */
        this.onStrategyCardPlayed = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called when a player activates a system.  Other mechanisms may also
         * activate a system by triggering this event.
         *
         * @param system The system that was activated.
         * @param player The player who activated the system.
         */
        this.onSystemActivated = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Called after a system (or planet therein) change (attachment add/remove).
         *
         * @param system The system that was changed.
         */
        this.onSystemChanged = new ttpg_darrell_1.TriggerableMulticastDelegate();
        /**
         * Show tech chooser to the given player.
         */
        this.onTechChooserRequest = new ttpg_darrell_1.TriggerableMulticastDelegate();
    }
}
exports.GlobalEvents = GlobalEvents;
//# sourceMappingURL=global-events.js.map