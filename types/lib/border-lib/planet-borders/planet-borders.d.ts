import { DrawingLine } from "@tabletop-playground/api";
import { HexType, PlayerSlot } from "ttpg-darrell";
import { ControlSystemType } from "../space-planet-ownership/space-planet-ownership";
import { Planet } from "../../system-lib/planet/planet";
export declare class PlanetBorders {
    private readonly _hexToControlSystemEntry;
    private readonly _lineThickness;
    constructor(hexToControlSystemEntry: Map<HexType, ControlSystemType>, lineThickness: number);
    _getPlanetDrawingLine(planet: Planet, owner: PlayerSlot): DrawingLine | undefined;
    _getSystemPlanetsDrawingLines(controlSystemEntry: ControlSystemType): Array<DrawingLine>;
    getDrawingLines(): Array<DrawingLine>;
}
