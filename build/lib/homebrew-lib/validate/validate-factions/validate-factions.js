"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateFactions = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
const abstract_validate_1 = require("../abstract-validate/abstract-validate");
class ValidateFactions extends abstract_validate_1.AbstractValidate {
    getCommandName() {
        return "factions";
    }
    getDescription() {
        return "Validate factions";
    }
    getErrors(errors) {
        const registeredLeaderNsids = this.getCardNsids("card.leader");
        const registeredTechNsids = this.getCardNsids("card.technology");
        TI4.factionRegistry.getAllFactions().forEach((faction) => {
            const leaderNsids = this._getLeaderNsids(faction);
            const missingLeaders = this.getSrcMissingFromDst(new Set(leaderNsids), registeredLeaderNsids);
            const techNsids = this._getTechNsids(faction);
            const missingTech = this.getSrcMissingFromDst(new Set(techNsids), registeredTechNsids);
            const otherNsids = this._getOtherNsids(faction);
            const missingOther = otherNsids.filter((nsid) => {
                return !ttpg_darrell_1.Spawn.has(nsid);
            });
            const missing = [
                ...missingLeaders,
                ...missingTech,
                ...missingOther,
            ];
            if (missing.length > 0) {
                errors.push(`${faction.getName()} is missing ${missing.join(", ")}`);
            }
        });
    }
    _getLeaderNsids(faction) {
        return [
            ...faction.getAgentNsids(),
            ...faction.getCommanderNsids(),
            ...faction.getHeroNsids(),
        ];
    }
    _getTechNsids(faction) {
        return faction.getFactionTechNsids();
    }
    _getOtherNsids(faction) {
        const nsids = [
            ...faction.getExtras(),
            faction.getCommandTokenNsid(),
            faction.getControlTokenNsid(),
        ];
        let tileNumber;
        let nsid;
        tileNumber = faction.getHomeSystemTileNumber();
        nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
        if (nsid) {
            nsids.push(nsid);
        }
        tileNumber = faction.getHomeSurrogateTileNumber();
        nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
        if (nsid) {
            nsids.push(nsid);
        }
        return nsids;
    }
}
exports.ValidateFactions = ValidateFactions;
//# sourceMappingURL=validate-factions.js.map