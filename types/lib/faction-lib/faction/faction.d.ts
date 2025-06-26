import { GameObject } from "@tabletop-playground/api";
import { FactionSchemaType } from "../schema/faction-schema";
import { NsidNameSchemaType, SourceAndPackageIdSchemaType } from "../../system-lib/schema/basic-types-schema";
export declare class Faction {
    private readonly _sourceAndPackageId;
    private readonly _params;
    private readonly _find;
    private readonly _injectedExtras;
    constructor(sourceAndPackageId: SourceAndPackageIdSchemaType, params: FactionSchemaType);
    getAbbr(): string;
    getAbilityNsids(): Array<string>;
    getAgentNsids(): Array<string>;
    /**
     * Caution, there may be '.omega' version!
     * @returns
     */
    getAllianceNsids(): Array<string>;
    getCommanderNsids(): Array<string>;
    getCommandTokenNsid(): string;
    getCommodities(): number;
    getControlTokenNsid(): string;
    getExtraCount(nsid: string): number;
    getExtras(): Array<string>;
    getFactionSheetNsid(): string;
    getFactionTechNsids(): Array<string>;
    getHeroNsids(): Array<string>;
    getHomeSurrogateTileNumber(): number;
    getHomeImg(): string;
    getHomeImgPackageId(): string;
    getHomeSystemTileNumber(): number;
    getHomeSystemTileObj(playerSlot: number): GameObject | undefined;
    getIcon(): string;
    getIconPackageId(): string;
    getMechNsids(): Array<string>;
    getName(): string;
    getNsid(): NsidNameSchemaType;
    getPromissoryNsids(): Array<string>;
    getSource(): NsidNameSchemaType;
    getStartingTechNsids(): Array<string>;
    getStartingUnits(): Record<string, number>;
    getUnitOverrideNsids(): Array<string>;
    injectExtras(extras: {
        [nsid: string]: number;
    }): this;
}
