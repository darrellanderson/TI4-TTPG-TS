import { GameObject } from "@tabletop-playground/api";
export type BuildConsumeType = "tradegood" | "planet";
export type BuildConsumeEntry = {
    obj: GameObject;
    type: BuildConsumeType;
    name: string;
    value: number;
};
export declare class BuildConsume {
    private readonly _entries;
    private readonly _unitModifierNames;
    constructor(objs: Array<GameObject>, unitModifierNames: Array<string>);
    getEntries(): Array<BuildConsumeEntry>;
    getTradegoodValue(): number;
    getPlanetValue(): number;
    getTotalValue(): number;
    getTotalValueWithModifiers(): string;
    report(): string;
}
