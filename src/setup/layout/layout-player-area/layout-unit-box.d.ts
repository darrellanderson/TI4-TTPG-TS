import { LayoutObjects } from "ttpg-darrell";
import { UnitType } from "../../../lib/unit-lib/schema/unit-attrs-schema";
export declare class LayoutUnitBox {
    private readonly _layout;
    constructor(unit: UnitType, playerSlot: number);
    getLayout(): LayoutObjects;
}
