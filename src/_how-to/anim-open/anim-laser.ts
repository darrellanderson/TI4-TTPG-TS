import {
  Color,
  DrawingLine,
  GameObject,
  Vector,
  world,
} from "@tabletop-playground/api";

/**
 * Periodically show a laser beam between two game objects.
 *
 * Destroys iteslf when the source object is destroyed.
 */
export class AnimLaser {
  private readonly _src: GameObject;
  private readonly _dst: GameObject;
  private _lines: Array<DrawingLine> | undefined = undefined;

  private readonly _onTick = (obj: GameObject, _deltaMsecs: number): void => {
    if (this._lines) {
      this._lines.forEach((line) => {
        world.removeDrawingLineObject(line);
      });
      this._lines = undefined;
      return;
    }

    if (!obj.isValid()) {
      obj.onTick.remove(this._onTick);
      return;
    }

    // Random to avoid a pattern.
    if (Math.random() > 0.15) {
      return;
    }

    const srcPos = this._src.getPosition();
    const dstPos = this._dst.getPosition();

    const getLine = (normal: Vector): DrawingLine => {
      const line = new DrawingLine();
      line.color = new Color(1, 0, 0, 1); // red
      line.emissiveStrength = 64; // max is 64
      line.normals = [normal];
      line.points = [srcPos, dstPos];
      line.rounded = false;
      line.thickness = 0.1;
      return line;
    };

    // Look direction is cleaner, but assumes only one player.
    this._lines = [
      getLine(new Vector(0, 0, 1)),
      getLine(new Vector(0, 0, -1)),
      getLine(new Vector(1, 0, 0)),
      getLine(new Vector(-1, 0, 0)),
      getLine(new Vector(0, 1, 0)),
      getLine(new Vector(0, -1, 0)),
    ];
    this._lines.forEach((line) => {
      world.addDrawingLine(line);
    });
  };

  constructor(src: GameObject, dst: GameObject) {
    this._src = src;
    this._dst = dst;

    src.onTick.add(this._onTick);
  }
}
