import { DrawingLine } from "@tabletop-playground/api";
import { System } from "../system/system";
import { Planet } from "../planet/planet";
export declare class SystemLabels {
    private static readonly SCALE;
    private readonly _system;
    private _uis;
    private _lines;
    static removePlanetLines(): void;
    static getPlanetLine(planet: Planet): DrawingLine;
    constructor(system: System);
    attach(): this;
    detach(): this;
}
