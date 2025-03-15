import {
  GameObject,
  StaticObject,
  Vector,
  world,
  Zone,
} from "@tabletop-playground/api";
import { IGlobal } from "ttpg-darrell";

export class OnObjectFellThroughTable implements IGlobal {
  readonly _onBeginOverlapHandler = (_zone: Zone, object: GameObject): void => {
    // Move above table.
    const pos: Vector = new Vector(0, 0, world.getTableHeight() + 10);
    object.setPosition(pos);
    object.snapToGround();

    // Tell any listeners that the object fell through the table.
    TI4.events.onObjectFellThroughTable.trigger(object);
  };

  init(): void {
    const zone: Zone = this._findOrCreateZone();
    zone.onBeginOverlap.add(this._onBeginOverlapHandler);
  }

  _findOrCreateZone(): Zone {
    const zoneId: string = "__below_table__";

    // Find zone.
    let zone: Zone | undefined;
    for (const candidate of world.getAllZones()) {
      if (candidate.getId() === zoneId) {
        zone = candidate;
        break;
      }
    }

    // Create zone if it doesn't exist.
    const tableHeight: number = world.getTableHeight();
    if (!zone) {
      const pos: Vector = new Vector(0, 0, tableHeight / 2 - 1);
      zone = world.createZone(pos);
      zone.setId(zoneId);
    }

    // Size to table.
    const table: StaticObject | undefined = world.getAllTables()[0];
    if (table) {
      const currentRotation: boolean = true;
      const includeGeometry: boolean = false;
      const tableExtent: Vector = table.getExtent(
        currentRotation,
        includeGeometry
      );
      zone.setScale([tableExtent.x, tableExtent.y, tableHeight]);
    }

    zone.setColor([1, 0, 0, 0.1]);
    zone.setAlwaysVisible(true);

    return zone;
  }
}
