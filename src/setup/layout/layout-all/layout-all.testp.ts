import { GameObject, refObject, Vector, world } from "@tabletop-playground/api";

import { LayoutAll } from "./layout-all";
import { SetupPlayerSlotColors } from "setup/setup-player-slot-colors/setup-player-slot-colors";
import { DeletedItemsContainer } from "ttpg-darrell";

const refObjectCopy: GameObject = refObject;

function scrub() {
  // Destroy objects inside containers.  Destroying a container destroys the
  // contents "normally", potentially triggering deleted items treatment.
  for (const obj of world.getAllObjects(false)) {
    if (obj !== refObjectCopy && obj.getContainer()) {
      DeletedItemsContainer.destroyWithoutCopying(obj);
    }
  }

  for (const obj of world.getAllObjects(true)) {
    if (obj !== refObjectCopy) {
      DeletedItemsContainer.destroyWithoutCopying(obj);
    }
  }
  for (const line of world.getDrawingLines()) {
    world.removeDrawingLineObject(line);
  }
  for (const zone of world.getAllZones()) {
    zone.destroy();
  }
}

function go() {
  console.log("LAYOUT-ALL.TESTP");
  scrub();

  TI4.config.setPlayerCount(6);

  new SetupPlayerSlotColors().setup();

  const z: number = world.getTableHeight();
  const pos: Vector = new Vector(0, 0, z + 3);
  const yaw: number = 0;

  const playerCount: number = TI4.config.playerCount;
  const layout: LayoutAll = new LayoutAll(playerCount);
  layout.getLayout().doLayoutAtPoint(pos, yaw);
}

setTimeout(scrub, 1000);
setTimeout(scrub, 2000);
setTimeout(go, 3000);
