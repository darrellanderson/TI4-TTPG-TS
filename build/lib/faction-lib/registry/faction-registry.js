"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactionRegistry = void 0;
const faction_1 = require("../faction/faction");
const faction_schema_1 = require("../schema/faction-schema");
const basic_types_schema_1 = require("../../system-lib/schema/basic-types-schema");
const faction_data_1 = require("../data/faction.data");
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const faction_nsid_rewrite_data_1 = require("../data/faction-nsid-rewrite.data");
const packageId = api_1.refPackageId;
class FactionRegistry {
    constructor() {
        this._find = new ttpg_darrell_1.Find();
        this._nsidToFaction = new Map();
        this._nsidToRewriteNsid = new Map();
        this._tileNumberToFaction = new Map();
    }
    getAllFactions() {
        return Array.from(this._nsidToFaction.values());
    }
    getAllFactionsFilteredByConfigSources() {
        const sources = new Set(TI4.config.sources);
        return this.getAllFactions().filter((faction) => {
            const source = faction.getSource();
            return sources.has(source);
        });
    }
    getByHomeSystemTileNumber(tileNumber) {
        return this._tileNumberToFaction.get(tileNumber);
    }
    getByNsid(nsid) {
        return this._nsidToFaction.get(nsid);
    }
    getByNsidOrThrow(nsid) {
        const faction = this.getByNsid(nsid);
        if (!faction) {
            throw new Error(`faction not found: "${nsid}"`);
        }
        return faction;
    }
    getByNsidName(nsidName) {
        for (const nsid of this._nsidToFaction.keys()) {
            if (nsid.endsWith(nsidName)) {
                const parsed = ttpg_darrell_1.NSID.parse(nsid);
                if (parsed && parsed.nameParts[0] === nsidName) {
                    return this.getByNsid(nsid);
                }
            }
        }
    }
    getByNsidNameOrThrow(nsidName) {
        const faction = this.getByNsidName(nsidName);
        if (!faction) {
            throw new Error(`faction not found: "${nsidName}"`);
        }
        return faction;
    }
    getByPlayerSlot(playerSlot) {
        const playerSlotToFaction = this.getPlayerSlotToFaction();
        return playerSlotToFaction.get(playerSlot);
    }
    getPlayerSlotToFaction() {
        const playerSlotToFaction = new Map();
        const skipContained = true;
        for (const obj of api_1.world.getAllObjects(skipContained)) {
            let nsid = ttpg_darrell_1.NSID.get(obj);
            if (nsid.startsWith("sheet.faction:")) {
                nsid = nsid.replace("sheet.faction:", "faction:");
            }
            const faction = this.getByNsid(nsid);
            if (faction) {
                const pos = obj.getPosition();
                const playerSlot = this._find.closestOwnedCardHolderOwner(pos);
                playerSlotToFaction.set(playerSlot, faction);
            }
        }
        return playerSlotToFaction;
    }
    load(sourceAndPackageId, factions) {
        for (const factionSchemaType of factions) {
            // Validate schema (oterhwise not validated until used).
            try {
                basic_types_schema_1.SourceAndPackageIdSchema.parse(sourceAndPackageId);
                faction_schema_1.FactionSchema.parse(factionSchemaType);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            catch (e) {
                const msg = `error: ${e.message}\nparsing: ${JSON.stringify(factionSchemaType)}`;
                throw new Error(msg);
            }
            const faction = new faction_1.Faction(sourceAndPackageId, factionSchemaType);
            this._nsidToFaction.set(faction.getNsid(), faction);
            if (!faction.getNsid().includes("keleres")) {
                this._tileNumberToFaction.set(faction.getHomeSystemTileNumber(), faction);
            }
        }
        return this;
    }
    loadDefaultData() {
        for (const [source, factions] of Object.entries(faction_data_1.SOURCE_TO_FACTION_DATA)) {
            const sourceAndPackageId = {
                source,
                packageId,
            };
            this.load(sourceAndPackageId, factions);
        }
        return this;
    }
    loadRewriteLeader(rewrite) {
        for (const [nsid, rewriteLeader] of Object.entries(rewrite)) {
            this._nsidToRewriteNsid.set(nsid, rewriteLeader);
        }
        return this;
    }
    loadDefaultRewriteNsid() {
        return this.loadRewriteLeader(faction_nsid_rewrite_data_1.REWRITE_NSIDS);
    }
    /**
     * Leader overrides may have a different source than the faction
     * (e.g. zeu.omega).
     *
     * @param nsid
     * @returns
     */
    rewriteNsid(nsid) {
        const result = this._nsidToRewriteNsid.get(nsid);
        return result ? result : nsid;
    }
    /**
     * Verify modifiers with tech or unit based triggers link to a known tech
     * or unit.
     *
     * @param errors
     * @returns
     */
    validate(errors) {
        for (const faction of this.getAllFactions()) {
            for (const nsid of faction.getFactionTechNsids()) {
                if (!TI4.techRegistry.getByNsid(nsid)) {
                    errors.push(`faction tech nsidName not found: "${nsid}"`);
                }
            }
            for (const nsid of faction.getStartingTechNsids()) {
                if (!TI4.techRegistry.getByNsid(nsid)) {
                    errors.push(`starting tech nsidName not found: "${nsid}"`);
                }
            }
            for (const nsid of faction.getUnitOverrideNsids()) {
                if (!TI4.unitAttrsRegistry.rawByNsid(nsid)) {
                    errors.push(`unit override nsid not found: "${nsid}"`);
                }
            }
        }
        return this;
    }
    validateOrThrow() {
        const errors = [];
        this.validate(errors);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }
        return this;
    }
}
exports.FactionRegistry = FactionRegistry;
//# sourceMappingURL=faction-registry.js.map