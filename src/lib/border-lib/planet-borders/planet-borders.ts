import {
  Color,
  DrawingLine,
  GameObject,
  Vector,
} from "@tabletop-playground/api";
import { HexType, PlayerSlot } from "ttpg-darrell";
import { ControlSystemType } from "../space-planet-ownership/space-planet-ownership";
import { Planet } from "../../system-lib/planet/planet";

export class PlanetBorders {
  private readonly _hexToControlSystemEntry: Map<HexType, ControlSystemType>;
  private readonly _lineThickness: number;

  constructor(
    hexToControlSystemEntry: Map<HexType, ControlSystemType>,
    lineThickness: number
  ) {
    this._hexToControlSystemEntry = hexToControlSystemEntry;
    this._lineThickness = lineThickness;
  }

  _getPlanetDrawingLine(
    planet: Planet,
    owner: PlayerSlot
  ): DrawingLine | undefined {
    const color: Color | undefined = TI4.playerColor.getSlotWidgetColor(owner);
    if (!color) {
      return undefined; // also handles -1, -2 owners
    }

    const planetObj: GameObject = planet.getObj();
    const extent: Vector = planetObj.getExtent(false, false);
    const z: number = planetObj.getPosition().z + extent.z + 0.01;

    const points: Array<Vector> = planet.getPositionAsCircle();
    const line = new DrawingLine();
    line.color = color;
    line.normals = [new Vector(0, 0, 1)];
    line.points = points.map((v: Vector) => {
      v.z = z;
      return v;
    });
    line.rounded = false;
    line.thickness = this._lineThickness;
    return line;
  }

  _getSystemPlanetsDrawingLines(
    controlSystemEntry: ControlSystemType
  ): Array<DrawingLine> {
    const lines: Array<DrawingLine> = [];
    for (const planet of controlSystemEntry.system.getPlanets()) {
      const playerSlot: PlayerSlot | undefined =
        controlSystemEntry.planetNameToOwningPlayerSlot.get(planet.getName());
      if (playerSlot !== undefined) {
        const line: DrawingLine | undefined = this._getPlanetDrawingLine(
          planet,
          playerSlot
        );
        if (line) {
          lines.push(line);
        }
      }
    }
    return lines;
  }

  getDrawingLines(): Array<DrawingLine> {
    const lines: Array<DrawingLine> = [];
    for (const controlSystemEntry of this._hexToControlSystemEntry.values()) {
      const systemLines: Array<DrawingLine> =
        this._getSystemPlanetsDrawingLines(controlSystemEntry);
      lines.push(...systemLines);
    }
    return lines;
  }
}
