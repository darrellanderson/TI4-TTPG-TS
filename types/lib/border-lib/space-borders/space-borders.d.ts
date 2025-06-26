import { DrawingLine } from "@tabletop-playground/api";
import { HexType, PlayerSlot, Polygon, PolygonLineSegment } from "ttpg-darrell";
import { ControlSystemType } from "../space-planet-ownership/space-planet-ownership";
/**
 * Get DrawingLines demarcating space borders.
 */
export declare class SpaceBorders {
    private readonly _hexToControlSystemEntry;
    private readonly _lineThickness;
    constructor(hexToControlSystemEntry: Map<HexType, ControlSystemType>, lineThickness: number);
    _getLineSegments(owner: PlayerSlot): Array<PolygonLineSegment>;
    _getPolygons(owner: PlayerSlot): Array<Polygon>;
    _getDrawingLinesByOwner(owner: PlayerSlot): Array<DrawingLine>;
    getDrawingLines(): Array<DrawingLine>;
}
