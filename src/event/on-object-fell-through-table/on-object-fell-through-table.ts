import { GameObject, Vector, world, Zone } from "@tabletop-playground/api";
import { ErrorHandler, IGlobal, NSID } from "ttpg-darrell";

export class OnObjectFellThroughTable implements IGlobal {
  private _relocateTo: Vector = new Vector(0, 0, 0);

  readonly _onBeginOverlapHandler = (_zone: Zone, object: GameObject): void => {
    const objPos: Vector = object.getPosition();
    if (objPos.x === 0 && objPos.y === 0 && objPos.z === 0) {
      return; // "f"lip moves the object to the origin briefly.
    }

    // Move above table.
    const pos: Vector = new Vector(
      this._relocateTo.x,
      this._relocateTo.y,
      world.getTableHeight() + 10
    );
    object.setPosition(pos);
    object.snapToGround();

    const nsid: string = NSID.get(object);
    const msg: string = `"${nsid}" fell through the table`;
    ErrorHandler.onError.trigger(msg);

    // Tell any listeners that the object fell through the table.
    TI4.events.onObjectFellThroughTable.trigger(object);
  };

  static _getTablePositionAndExtent(): {
    tablePosition: Vector;
    tableExtent: Vector;
  } {
    const result = {
      tablePosition: new Vector(0, 0, 0),
      tableExtent: new Vector(0, 0, 0),
    };

    // Find the table (by NSID).
    const currentRotation: boolean = true;
    const includeGeometry: boolean = true;
    for (const table of world.getAllTables()) {
      const nsid: string = NSID.get(table);
      if (nsid === "table:base/table") {
        result.tablePosition = table.getPosition();
        result.tableExtent = table.getExtent(currentRotation, includeGeometry);
      }
    }

    return result;
  }

  static _findOrCreateZone(): Zone {
    const zoneId: string = "__below_table__";

    // Find the table (by NSID).
    const { tablePosition, tableExtent } =
      OnObjectFellThroughTable._getTablePositionAndExtent();
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
    const pos: Vector = new Vector(0, 0, tableHeight / 2 - 3);
    if (!zone) {
      zone = world.createZone(pos);
      zone.setId(zoneId);
    }

    // Always update pos/size.
    zone.setPosition(pos);
    zone.setScale([
      tableExtent.x * 2 - 0.1,
      tableExtent.y * 2 - 0.1,
      tableHeight,
    ]);

    // Visualize for initial testing?
    zone.setColor([1, 0, 0, 0.5]);
    zone.setAlwaysVisible(false);

    return zone;
  }

  /**
   * Destroy the zone (will be recreated on next load).
   * This can be useful for testing, or before doing bulk setup that may create
   * things at the origin (below the table).
   */
  static destroyZone(): void {
    const zone: Zone = OnObjectFellThroughTable._findOrCreateZone();
    zone.destroy();
  }

  init(): void {
    const zone: Zone = OnObjectFellThroughTable._findOrCreateZone();
    zone.getOverlappingObjects().forEach((object: GameObject) => {
      this._onBeginOverlapHandler(zone, object);
    });
    zone.onBeginOverlap.add(this._onBeginOverlapHandler);
  }

  setRelocateTo(position: Vector): this {
    this._relocateTo = position;
    return this;
  }
}
