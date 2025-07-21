"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerWithFactionTechs = void 0;
/**
 * Get all available techs for a player, including faction tech.
 * Faction unit upgrades remove the base version unit upgrades.
 */
class PlayerWithFactionTechs {
    constructor(faction) {
        this._faction = faction;
    }
    get() {
        // Get all techs.
        let techs = this._getAllTechs();
        // Apply remove rules (e.g. codex replacement).
        techs = this._applyRemoveRules(techs);
        // Remove other factions' faction tech.
        techs = this._pruneOtherFactionTechs(techs);
        // Remove overriden unit upgrades.
        techs = this._pruneOverridenUnitUpgrades(techs);
        return techs;
    }
    /**
     * Get all techs, including ALL faction tech.
     */
    _getAllTechs() {
        return TI4.techRegistry.getAllTechs();
    }
    /**
     * Apply remove rules (e.g. codex replacement).
     */
    _applyRemoveRules(techs) {
        const removeByNsidOrSource = TI4.removeRegistry.createRemoveFromRegistryAndConfig();
        return techs.filter((tech) => {
            return !removeByNsidOrSource.shouldRemove(tech.getNsid());
        });
    }
    /**
     * Remove other factions' faction tech.
     *
     * @param techs
     * @returns
     */
    _pruneOtherFactionTechs(techs) {
        const factionTechNsids = new Set();
        if (this._faction) {
            for (const nsid of this._faction.getFactionTechNsids()) {
                factionTechNsids.add(nsid);
            }
        }
        return techs.filter((tech) => {
            return !tech.isFactionTech() || factionTechNsids.has(tech.getNsid());
        });
    }
    _pruneOverridenUnitUpgrades(techs) {
        const removeNsidNames = new Set();
        for (const tech of techs) {
            const replaceNsidName = tech.replacesNsidName();
            if (replaceNsidName) {
                removeNsidNames.add(replaceNsidName);
            }
        }
        return techs.filter((tech) => {
            return !removeNsidNames.has(tech.getNsidName());
        });
    }
}
exports.PlayerWithFactionTechs = PlayerWithFactionTechs;
//# sourceMappingURL=player-with-faction-techs.js.map