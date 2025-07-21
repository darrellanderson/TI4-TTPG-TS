"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendaState = exports.MAX_OUTCOME_NAME_LENGTH = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const zod_1 = require("zod");
exports.MAX_OUTCOME_NAME_LENGTH = 20;
const AgendaPhase = zod_1.z.enum(["whens", "afters", "voting"]);
const AgendaRiderSchema = zod_1.z.object({
    seat: zod_1.z.number(),
    objId: zod_1.z.string(),
    outcome: zod_1.z.number(),
});
const AgendaSeatStateSchema = zod_1.z.object({
    avail: zod_1.z.number().default(0),
    outcome: zod_1.z.number().default(-1),
    votes: zod_1.z.number().default(0),
    lockVotes: zod_1.z.boolean().default(false),
    noWhens: (0, zod_1.number)().default(0), // 0 = unknown, 1 = no, 2 = never, 3 = play
    noAfters: (0, zod_1.number)().default(0), // 0 = unknown, 1 = no, 2 = never, 3 = play
});
const AgendaStateSchema = zod_1.z.object({
    agendaObjId: zod_1.z.string().default(""),
    outcomeNames: zod_1.z.array(zod_1.z.string().nullable()).default([]),
    phase: AgendaPhase.default("whens"),
    riders: zod_1.z.array(AgendaRiderSchema).default([]),
    seatIndexToState: zod_1.z.array(AgendaSeatStateSchema.nullable()).default([]),
});
class AgendaState {
    static isAgendaInProgress(namespaceId) {
        const data = api_1.world.getSavedData(namespaceId);
        return data !== undefined && data.length > 0;
    }
    constructor(namespaceId) {
        this.onAgendaStateChanged = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this._suppressStateChangeEvents = false;
        this._onTurnStateChangedHandler = () => {
            if (!this._suppressStateChangeEvents) {
                this.onAgendaStateChanged.trigger(this);
            }
        };
        this._onAgendaCardRemovedHandler = () => {
            // If the agenda card is removed, we need to clear the agenda state.
            this.destroy();
        };
        this._namespaceId = namespaceId;
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.add(this._onTurnStateChangedHandler);
        TI4.events.onAgendaCardRemoved.add(this._onAgendaCardRemovedHandler);
        const data = api_1.world.getSavedData(namespaceId);
        if (data !== undefined && data.length > 0) {
            this._data = AgendaStateSchema.parse(JSON.parse(data));
        }
        else {
            this._data = AgendaStateSchema.parse({});
        }
        this._save();
        // Advance turn/phase current "waiting for" player sets no whens or afters.
        // new AdvanceNoWhensAfters(this);
        // CREATE THIS IN THE ONAGENDASTATECREATED EVENT to avoid circular dependency.
        // Report final state when finished.
        // new ReportFinalAgendaState(this);
        // CREATE THIS IN THE ONAGENDASTATECREATED EVENT to avoid circular dependency.
        // Tell any external listeners a new agenda started/resumed.
        TI4.events.onAgendaStateCreated.trigger(this);
    }
    destroy() {
        api_1.world.setSavedData("", this._namespaceId);
        ttpg_darrell_1.TurnOrder.onTurnStateChanged.remove(this._onTurnStateChangedHandler);
        TI4.events.onAgendaCardRemoved.remove(this._onAgendaCardRemovedHandler);
        this.onAgendaStateChanged.trigger(this);
        this.onAgendaStateChanged.clear();
    }
    transactThenTriggerDelayedStateChangedEvent(f) {
        this._suppressStateChangeEvents = true;
        f();
        this._suppressStateChangeEvents = false;
        this.onAgendaStateChanged.trigger(this);
    }
    _save() {
        const json = JSON.stringify(this._data);
        if (json.length < 1024) {
            api_1.world.setSavedData(json, this._namespaceId);
        }
    }
    isActive() {
        return AgendaState.isAgendaInProgress(this._namespaceId);
    }
    getAgendaObjId() {
        return this._data.agendaObjId;
    }
    setAgendaObjId(agendaObjId) {
        this._data.agendaObjId = agendaObjId;
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    getNumOutcomes() {
        return this._data.outcomeNames.length;
    }
    getOutcomeName(index) {
        var _a;
        return (_a = this._data.outcomeNames[index]) !== null && _a !== void 0 ? _a : undefined;
    }
    setOutcomeName(index, name) {
        if (name.length > exports.MAX_OUTCOME_NAME_LENGTH) {
            name = name.substring(0, exports.MAX_OUTCOME_NAME_LENGTH - 3) + "...";
        }
        this._data.outcomeNames[index] = name;
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    getPhase() {
        return this._data.phase;
    }
    setPhase(phase) {
        this._data.phase = phase;
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    _getSeatState(seatIndex) {
        let seatState = this._data.seatIndexToState[seatIndex];
        if (!seatState) {
            seatState = AgendaSeatStateSchema.parse({});
            this._data.seatIndexToState[seatIndex] = seatState;
        }
        return seatState;
    }
    getSeatAvailableVotes(seatIndex) {
        const seatState = this._getSeatState(seatIndex);
        return seatState.avail;
    }
    setSeatAvailableVotes(seatIndex, votes) {
        const seatState = this._getSeatState(seatIndex);
        seatState.avail = votes;
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    getSeatNoAfters(seatIndex) {
        const seatState = this._getSeatState(seatIndex);
        if (seatState.noAfters === 1) {
            return "no";
        }
        else if (seatState.noAfters === 2) {
            return "never";
        }
        else if (seatState.noAfters === 3) {
            return "play";
        }
        else {
            return "unknown";
        }
    }
    setSeatNoAfters(seatIndex, noWhens) {
        const seatState = this._getSeatState(seatIndex);
        if (noWhens === "no") {
            seatState.noAfters = 1;
        }
        else if (noWhens === "never") {
            seatState.noAfters = 2;
        }
        else if (noWhens === "play") {
            seatState.noAfters = 3;
        }
        else {
            seatState.noAfters = 0;
        }
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    getSeatNoWhens(seatIndex) {
        const seatState = this._getSeatState(seatIndex);
        if (seatState.noWhens === 1) {
            return "no";
        }
        else if (seatState.noWhens === 2) {
            return "never";
        }
        else if (seatState.noWhens === 3) {
            return "play";
        }
        else {
            return "unknown";
        }
    }
    setSeatNoWhens(seatIndex, noWhens) {
        const seatState = this._getSeatState(seatIndex);
        if (noWhens === "no") {
            seatState.noWhens = 1;
        }
        else if (noWhens === "never") {
            seatState.noWhens = 2;
        }
        else if (noWhens === "play") {
            seatState.noWhens = 3;
        }
        else {
            seatState.noWhens = 0;
        }
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    getSeatOutcomeChoice(seatIndex) {
        const seatState = this._getSeatState(seatIndex);
        return seatState.outcome;
    }
    setSeatOutcomeChoice(seatIndex, outcome) {
        const seatState = this._getSeatState(seatIndex);
        seatState.outcome = outcome;
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    getSeatVotesForOutcome(seatIndex) {
        const seatState = this._getSeatState(seatIndex);
        return seatState.votes;
    }
    setSeatVotesForOutcome(seatIndex, votes) {
        const seatState = this._getSeatState(seatIndex);
        seatState.votes = votes;
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    getSeatVotesLocked(seatIndex) {
        const seatState = this._getSeatState(seatIndex);
        return seatState.lockVotes;
    }
    setSeatVotesLocked(seatIndex, locked) {
        const seatState = this._getSeatState(seatIndex);
        seatState.lockVotes = locked;
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    getRiders() {
        return this._data.riders;
    }
    addRider(seatIndex, objId, outcome) {
        this.removeRider(objId);
        this._data.riders.push({ seat: seatIndex, objId, outcome });
        this._save();
        if (!this._suppressStateChangeEvents) {
            this.onAgendaStateChanged.trigger(this);
        }
        return this;
    }
    removeRider(objId) {
        const index = this._data.riders.findIndex((rider) => rider.objId === objId);
        if (index >= 0) {
            this._data.riders.splice(index, 1);
            this._save();
            if (!this._suppressStateChangeEvents) {
                this.onAgendaStateChanged.trigger(this);
            }
        }
        return this;
    }
    getWaitingForMessage() {
        const currentPlayerSlot = TI4.turnOrder.getCurrentTurn();
        const currentPlayerName = TI4.playerName.getBySlot(currentPlayerSlot);
        const phase = this.getPhase();
        let action = "";
        let suffix = "";
        if (this.getPhase() === "whens") {
            action = "Any whens";
            suffix = "?";
        }
        else if (phase === "afters") {
            action = "Any afters";
            suffix = "?";
        }
        else if (phase === "voting") {
            action = "Please vote";
        }
        return `${action}, ${currentPlayerName}${suffix}`;
    }
}
exports.AgendaState = AgendaState;
//# sourceMappingURL=agenda-state.js.map