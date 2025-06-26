import { Faction } from "../../faction-lib/faction/faction";
import { DraftState } from "../draft-state/draft-state";
/**
 * If Keleres AND at least one of their flavors are in the same draft, swap
 * Keleres to a different flavor if the current Keleres flavor's linked
 * faction is chosen by a different player.
 */
export declare class ResolveConflictsKeleres {
    private readonly _draftState;
    /**
     * Get all Keleres flavors, not just any in the draft.
     *
     * @returns
     */
    static getAllKeleresFlavors(): ReadonlyArray<Faction>;
    /**
     * Get all linked-to-Keleres factions, not just any in the draft.
     *
     * @returns
     */
    static getAllLinkedFactions(): ReadonlyArray<Faction>;
    /**
     * Find Keleres in the draft's factions, -1 if missing.
     *
     * @param draftState
     * @returns
     */
    static getKeleresIndex(draftState: DraftState): number;
    /**
     * Given a Keleres flavor, get the linked non-Keleres faction.
     *
     * @param keleresFaction
     * @returns
     */
    static getLinkedFactionOrThrow(keleresFaction: Faction): Faction;
    static getAvailableFlavors(draftState: DraftState): ReadonlyArray<Faction>;
    constructor(draftState: DraftState);
    resolve(): void;
}
