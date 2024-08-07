import { refObject, Vector, world } from "@tabletop-playground/api";
import { LayoutUnitBoxes } from "./layout-unit-boxes";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}

const pos: Vector = new Vector(0, 0, world.getTableHeight() + 1);
const yaw: number = 0;
new LayoutUnitBoxes(4).doLayoutAtPoint(pos, yaw);
