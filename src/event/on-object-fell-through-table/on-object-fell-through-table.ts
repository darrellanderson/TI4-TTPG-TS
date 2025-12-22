import {
  GameObject,
  GameWorld,
  Vector,
  world,
  Zone,
} from "@tabletop-playground/api";
import { ErrorHandler, IGlobal, NSID } from "ttpg-darrell";

export class OnObjectFellThroughTable implements IGlobal {
  private readonly _underTableAgingObjIds: Set<string> = new Set<string>();
  private readonly _underTableAgedObjIds: Set<string> = new Set<string>();
  private _reportErrors: boolean = false;

  readonly _processObjs = (): void => {
    const tableHeight: number = world.getTableHeight();

    for (const objId of Array.from(this._underTableAgingObjIds)) {
      this._underTableAgingObjIds.delete(objId);
      const obj: GameObject | undefined = world.getObjectById(objId);
      if (obj && obj.isValid() && obj.getContainer() === undefined) {
        const objPos: Vector = obj.getPosition();
        if (objPos.z < tableHeight) {
          this._underTableAgedObjIds.add(objId);
        }
      }
    }

    for (const objId of Array.from(this._underTableAgedObjIds)) {
      this._underTableAgedObjIds.delete(objId);
      const obj: GameObject | undefined = world.getObjectById(objId);
      if (obj && obj.isValid() && obj.getContainer() === undefined) {
        const objPos: Vector = obj.getPosition();
        if (objPos.z < tableHeight) {
          objPos.z = tableHeight + 10;
          obj.setPosition(objPos);
          obj.snapToGround();

          const nsid: string = NSID.get(obj);
          const msg: string = `"${nsid}" fell through the table`;
          console.log(msg);
          if (this._reportErrors) {
            ErrorHandler.onError.trigger(msg);
          }

          // Tell any listeners that the object fell through the table.
          TI4.events.onObjectFellThroughTable.trigger(obj);
        }
      }
    }
  };

  readonly _onBeginOverlapHandler = (_zone: Zone, object: GameObject): void => {
    this._underTableAgingObjIds.add(object.getId());
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
   * This can be useful for testing.
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

    if (GameWorld.getExecutionReason() !== "unittest") {
      setInterval(this._processObjs, 1000);
    }
  }

  setReportErrors(reportErrors: boolean): this {
    this._reportErrors = reportErrors;
    return this;
  }
}
