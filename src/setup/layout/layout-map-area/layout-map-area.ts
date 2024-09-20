import { DrawingLine, Vector, world } from "@tabletop-playground/api";
import { ColorLib, HexType, LayoutObjects } from "ttpg-darrell";

// Draw map rings.
const HEX_CORNERS: Array<{ q: number; r: number; s: number }> = [
  { q: 1, r: 0, s: -1 },
  { q: 0, r: 1, s: -1 },
  { q: -1, r: 1, s: 0 },
  { q: -1, r: 0, s: 1 },
  { q: 0, r: -1, s: 1 },
  { q: 1, r: -1, s: 0 },
];
const THICKNESS: number = 0.5;
const COLORS: Array<string> = [
  "#008080", // teal
  "#FC6A03", // orange
  "#F46FCD", // pink
  "#00CFFF", // blue
  "#F0F0F0", // white
];

export class LayoutMapArea {
  private readonly _layout: LayoutObjects;

  constructor(numRings: number) {
    this._layout = new LayoutObjects();

    // Reserve size.
    let x: number = 0;
    let y: number = 0;
    for (const corner of this._getCorners(1, false)) {
      x = Math.max(x, corner.x);
      y = Math.max(y, corner.y);
    }
    this._layout
      .setOverrideWidth(y * 2 * (numRings + 0.5))
      .setOverrideHeight(x * 2 * (numRings + 0.5));

    this._layout.addAfterLayout(() => {
      this._addMapRingLines(numRings);
    });
  }

  public getLayout(): LayoutObjects {
    return this._layout;
  }

  _getCorners(ring: number, overrun: boolean): Array<Vector> {
    const z: number = world.getTableHeight() + 0.02;

    const points: Array<Vector> = HEX_CORNERS.map((corner) => {
      const q: number = corner.q * ring;
      const r: number = corner.r * ring;
      const s: number = corner.s * ring;
      const hex: HexType = `<${q},${r},${s}>`;
      const pos: Vector = TI4.hex.toPosition(hex);
      pos.z = z;
      return pos;
    });

    const first: Vector | undefined = points[0];
    const second: Vector | undefined = points[1];
    if (overrun && first && second) {
      points.push(first.clone());
      points.push(second.clone());
    }

    return points;
  }

  _addMapRingLines(numRings: number): void {
    const tag: string = "map-ring";

    for (const line of world.getDrawingLines()) {
      if (line.tag === tag) {
        world.removeDrawingLineObject(line);
      }
    }

    for (let i = 1; i <= numRings; i++) {
      const colorHex: string | undefined = COLORS[i % COLORS.length];
      const points: Array<Vector> = this._getCorners(i, true);
      if (colorHex) {
        const line = new DrawingLine();
        line.color = new ColorLib().parseColorOrThrow(colorHex);
        line.normals = [new Vector(0, 0, 1)];
        line.points = points;
        line.rounded = false;
        line.tag = tag;
        line.thickness = THICKNESS;
        world.addDrawingLine(line);
      }
    }
  }
}
