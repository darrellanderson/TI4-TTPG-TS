import { GameObject } from "@tabletop-playground/api";
import { HexType } from "ttpg-darrell";
import { UnitPlastic } from "../../../unit-lib/unit-plastic/unit-plastic";
import { System } from "../../../system-lib/system/system";
export type EntityAreaType = "unit" | "token" | "space" | "planet";
export type EntityAreaTypeAndCode = {
    type: EntityAreaType;
    flippable?: boolean;
    code: string;
};
export type EntityType = {
    code: string;
    planetIndex: number;
    count: number;
    colorCode?: string;
    token?: boolean;
    attachment?: boolean;
    hex?: HexType;
};
export declare const ATTACHMENT_NSID_TO_TYPE_AND_CODE: Record<string, EntityAreaTypeAndCode>;
export declare class HexSummaryCodes {
    private readonly _hexToSystem;
    constructor();
    getHexToSystem(): Map<HexType, System>;
    _getPlanetIndex(obj: GameObject): number;
    _colorCode(obj: GameObject): string | undefined;
    _unitCode(plastic: UnitPlastic): string | undefined;
    _tokenCode(obj: GameObject): string | undefined;
    unitEntity(plastic: UnitPlastic): EntityType | undefined;
    tokenEntity(obj: GameObject): EntityType | undefined;
    attachmentEntity(obj: GameObject): EntityType | undefined;
}
