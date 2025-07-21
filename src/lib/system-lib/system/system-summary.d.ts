import { System } from "../system/system";
export type SystemSummaryType = {
    influence: number;
    optInfluence: number;
    resources: number;
    optResources: number;
    legendary: string;
    techs: string;
    traits: string;
    wormholes: string;
};
export declare class SystemSummary {
    private readonly _systems;
    static getFromSystemTileNumbers(systemTileNumbers: ReadonlyArray<number>): SystemSummary;
    constructor(systems: Array<System>);
    getSummaryRaw(): SystemSummaryType;
    getSummary(): string;
}
