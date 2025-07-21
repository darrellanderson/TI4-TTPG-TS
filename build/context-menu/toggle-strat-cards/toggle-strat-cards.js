"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleStratCards = void 0;
const api_1 = require("@tabletop-playground/api");
const strategy_cards_state_1 = require("../../lib/strategy-card-lib/strategy-cards-state/strategy-cards-state");
const abstract_window_1 = require("../../ui/abstract-window/abstract-window");
const strategy_cards_ui_1 = require("../../ui/strategy-card-ui/strategy-cards-ui/strategy-cards-ui");
/**
 *  Manage window with active strategy cards.
 */
class ToggleStratCards {
    _closeWindow(playerSlot) {
        const perPlayerWindowData = this._playerSlotToWindowData.get(playerSlot);
        if (perPlayerWindowData) {
            perPlayerWindowData.window.destroy();
            this._playerSlotToWindowData.delete(playerSlot);
        }
    }
    _openWindow(playerSlot) {
        let perPlayerWindowData = this._playerSlotToWindowData.get(playerSlot);
        if (!perPlayerWindowData) {
            const window = this._createWindow(playerSlot).attach();
            window.onAllClosed.add(() => {
                this._playerSlotToWindowData.delete(playerSlot);
            });
            const key = this._strategyCardsState
                .active(playerSlot)
                .map((s) => s.number)
                .join(",");
            perPlayerWindowData = {
                activeStrategyCardsKey: key,
                window,
            };
            this._playerSlotToWindowData.set(playerSlot, perPlayerWindowData);
        }
    }
    _updateWindow(playerSlot) {
        const perPlayerWindowData = this._playerSlotToWindowData.get(playerSlot);
        const key = this._strategyCardsState
            .active(playerSlot)
            .map((s) => s.number)
            .join(",");
        if (perPlayerWindowData &&
            perPlayerWindowData.activeStrategyCardsKey !== key) {
            this._closeWindow(playerSlot);
            this._openWindow(playerSlot);
        }
    }
    constructor() {
        this._playerSlotToWindowData = new Map();
        /**
         * Cannot use the normal "toggle window" handler because there's a
         * different window for each player.
         */
        this._onCustomActionHandler = (player, identifier) => {
            if (identifier === ToggleStratCards.TOGGLE_ACTION_NAME) {
                const playerSlot = player.getSlot();
                const perPlayerWindowData = this._playerSlotToWindowData.get(playerSlot);
                if (perPlayerWindowData) {
                    this._closeWindow(playerSlot);
                }
                else {
                    this._openWindow(playerSlot);
                }
            }
        };
        this._onStrategyCardsStateChangedHandler = () => {
            // For each player:
            // - show window if active strategy cards.
            // - hide window if no active strategy cards.
            // - recreate window if active strategy cards changed.
            for (const playerSeat of TI4.playerSeats.getAllSeats()) {
                const playerSlot = playerSeat.playerSlot;
                const active = this._strategyCardsState.active(playerSlot);
                const isActive = active.length > 0;
                const key = active.map((s) => s.number).join(",");
                const perPlayerWindowData = this._playerSlotToWindowData.get(playerSlot);
                if (perPlayerWindowData && !isActive) {
                    // Close window if no active strategy cards.
                    this._closeWindow(playerSlot);
                }
                else if (!perPlayerWindowData && isActive) {
                    // Create window if missing and active strategy cards.
                    this._openWindow(playerSlot);
                }
                else if (perPlayerWindowData &&
                    perPlayerWindowData.activeStrategyCardsKey !== key) {
                    // Recreate window if active strategy cards changed.
                    this._updateWindow(playerSlot);
                }
            }
        };
        this._strategyCardsState = new strategy_cards_state_1.StrategyCardsState("@strategy-cards/ti4");
    }
    init() {
        this._strategyCardsState.onStrategyCardsStateChanged.add(this._onStrategyCardsStateChangedHandler);
        api_1.globalEvents.onCustomAction.add(this._onCustomActionHandler);
        api_1.world.addCustomAction(ToggleStratCards.TOGGLE_ACTION_NAME, TI4.locale("tooltip.toggle-strat-cards"));
    }
    getStrategyCardsState() {
        return this._strategyCardsState;
    }
    _createWindow(playerSlot) {
        const createAbstractUI = (params) => {
            return new strategy_cards_ui_1.StrategyCardsUI(params.scale, this._strategyCardsState, playerSlot);
        };
        const namespaceId = `@window/strat-cards-${playerSlot}`;
        const windowTitle = "Strat Cards";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, namespaceId, windowTitle);
        const playerSlots = [playerSlot];
        return abstractWindow.createWindow(playerSlots);
    }
}
exports.ToggleStratCards = ToggleStratCards;
ToggleStratCards.TOGGLE_ACTION_NAME = "*Toggle Strat Cards";
//# sourceMappingURL=toggle-strat-cards.js.map