import { Color, DrawingLine, Vector, world } from "@tabletop-playground/api";
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

  _getDrawingLine(planet: Planet, owner: PlayerSlot): DrawingLine | undefined {
    const color: Color | undefined = TI4.playerColor.getSlotWidgetColor(owner);
    if (!color) {
      return undefined;
    }

    const z: number = world.getTableHeight() + 0.2;
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

  getDrawingLines(): Array<DrawingLine> {
    const lines: Array<DrawingLine> = [];

    for (const controlSystemEntry of this._hexToControlSystemEntry.values()) {
      const planetNameToOwningPlayerSlot: Map<string, PlayerSlot> =
        controlSystemEntry.planetNameToOwningPlayerSlot;
      for (const [planetName, playerSlot] of planetNameToOwningPlayerSlot) {
        if (playerSlot < 0) {
          continue; // no or multiple ownership
        }
        let planet: Planet | undefined = undefined;
        for (const candidatePlanet of controlSystemEntry.system.getPlanets()) {
          if (candidatePlanet.getName() === planetName) {
            planet = candidatePlanet;
            break;
          }
        }
        if (planet) {
          const line: DrawingLine | undefined = this._getDrawingLine(
            planet,
            playerSlot
          );
          if (line) {
            lines.push(line);
          }
        }
      }
    }
    return lines;
  }
}
