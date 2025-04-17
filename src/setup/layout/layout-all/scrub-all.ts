import { GameObject, world } from "@tabletop-playground/api";
import { DeletedItemsContainer } from "ttpg-darrell";

export function scrubAll(preserveThisObj: GameObject | undefined): void {
  // Destroy objects inside containers.  Destroying a container destroys the
  // contents "normally", potentially triggering deleted items treatment.
  for (const obj of world.getAllObjects(false)) {
    if (obj !== preserveThisObj && obj.getContainer()) {
      DeletedItemsContainer.destroyWithoutCopying(obj);
    }
  }

  for (const obj of world.getAllObjects(true)) {
    if (obj !== preserveThisObj) {
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
