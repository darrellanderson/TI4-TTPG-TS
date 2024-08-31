import { refObject, Vector, world } from "@tabletop-playground/api";
import { LayoutSheets } from "./layout-sheets";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;
new LayoutSheets(1).getLayout().doLayoutAtPoint(pos, yaw);
