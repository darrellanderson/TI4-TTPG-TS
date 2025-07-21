"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faction = void 0;
const ttpg_darrell_1 = require("ttpg-darrell");
class Faction {
    constructor(sourceAndPackageId, params) {
        this._find = new ttpg_darrell_1.Find();
        this._injectedExtras = new Map();
        this._sourceAndPackageId = sourceAndPackageId;
        this._params = params;
    }
    getAbbr() {
        return this._params.abbr;
    }
    getAbilityNsids() {
        const source = this._sourceAndPackageId.source;
        return this._params.abilities.map((ability) => {
            return `faction-ability:${source}/${ability}`;
        });
    }
    getAgentNsids() {
        let source = this._sourceAndPackageId.source;
        if (source === "base") {
            source = "pok"; // aliance got added in PoK
        }
        return this._params.leaders.agents.map((agent) => {
            return TI4.factionRegistry.rewriteNsid(`card.leader.agent:${source}/${agent}`);
        });
    }
    /**
     * Caution, there may be '.omega' version!
     * @returns
     */
    getAllianceNsids() {
        let source = this._sourceAndPackageId.source;
        if (source === "base") {
            source = "pok"; // aliance got added in PoK
        }
        const nsid = `card.alliance:${source}/${this._params.nsidName}`;
        const result = [nsid];
        const before = `${nsid}.omega`;
        const after = TI4.factionRegistry.rewriteNsid(before);
        if (before !== after) {
            result.push(after);
        }
        return result;
    }
    getCommanderNsids() {
        let source = this._sourceAndPackageId.source;
        if (source === "base") {
            source = "pok"; // aliance got added in PoK
        }
        return this._params.leaders.commanders.map((commander) => {
            return TI4.factionRegistry.rewriteNsid(`card.leader.commander:${source}/${commander}`);
        });
    }
    getCommandTokenNsid() {
        const source = this._sourceAndPackageId.source;
        return `token.command:${source}/${this._params.nsidName}`;
    }
    getCommodities() {
        return this._params.commodities;
    }
    getControlTokenNsid() {
        const source = this._sourceAndPackageId.source;
        return `token.control:${source}/${this._params.nsidName}`;
    }
    getExtraCount(nsid) {
        var _a;
        let result = this._injectedExtras.get(nsid) || 0;
        if (this._params.extras) {
            for (const extra of this._params.extras) {
                if (extra.nsid === nsid) {
                    result = (_a = extra.count) !== null && _a !== void 0 ? _a : 1;
                    break;
                }
            }
        }
        return result;
    }
    getExtras() {
        let result = [];
        if (this._params.extras) {
            result = this._params.extras.map((extra) => extra.nsid);
        }
        for (const injectedExtra of this._injectedExtras.keys()) {
            result.push(injectedExtra);
        }
        return result;
    }
    getFactionSheetNsid() {
        const source = this._sourceAndPackageId.source;
        return `sheet.faction:${source}/${this._params.nsidName}`;
    }
    getFactionTechNsids() {
        const result = [];
        for (const factionTech of this._params.factionTechs) {
            const techs = TI4.techRegistry.getByNsidNameMaybeOmegaToo(factionTech);
            const nsids = techs.map((tech) => tech.getNsid());
            result.push(...nsids);
            // If not found, add a bogus entry.  Validate will catch and report.
            if (nsids.length === 0) {
                result.push(`card.technology.unknown:unknown/${factionTech}`);
            }
        }
        return result;
    }
    getHeroNsids() {
        let source = this._sourceAndPackageId.source;
        if (source === "base") {
            source = "pok"; // aliance got added in PoK
        }
        return this._params.leaders.heroes.map((hero) => {
            return TI4.factionRegistry.rewriteNsid(`card.leader.hero:${source}/${hero}`);
        });
    }
    getHomeSurrogateTileNumber() {
        var _a;
        return (_a = this._params.homeSurrogate) !== null && _a !== void 0 ? _a : -1;
    }
    getHomeImg() {
        return `tile/system/tile-${this._params.home.toString().padStart(3, "0")}.png`;
    }
    getHomeImgPackageId() {
        return this._sourceAndPackageId.packageId;
    }
    getHomeSystemTileNumber() {
        return this._params.home;
    }
    getHomeSystemTileObj(playerSlot) {
        const tileNumber = this.getHomeSystemTileNumber();
        const nsid = TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
        if (nsid) {
            const skipContained = true;
            return this._find.findGameObject(nsid, playerSlot, skipContained);
        }
        return undefined;
    }
    getIcon() {
        return `icon/faction/${this._params.nsidName}.png`;
    }
    getIconPackageId() {
        return this._sourceAndPackageId.packageId;
    }
    getMechNsids() {
        let source = this._sourceAndPackageId.source;
        if (source === "base") {
            source = "pok"; // aliance got added in PoK
        }
        return this._params.leaders.mechs.map((mech) => {
            return TI4.factionRegistry.rewriteNsid(`card.leader.mech:${source}/${mech}`);
        });
    }
    getName() {
        return this._params.name;
    }
    getNsid() {
        const source = this._sourceAndPackageId.source;
        return `faction:${source}/${this._params.nsidName}`;
    }
    getPromissoryNsids() {
        const source = this._sourceAndPackageId.source;
        return this._params.promissories.map((promissory) => {
            return TI4.factionRegistry.rewriteNsid(`card.promissory:${source}/${promissory}`);
        });
    }
    getSource() {
        return this._sourceAndPackageId.source;
    }
    getStartingTechNsids() {
        const result = [];
        for (const startingTech of this._params.startingTechs) {
            const techs = TI4.techRegistry.getByNsidNameMaybeOmegaToo(startingTech);
            const nsids = techs.map((tech) => tech.getNsid());
            result.push(...nsids);
            // If not found, add a bogus entry.  Validate will catch and report.
            if (nsids.length === 0) {
                result.push(`card.technology.unknown:unknown/${startingTech}`);
            }
        }
        return result;
    }
    getStartingUnits() {
        const result = {};
        // eslint-disable-next-line prefer-const
        for (let [unit, count] of Object.entries(this._params.startingUnits)) {
            if (unit === "spaceDock") {
                unit = "space-dock";
            }
            else if (unit === "warSun") {
                unit = "war-sun";
            }
            result[unit] = count;
        }
        // his._params.startingUnits;
        return result;
    }
    getUnitOverrideNsids() {
        return this._params.unitOverrides.map((unitOverride) => {
            let source = this._sourceAndPackageId.source;
            // Mech got added in PoK so base factions can have pok mech.
            // If mech use that format, and if base swap to pok for it.
            if (this._params.leaders.mechs.includes(unitOverride)) {
                if (source === "base") {
                    source = "pok";
                }
                return `card.leader.mech:${source}/${unitOverride}`;
            }
            return `unit:${source}/${unitOverride}`;
        });
    }
    injectExtras(extras) {
        Object.entries(extras).forEach((value) => {
            const [nsid, count] = value;
            this._injectedExtras.set(nsid, count);
        });
        return this;
    }
}
exports.Faction = Faction;
//# sourceMappingURL=faction.js.map