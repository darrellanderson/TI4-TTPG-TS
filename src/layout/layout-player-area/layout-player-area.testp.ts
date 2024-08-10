import { refObject, Vector, world } from "@tabletop-playground/api";
import { LayoutPlayerArea } from "./layout-player-area";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;
new LayoutPlayerArea(1).getLayout().doLayoutAtPoint(pos, yaw);
