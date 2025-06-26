import { Faction } from "../faction/faction";
import { FactionSchemaType } from "../schema/faction-schema";
import { SourceAndPackageIdSchemaType } from "../../system-lib/schema/basic-types-schema";
export declare class FactionRegistry {
    private readonly _find;
    private readonly _nsidToFaction;
    private readonly _nsidToRewriteNsid;
    private readonly _tileNumberToFaction;
    constructor();
    getAllFactions(): Array<Faction>;
    getAllFactionsFilteredByConfigSources(): Array<Faction>;
    getByHomeSystemTileNumber(tileNumber: number): Faction | undefined;
    getByNsid(nsid: string): Faction | undefined;
    getByNsidOrThrow(nsid: string): Faction;
    getByNsidName(nsidName: string): Faction | undefined;
    getByNsidNameOrThrow(nsidName: string): Faction;
    getByPlayerSlot(playerSlot: number): Faction | undefined;
    getPlayerSlotToFaction(): Map<number, Faction>;
    load(sourceAndPackageId: SourceAndPackageIdSchemaType, factions: Array<FactionSchemaType>): this;
    loadDefaultData(): this;
    loadRewriteLeader(rewrite: Record<string, string>): this;
    loadDefaultRewriteNsid(): this;
    /**
     * Leader overrides may have a different source than the faction
     * (e.g. zeu.omega).
     *
     * @param nsid
     * @returns
     */
    rewriteNsid(nsid: string): string;
    /**
     * Verify modifiers with tech or unit based triggers link to a known tech
     * or unit.
     *
     * @param errors
     * @returns
     */
    validate(errors: Array<string>): this;
    validateOrThrow(): this;
}
