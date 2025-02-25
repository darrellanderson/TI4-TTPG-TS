import { Color, DrawingLine, Vector, world } from "@tabletop-playground/api";
import {
  Hex,
  HexType,
  PlayerSlot,
  Polygon,
  PolygonLineSegment,
} from "ttpg-darrell";
import { ControlSystemType } from "../space-planet-ownership/space-planet-ownership";

/**
 * Get DrawingLines demarcating space borders.
 */
export class SpaceBorders {
  private readonly _hexToControlSystemEntry: Map<HexType, ControlSystemType>;
  private readonly _lineThickness: number;

  constructor(
    hexToControlSystemEntry: Map<HexType, ControlSystemType>,
    lineThickness: number
  ) {
    this._hexToControlSystemEntry = hexToControlSystemEntry;
    this._lineThickness = lineThickness;
  }

  _getLineSegments(owner: PlayerSlot): Array<PolygonLineSegment> {
    // line a->b is clockwise winding for inset logic.
    const result: Array<PolygonLineSegment> = [];

    for (const [hex, controlSystemEntry] of this._hexToControlSystemEntry) {
      if (controlSystemEntry.spaceOwningPlayerSlot !== owner) {
        continue; // no or different ownership
      }

      const corners = TI4.hex.corners(hex); // top right, then counterclockwise
      const neighbors = Hex.neighbors(hex); // top, then counterclockwise
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor: HexType | undefined = neighbors[i];
        if (neighbor) {
          // Add a border line if neighbor is not owned by the same player.
          const neighborSummary: ControlSystemType | undefined =
            this._hexToControlSystemEntry.get(neighbor);
          if (
            !neighborSummary ||
            neighborSummary.spaceOwningPlayerSlot !== owner
          ) {
            const a: Vector | undefined = corners[i];
            const b: Vector | undefined = corners[(i + 1) % corners.length];
            if (a && b) {
              result.push({ a, b });
            }
          }
        }
      }
    }

    return result;
  }

  _getPolygons(owner: PlayerSlot): Array<Polygon> {
    // Connect line segments into polygons.  The nature of borders should
    // generate fully connected "rings", but that is not required here.
    const lineSegments: Array<PolygonLineSegment> =
      this._getLineSegments(owner);
    return Polygon.conjoin(lineSegments);
  }

  _getDrawingLinesByOwner(owner: PlayerSlot): Array<DrawingLine> {
    const lines: Array<DrawingLine> = [];

    const color: Color | undefined = TI4.playerColor.getSlotWidgetColor(owner);
    if (!color) {
      return lines;
    }

    const polygons: Array<Polygon> = this._getPolygons(owner);
    const z = world.getTableHeight() + 0.3;
    for (let polygon of polygons) {
      polygon = polygon.inset(this._lineThickness / 2);
      const line: DrawingLine = new DrawingLine();
      line.color = color;
      line.normals = [new Vector(0, 0, 1)];
      line.points = polygon.getPoints().map((v) => {
        v.z = z;
        return v;
      });
      line.rounded = false;
      line.thickness = this._lineThickness;
      lines.push(line);
    }
    return lines;
  }

  getDrawingLines(): Array<DrawingLine> {
    const lines: Array<DrawingLine> = [];
    for (const seat of TI4.playerSeats.getAllSeats()) {
      const owner: PlayerSlot = seat.playerSlot;
      const ownerLines: Array<DrawingLine> =
        this._getDrawingLinesByOwner(owner);
      lines.push(...ownerLines);
    }
    return lines;
  }
}
