"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftState = exports.DraftStateSchema = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const zod_1 = require("zod");
const SliceShapeSchema = zod_1.z.array(zod_1.z.string()).readonly().default([]);
exports.DraftStateSchema = zod_1.z.object({
    baseMap: zod_1.z.string().default(""), // map string for non-slice systems
    sliceShape: SliceShapeSchema,
    sliceShapeOverrides: zod_1.z.array(SliceShapeSchema.nullable()).default([]),
    slices: zod_1.z.array(zod_1.z.array(zod_1.z.number()).readonly()).readonly().default([]),
    sliceLabels: zod_1.z.array(zod_1.z.string()).default([]),
    factions: zod_1.z.array(zod_1.z.string()).default([]),
    speakerIndex: zod_1.z.number().default(-1),
    sliceIndexToPlayerSlot: zod_1.z.array(zod_1.z.number().nullable()).default([]),
    factionIndexToPlayerSlot: zod_1.z.array(zod_1.z.number().nullable()).default([]),
    seatIndexToPlayerSlot: zod_1.z.array(zod_1.z.number().nullable()).default([]),
});
/**
 * Persistent draft state: player choices.
 */
class DraftState {
    static isDraftInProgress(namespaceId) {
        const data = api_1.world.getSavedData(namespaceId);
        return data !== undefined && data.length > 0;
    }
    constructor(namespaceId) {
        this.onDraftStateChanged = new ttpg_darrell_1.TriggerableMulticastDelegate();
        this._namespaceId = namespaceId;
        const data = api_1.world.getSavedData(namespaceId);
        if (data !== undefined && data.length > 0) {
            this._data = exports.DraftStateSchema.parse(JSON.parse(data));
        }
        else {
            this._data = exports.DraftStateSchema.parse({});
        }
        this._save();
    }
    destroy() {
        api_1.world.setSavedData("", this._namespaceId);
        this.onDraftStateChanged.trigger(this);
        this.onDraftStateChanged.clear();
    }
    _save() {
        const json = JSON.stringify(this._data);
        if (json.length < 1024) {
            api_1.world.setSavedData(json, this._namespaceId);
        }
    }
    isActive() {
        return DraftState.isDraftInProgress(this._namespaceId);
    }
    isComplete() {
        const playerCount = TI4.config.playerCount;
        const chosenSliceCount = [
            ...this._data.sliceIndexToPlayerSlot.values(),
        ].filter((playerSlot) => {
            return playerSlot !== null && playerSlot >= 0;
        }).length;
        if (chosenSliceCount < playerCount) {
            return false;
        }
        const chosenFactionCount = [
            ...this._data.factionIndexToPlayerSlot.values(),
        ].filter((playerSlot) => {
            return playerSlot !== null && playerSlot >= 0;
        }).length;
        if (chosenFactionCount < playerCount) {
            return false;
        }
        const chosenSeatCount = [
            ...this._data.seatIndexToPlayerSlot.values(),
        ].filter((playerSlot) => {
            return playerSlot !== null && playerSlot >= 0;
        }).length;
        if (chosenSeatCount < playerCount) {
            return false;
        }
        return true;
    }
    setBaseMap(baseMap) {
        this._data.baseMap = baseMap;
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    getBaseMap() {
        return this._data.baseMap;
    }
    setSliceShape(sliceShape) {
        this._data.sliceShape = sliceShape;
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    overrideSliceShape(seatIndex, sliceShape) {
        if (sliceShape.length !== this._data.sliceShape.length) {
            throw new Error("Invalid slice shape length");
        }
        this._data.sliceShapeOverrides[seatIndex] = sliceShape;
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    getSliceShape(seatIndex) {
        let sliceShape;
        sliceShape = this._data.sliceShapeOverrides[seatIndex];
        if (!sliceShape) {
            sliceShape = this._data.sliceShape;
        }
        return sliceShape;
    }
    setSlices(slices) {
        this._data.slices = slices;
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    getSlices() {
        return this._data.slices;
    }
    setSliceLabels(sliceLabels) {
        sliceLabels.forEach((label) => {
            if (label.length > 100) {
                throw new Error(`slice label too long (max 100): "${label}"`);
            }
        });
        this._data.sliceLabels = sliceLabels;
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    getSliceLabels() {
        return this._data.sliceLabels;
    }
    setFactions(factions) {
        this._data.factions = factions.map((faction) => faction.getNsid());
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    getFactions() {
        const factions = this._data.factions.map((nsid) => TI4.factionRegistry.getByNsidOrThrow(nsid));
        return factions;
    }
    setSpeakerIndex(speakerIndex) {
        this._data.speakerIndex = speakerIndex;
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    getSpeakerIndex() {
        return this._data.speakerIndex;
    }
    setSliceIndexToPlayerSlot(sliceIndex, playerSlot) {
        this._data.sliceIndexToPlayerSlot[sliceIndex] = playerSlot;
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    getSliceIndexToPlayerSlot(sliceIndex) {
        var _a;
        return (_a = this._data.sliceIndexToPlayerSlot[sliceIndex]) !== null && _a !== void 0 ? _a : -1;
    }
    setFactionIndexToPlayerSlot(factionIndex, playerSlot) {
        this._data.factionIndexToPlayerSlot[factionIndex] = playerSlot;
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    getFactionIndexToPlayerSlot(factionIndex) {
        var _a;
        return (_a = this._data.factionIndexToPlayerSlot[factionIndex]) !== null && _a !== void 0 ? _a : -1;
    }
    /**
     * What faction is assigned to the result seat index?
     *
     * @param seatIndex
     * @returns
     */
    getSeatIndexToFaction(seatIndex) {
        const playerSlot = this.getSeatIndexToPlayerSlot(seatIndex);
        if (playerSlot < 0) {
            return undefined;
        }
        const index = this._data.factionIndexToPlayerSlot.findIndex((factionPlayerSlot) => factionPlayerSlot === playerSlot);
        if (index < 0) {
            return undefined;
        }
        return this.getFactions()[index];
    }
    setSeatIndexToPlayerSlot(seatIndex, playerSlot) {
        this._data.seatIndexToPlayerSlot[seatIndex] = playerSlot;
        this._save();
        this.onDraftStateChanged.trigger(this);
        return this;
    }
    getSeatIndexToPlayerSlot(seatIndex) {
        var _a;
        return (_a = this._data.seatIndexToPlayerSlot[seatIndex]) !== null && _a !== void 0 ? _a : -1;
    }
}
exports.DraftState = DraftState;
//# sourceMappingURL=draft-state.js.map