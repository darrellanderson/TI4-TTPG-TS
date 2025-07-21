"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomebrewRegistry = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const spawn_missing_cards_1 = require("../spawn-missing-cards/spawn-missing-cards");
/**
 * Homebrew modules register via this class.
 */
class HomebrewRegistry {
    load(params) {
        if (params.factions) {
            TI4.factionRegistry.load(params.sourceAndPackageId, params.factions);
        }
        if (params.systems) {
            TI4.systemRegistry.load(params.sourceAndPackageId, params.systems);
        }
        if (params.planetAttachments) {
            TI4.planetAttachmentRegistry.load(params.sourceAndPackageId, params.planetAttachments);
        }
        if (params.systemAttachments) {
            TI4.systemAttachmentRegistry.load(params.sourceAndPackageId, params.systemAttachments);
        }
        if (params.unitAttrs) {
            TI4.unitAttrsRegistry.load(params.sourceAndPackageId.source, params.unitAttrs);
        }
        if (params.unitModifiers) {
            TI4.unitModifierRegistry.load(params.sourceAndPackageId.source, params.unitModifiers);
        }
        if (params.technologies) {
            TI4.techRegistry.load(params.sourceAndPackageId.source, params.technologies);
        }
        if (params.remove) {
            TI4.removeRegistry.load(params.sourceAndPackageId.source, params.remove);
        }
        if (params.nsidToTemplateId) {
            ttpg_darrell_1.Spawn.inject(params.nsidToTemplateId);
            const spawnMissingCards = new spawn_missing_cards_1.SpawnMissingCards();
            for (const nsid of Object.keys(params.nsidToTemplateId)) {
                if (spawn_missing_cards_1.SpawnMissingCards.shouldSpawnMissingCards(nsid)) {
                    spawnMissingCards.spawnAndAddMissingCards(nsid);
                }
            }
        }
    }
}
exports.HomebrewRegistry = HomebrewRegistry;
//# sourceMappingURL=homebrew-registry.js.map