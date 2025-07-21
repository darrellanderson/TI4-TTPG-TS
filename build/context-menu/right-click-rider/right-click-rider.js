"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightClickRider = exports.ACTION_CLEAR_PREDICT = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const report_final_agenda_state_1 = require("../../lib/agenda-lib/agenda-state/report-final-agenda-state");
const ACTION_PREFIX_PREDICT = "*Predict ";
exports.ACTION_CLEAR_PREDICT = "*Clear Prediction";
/**
 * Add "predict {agenda outcome}", "clear agenda outcome" options to riders.
 * Updates when agenda state changes.
 */
class RightClickRider {
    constructor() {
        this._riderObjIds = new Set();
        this._agendaState = undefined;
        // Outcome names in outcome order.
        this._outcomeNames = [];
        this._outcomeNamesJoined = "";
        /**
         * Attached to riders, update agenda state with rider->outcome link.
         *
         * @param obj
         * @param player
         * @param identifier
         * @returns
         */
        this._onCustomActionHanlder = (obj, player, identifier) => {
            const playerSlot = player.getSlot();
            const seatIndex = TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
            const outcomeIndex = this._outcomeNames.indexOf(identifier);
            if (this._agendaState && seatIndex >= 0 && outcomeIndex >= 0) {
                this._agendaState.addRider(seatIndex, obj.getId(), outcomeIndex);
            }
            if (this._agendaState && identifier === exports.ACTION_CLEAR_PREDICT) {
                this._agendaState.removeRider(obj.getId());
            }
        };
    }
    static isRider(obj) {
        const nsidExtras = ttpg_darrell_1.NSID.getExtras(obj);
        return nsidExtras.includes("rider");
    }
    static _getOutcomeNames(agendaState) {
        const outcomeNames = [];
        for (let i = 0; i < agendaState.getNumOutcomes(); i++) {
            const outcomeName = agendaState.getOutcomeName(i);
            if (outcomeName) {
                outcomeNames.push(outcomeName);
            }
        }
        return outcomeNames;
    }
    init() {
        api_1.globalEvents.onObjectCreated.add((obj) => {
            this._maybeAddGameObject(obj);
        });
        api_1.globalEvents.onObjectDestroyed.add((obj) => {
            this._maybeRemoveGameObject(obj);
        });
        TI4.events.onAgendaStateCreated.add((agendaState) => {
            this._agendaState = agendaState;
            agendaState.onAgendaStateChanged.add((_agendaState) => {
                this._onAgendaStateChange(agendaState);
            });
        });
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardCreated.add((obj) => {
            this._maybeAddGameObject(obj);
        });
        ttpg_darrell_1.OnCardBecameSingletonOrDeck.onSingletonCardMadeDeck.add((obj) => {
            this._maybeRemoveGameObject(obj);
        });
        const skipContained = false;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            this._maybeAddGameObject(obj);
        }
    }
    _maybeAddGameObject(obj) {
        if (RightClickRider.isRider(obj)) {
            this._riderObjIds.add(obj.getId());
            obj.onCustomAction.remove(this._onCustomActionHanlder);
            obj.onCustomAction.add(this._onCustomActionHanlder);
        }
    }
    _maybeRemoveGameObject(obj) {
        const id = obj.getId();
        if (this._riderObjIds.has(id)) {
            this._riderObjIds.delete(id);
        }
    }
    _onAgendaStateChange(agendaState) {
        const newOutcomeNames = RightClickRider._getOutcomeNames(agendaState);
        const newOutcomeNamesJoined = newOutcomeNames.join(",");
        if (newOutcomeNamesJoined !== this._outcomeNamesJoined) {
            this._removeActions(); // remove old actions
            this._outcomeNamesJoined = newOutcomeNamesJoined;
            this._outcomeNames = newOutcomeNames;
            this._addActions();
        }
        if (report_final_agenda_state_1.ReportFinalAgendaState.isComplete(agendaState)) {
            this._removeActions();
        }
    }
    _removeActions() {
        for (const objId of this._riderObjIds) {
            const obj = api_1.world.getObjectById(objId);
            if (obj) {
                for (const outcomeName of this._outcomeNames) {
                    obj.removeCustomAction(outcomeName); // identifier
                }
                obj.removeCustomAction(exports.ACTION_CLEAR_PREDICT);
            }
        }
    }
    _addActions() {
        for (const objId of this._riderObjIds) {
            const obj = api_1.world.getObjectById(objId);
            if (obj) {
                for (const outcomeName of this._outcomeNames) {
                    const actionName = ACTION_PREFIX_PREDICT + outcomeName;
                    const tooltip = undefined;
                    obj.addCustomAction(actionName, tooltip, outcomeName);
                }
                obj.addCustomAction(exports.ACTION_CLEAR_PREDICT);
            }
        }
    }
}
exports.RightClickRider = RightClickRider;
//# sourceMappingURL=right-click-rider.js.map