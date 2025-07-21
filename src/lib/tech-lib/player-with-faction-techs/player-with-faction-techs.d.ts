import { Faction } from "../../faction-lib/faction/faction";
import { Tech } from "../tech/tech";
/**
 * Get all available techs for a player, including faction tech.
 * Faction unit upgrades remove the base version unit upgrades.
 */
export declare class PlayerWithFactionTechs {
    private readonly _faction;
    constructor(faction: Faction | undefined);
    get(): Array<Tech>;
    /**
     * Get all techs, including ALL faction tech.
     */
    _getAllTechs(): Array<Tech>;
    /**
     * Apply remove rules (e.g. codex replacement).
     */
    _applyRemoveRules(techs: Array<Tech>): Array<Tech>;
    /**
     * Remove other factions' faction tech.
     *
     * @param techs
     * @returns
     */
    _pruneOtherFactionTechs(techs: Array<Tech>): Array<Tech>;
    _pruneOverridenUnitUpgrades(techs: Array<Tech>): Array<Tech>;
}
