import { GameObject, Vector, world, Zone } from "@tabletop-playground/api";
import { IGlobal, NSID } from "ttpg-darrell";

export class OnObjectFellThroughTable implements IGlobal {
  private _relocateTo: Vector = new Vector(0, 0, 0);

  readonly _onBeginOverlapHandler = (_zone: Zone, object: GameObject): void => {
    // Move above table.
    const pos: Vector = new Vector(
      this._relocateTo.x,
      this._relocateTo.y,
      world.getTableHeight() + 100
    );
    object.setPosition(pos);
    object.snapToGround();

    // Tell any listeners that the object fell through the table.
    TI4.events.onObjectFellThroughTable.trigger(object);
  };

  init(): void {
    const zone: Zone = this._findOrCreateZone();
    zone.getOverlappingObjects().forEach((object: GameObject) => {
      this._onBeginOverlapHandler(zone, object);
    });
    zone.onBeginOverlap.add(this._onBeginOverlapHandler);

    process.nextTick(() => {
      console.log(
        "xxx zone",
        zone.getId(),
        zone.getPosition().toString(),
        zone.getScale().toString()
      );
    });
  }

  setRelocateTo(position: Vector): this {
    this._relocateTo = position;
    return this;
  }

  _getTablePositionAndExtent(): { tablePosition: Vector; tableExtent: Vector } {
    const result = {
      tablePosition: new Vector(0, 0, 0),
      tableExtent: new Vector(0, 0, 0),
    };

    // Find the table (by NSID).
    const currentRotation: boolean = true;
    const includeGeometry: boolean = false;
    for (const table of world.getAllTables()) {
      const nsid: string = NSID.get(table);
      if (nsid === "table:base/table") {
        result.tablePosition = table.getPosition();
        result.tableExtent = table.getExtent(currentRotation, includeGeometry);
      }
    }

    return result;
  }

  _findOrCreateZone(): Zone {
    const zoneId: string = "__below_table__";

    // Find the table (by NSID).
    const { tablePosition, tableExtent } = this._getTablePositionAndExtent();
    const tableHeight: number = Math.max(
      world.getTableHeight(),
      tablePosition.z + tableExtent.z
    );

    // Find zone.
    let zone: Zone | undefined;
    for (const candidate of world.getAllZones()) {
      if (candidate.isValid() && candidate.getId() === zoneId) {
        zone = candidate;
        break;
      }
    }

    // Create zone if it doesn't exist.
    if (!zone) {
      const pos: Vector = new Vector(0, 0, tableHeight / 2 - 1);
      zone = world.createZone(pos);
      zone.setId(zoneId);
      zone.setScale([tableExtent.x, tableExtent.y, tableHeight]);
    }

    zone.setColor([1, 0, 0, 0.5]);
    zone.setAlwaysVisible(true);

    return zone;
  }
}
