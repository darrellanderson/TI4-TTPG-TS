import { GameObject } from "@tabletop-playground/api";
import { UnitAttrsSet } from "../unit-lib/unit-attrs-set/unit-attrs-set";
import { UnitType } from "../unit-lib/schema/unit-attrs-schema";
export type BuildProduceEntry = {
    obj: GameObject;
    unit: UnitType;
    count: number;
};
export declare class BuildProduce {
    private readonly _entries;
    private readonly _unitAttrsSet;
    constructor(objs: Array<GameObject>, unitAttrsSet: UnitAttrsSet);
    getCost(): number;
    getEntries(): Array<BuildProduceEntry>;
    getPlasticCount(): number;
    moveToSystemTile(systemTileObj: GameObject): void;
    report(): string;
}
