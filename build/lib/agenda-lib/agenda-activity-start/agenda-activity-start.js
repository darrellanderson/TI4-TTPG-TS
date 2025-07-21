"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaActivityStart = exports.AgendaActivityMaybeResume = void 0;
const agenda_state_1 = require("../agenda-state/agenda-state");
const agenda_turn_order_1 = require("../agenda-turn-order/agenda-turn-order");
const agenda_state_ui_1 = require("../../../ui/agenda-ui/agenda-state-ui/agenda-state-ui");
const abstract_window_1 = require("../../../ui/abstract-window/abstract-window");
const AGENDA_STATE_NAMESPACE_ID = "@ti4/agenda-state";
const AGENDA_WINDOW_NAMESPACE_ID = "@ti4/agenda-window";
class AgendaActivityMaybeResume {
    init() {
        process.nextTick(() => {
            if (agenda_state_1.AgendaState.isAgendaInProgress(AGENDA_STATE_NAMESPACE_ID)) {
                new AgendaActivityStart().resume();
            }
        });
    }
}
exports.AgendaActivityMaybeResume = AgendaActivityMaybeResume;
class AgendaActivityStart {
    constructor() {
        this._agendaWindow = undefined;
        this._onAgendaStateChangedHandler = () => {
            if (this._agendaState &&
                !this._agendaState.isActive() &&
                this._agendaWindow) {
                this._agendaState.onAgendaStateChanged.remove(this._onAgendaStateChangedHandler);
                this._agendaWindow.detach();
            }
        };
    }
    start(agendaCard) {
        this._agendaState = new agenda_state_1.AgendaState(AGENDA_STATE_NAMESPACE_ID).setAgendaObjId(agendaCard.getId());
        // Set turn order.
        const order = new agenda_turn_order_1.AgendaTurnOrder().getWhensOrAftersOrder();
        const first = order[0];
        if (first !== undefined) {
            TI4.turnOrder.setTurnOrder(order, "forward", first);
        }
        this.resume();
        return true;
    }
    resume() {
        const agendaState = new agenda_state_1.AgendaState(AGENDA_STATE_NAMESPACE_ID);
        this._agendaState = agendaState;
        this._agendaState.onAgendaStateChanged.add(this._onAgendaStateChangedHandler);
        // Create UI, window.
        const createAbstractUI = (params) => {
            const seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(params.playerSlot);
            return new agenda_state_ui_1.AgendaStateUI(agendaState, seatIndex, params.scale);
        };
        const windowTitle = "Agenda";
        const abstractWindow = new abstract_window_1.AbstractWindow(createAbstractUI, AGENDA_WINDOW_NAMESPACE_ID, windowTitle);
        abstractWindow.getMutableWindowParams().disableClose = true;
        this._agendaWindow = abstractWindow.addHost().createWindow().attach();
        return this;
    }
    destroy() {
        if (this._agendaState) {
            this._agendaState.onAgendaStateChanged.remove(this._onAgendaStateChangedHandler);
            this._agendaState.destroy();
            this._agendaState = undefined;
        }
    }
}
exports.AgendaActivityStart = AgendaActivityStart;
//# sourceMappingURL=agenda-activity-start.js.map