import {
  Color,
  DrawingLine,
  GameObject,
  Vector,
} from "@tabletop-playground/api";

export class AnimHighlight {
  static simple(obj: GameObject, msecs: number): Promise<void> {
    const line: DrawingLine = AnimHighlight._getOutline(obj);
    obj.addDrawingLine(line);

    return new Promise((resolve) => {
      setTimeout(() => {
        obj.removeDrawingLineObject(line);
        resolve();
      }, msecs);
    });
  }

  static _getOutline(obj: GameObject): DrawingLine {
    const extent: Vector = obj.getExtent(false, false);
    const width: number = 1;
    const z: number = extent.z + 0.1;
    const points: Array<Vector> = [
      new Vector(extent.x + width / 2, extent.y + width / 2, z),
      new Vector(extent.x + width / 2, -extent.y - width / 2, z),
      new Vector(-extent.x - width / 2, -extent.y - width / 2, z),
      new Vector(-extent.x - width / 2, extent.y + width / 2, z),
      new Vector(extent.x + width / 2, extent.y + width / 2, z),
    ];
    const outline: DrawingLine = new DrawingLine();
    outline.color = new Color(1, 0, 0); // Red
    outline.normals = [new Vector(0, 0, 1)];
    outline.points = points;
    outline.thickness = width;
    return outline;
  }
}
