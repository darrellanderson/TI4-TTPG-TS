import { refObject, Vector, world } from "@tabletop-playground/api";

import { LayoutAll } from "./layout-all";
import { SetupPlayerSlotColors } from "setup/setup-player-slot-colors/setup-player-slot-colors";

console.log("LAYOUT-ALL.TESTP");

for (const obj of world.getAllObjects(true)) {
  if (obj !== refObject) {
    obj.destroy();
  }
}
for (const line of world.getDrawingLines()) {
  world.removeDrawingLineObject(line);
}
for (const zone of world.getAllZones()) {
  zone.destroy();
}

new SetupPlayerSlotColors().setup();

const z: number = world.getTableHeight();
const pos: Vector = new Vector(0, 0, z + 3);
const yaw: number = 0;

const playerCount: number = 6;
const layout: LayoutAll = new LayoutAll(playerCount);
layout.getLayout().doLayoutAtPoint(pos, yaw);
