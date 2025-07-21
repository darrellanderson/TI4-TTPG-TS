"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveConflictsKeleres = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
/**
 * If Keleres AND at least one of their flavors are in the same draft, swap
 * Keleres to a different flavor if the current Keleres flavor's linked
 * faction is chosen by a different player.
 */
class ResolveConflictsKeleres {
    /**
     * Get all Keleres flavors, not just any in the draft.
     *
     * @returns
     */
    static getAllKeleresFlavors() {
        const nsids = [
            "faction:codex.vigil/keleres-argent",
            "faction:codex.vigil/keleres-mentak",
            "faction:codex.vigil/keleres-xxcha",
        ];
        return nsids.map((nsid) => {
            return TI4.factionRegistry.getByNsidOrThrow(nsid);
        });
    }
    /**
     * Get all linked-to-Keleres factions, not just any in the draft.
     *
     * @returns
     */
    static getAllLinkedFactions() {
        return ResolveConflictsKeleres.getAllKeleresFlavors().map((flavor) => ResolveConflictsKeleres.getLinkedFactionOrThrow(flavor));
    }
    /**
     * Find Keleres in the draft's factions, -1 if missing.
     *
     * @param draftState
     * @returns
     */
    static getKeleresIndex(draftState) {
        return draftState.getFactions().findIndex((faction) => {
            return faction.getNsid().startsWith("faction:codex.vigil/keleres");
        });
    }
    /**
     * Given a Keleres flavor, get the linked non-Keleres faction.
     *
     * @param keleresFaction
     * @returns
     */
    static getLinkedFactionOrThrow(keleresFaction) {
        const m = keleresFaction
            .getNsid()
            .match(/keleres-(\w+)/);
        const nsidName = m === null || m === void 0 ? void 0 : m[1];
        if (!nsidName) {
            throw new Error("not a keleres faction");
        }
        return TI4.factionRegistry.getByNsidNameOrThrow(nsidName);
    }
    static getAvailableFlavors(draftState) {
        const keleresFlavors = ResolveConflictsKeleres.getAllKeleresFlavors();
        const linkedFactions = ResolveConflictsKeleres.getAllLinkedFactions();
        // Which linked factions already chosen?
        const chosenLinkedFactions = [];
        draftState.getFactions().forEach((faction, index) => {
            const isLinked = linkedFactions.includes(faction);
            const isSelected = draftState.getFactionIndexToPlayerSlot(index) !== -1;
            if (isLinked && isSelected) {
                chosenLinkedFactions.push(faction);
            }
        });
        // Which flavors are available?
        const availableFlavors = [];
        keleresFlavors.forEach((keleresFlavor) => {
            const linkedFaction = ResolveConflictsKeleres.getLinkedFactionOrThrow(keleresFlavor);
            if (!chosenLinkedFactions.includes(linkedFaction)) {
                availableFlavors.push(keleresFlavor);
            }
        });
        return availableFlavors;
    }
    constructor(draftState) {
        this._draftState = draftState;
    }
    resolve() {
        const linkedFactions = ResolveConflictsKeleres.getAllLinkedFactions();
        // Which linked factions already chosen?
        const chosenLinkedFactions = [];
        this._draftState
            .getFactions()
            .forEach((faction, index) => {
            const isLinked = linkedFactions.includes(faction);
            const isSelected = this._draftState.getFactionIndexToPlayerSlot(index) !== -1;
            if (isLinked && isSelected) {
                chosenLinkedFactions.push(faction);
            }
        });
        // Which flavors are available?
        const availableFlavors = ResolveConflictsKeleres.getAvailableFlavors(this._draftState);
        // If the current flavor is no longer available, switch to another.
        const keleresIndex = ResolveConflictsKeleres.getKeleresIndex(this._draftState);
        const keleresFaction = this._draftState.getFactions()[keleresIndex];
        if (keleresFaction && !availableFlavors.includes(keleresFaction)) {
            const newFlavor = new ttpg_darrell_1.Shuffle().choiceOrThrow([
                ...availableFlavors,
            ]);
            const factions = this._draftState.getFactions();
            factions[keleresIndex] = newFlavor;
            this._draftState.setFactions(factions); // triggers another update
        }
    }
}
exports.ResolveConflictsKeleres = ResolveConflictsKeleres;
//# sourceMappingURL=resolve-conflicts-keleres.js.map