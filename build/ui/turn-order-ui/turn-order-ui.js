"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurnOrderUI = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const turn_order_entry_1 = require("./turn-order-entry");
const CUSTOM_ACTION_CHANGE_COLOR = "Change color";
class TurnOrderUI {
    constructor() {
        this._params = {
            entryWidth: 220,
            entryHeight: 58,
            nameBox: {
                width: 130,
                height: 30,
                left: 45,
                top: 0,
            },
            reserveSlots: 8,
            toggleEliminated: true,
            togglePassed: true,
            wartGenerators: [
                (turnEntryWidget) => {
                    return new turn_order_entry_1.TurnOrderEntry(turnEntryWidget);
                },
            ],
            customActions: [
                {
                    name: CUSTOM_ACTION_CHANGE_COLOR,
                },
            ],
            onCustomAction: (clickingPlayer, identifier, targetPlayerSlot) => {
                if (identifier === CUSTOM_ACTION_CHANGE_COLOR) {
                    TI4.events.onPlayerChangeColorRequest.trigger(targetPlayerSlot, clickingPlayer);
                }
            },
        };
        this._onPlayerChangedColorHandler = () => {
            if (this._turnOrderWidget) {
                this._turnOrderWidget.update();
            }
        };
        TI4.events.onPlayerChangedColor.add(this._onPlayerChangedColorHandler);
    }
    getParams() {
        return this._params;
    }
    setPlayerCount(playerCount) {
        this._params.reserveSlots = playerCount;
        return this;
    }
    attachToScreen() {
        if (this._turnOrderWidget) {
            this.destroy();
        }
        const turnOrder = TI4.turnOrder;
        this._turnOrderWidget = new ttpg_darrell_1.TurnOrderWidget(turnOrder, this._params).attachToScreen();
        return this;
    }
    destroy() {
        if (this._turnOrderWidget) {
            this._turnOrderWidget.destroy();
            this._turnOrderWidget = undefined;
        }
        TI4.events.onPlayerChangedColor.remove(this._onPlayerChangedColorHandler);
    }
}
exports.TurnOrderUI = TurnOrderUI;
//# sourceMappingURL=turn-order-ui.js.map