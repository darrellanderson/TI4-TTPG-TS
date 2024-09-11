import { refObject, Vector, world } from "@tabletop-playground/api";

import { LayoutTableDecks } from "./layout-table-decks";

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;

const layoutTableDecks: LayoutTableDecks = new LayoutTableDecks();
layoutTableDecks.getLayout().doLayoutAtPoint(pos, yaw);
