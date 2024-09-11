import { refObject, Vector, world } from "@tabletop-playground/api";

import { LayoutTableContainers } from "./layout-table-containers";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;

const layoutTableContainers: LayoutTableContainers =
  new LayoutTableContainers();
layoutTableContainers.getLayout().doLayoutAtPoint(pos, yaw);
