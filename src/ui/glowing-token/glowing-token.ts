import {
  Color,
  DrawingLine,
  GameObject,
  Vector,
} from "@tabletop-playground/api";

/**
 * Add a glowing effect to a token.
 * Emission mask is fixed in the template, but we can add glowing lines.
 */
export class GlowingToken {
  private readonly _obj: GameObject;
  private readonly _lineWidth: number = 0.2;
  private readonly _color: Color = new Color(1, 0, 0, 1);

  constructor(token: GameObject) {
    this._obj = token;

    for (const line of token.getDrawingLines()) {
      token.removeDrawingLineObject(line);
    }
    token.addDrawingLine(this._getDrawingLine());
  }

  _getPoints(): Array<Vector> {
    const currentRotation: boolean = false;
    const includeGeometry: boolean = false;
    const extent: Vector = this._obj.getExtent(
      currentRotation,
      includeGeometry
    );

    const center: Vector = new Vector(0, 0, 0); // local
    const localZ: number = extent.z + 0.01;
    const r: number = Math.min(extent.x, extent.y) - this._lineWidth / 2;

    const points: Array<Vector> = [];
    const numPoints = 32;
    const deltaPhi = (Math.PI * 2) / numPoints;
    for (let phi = 0; phi <= Math.PI * 2 + 0.01; phi += deltaPhi) {
      const p = new Vector(Math.cos(phi) * r, Math.sin(phi) * r, localZ);
      points.push(p.add(center));
    }
    return points;
  }

  /**
   * Get a DrawingLine with points in local object space.
   *
   * @returns
   */
  _getDrawingLine(): DrawingLine {
    const points: Array<Vector> = this._getPoints();

    const line = new DrawingLine();
    line.color = this._color;
    line.emissiveStrength = 64; // 0-64
    line.normals = [new Vector(0, 0, 1)];
    line.points = points;
    line.rounded = false;
    line.thickness = this._lineWidth;

    return line;
  }
}
