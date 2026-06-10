import {
  GameObject,
  GameWorld,
  Vector,
  world,
  Zone,
} from "@tabletop-playground/api";
import { ErrorHandler, IGlobal, NSID } from "ttpg-darrell";

export class OnObjectFellThroughTable implements IGlobal {
  private readonly _underTableObjIdToAge: Map<string, number> = new Map<
    string,
    number
  >();
  private _zone: Zone | undefined;
  private _reportErrors: boolean = true;

  readonly _processObjs = (): void => {
    // Get objects under the table.
    const underTableObjIds: ReadonlySet<string> = this.getObjIdsUnderTable();

    // Start tracking any new under-table objects.
    for (const objId of underTableObjIds) {
      if (!this._underTableObjIdToAge.has(objId)) {
        this._underTableObjIdToAge.set(objId, 0);
      }
    }

    // Stop tracking any that are no longer under the table.
    for (const objId of this._underTableObjIdToAge.keys()) {
      if (!underTableObjIds.has(objId)) {
        this._underTableObjIdToAge.delete(objId);
      }
    }

    // Age under table objects.
    for (const [objId, age] of this._underTableObjIdToAge.entries()) {
      this._underTableObjIdToAge.set(objId, age + 1);
    }

    // After some time, consider any remaining under-table objects as having "fallen through" and move them back above the table.
    for (const [objId, age] of this._underTableObjIdToAge.entries()) {
      if (age > 3) {
        this._underTableObjIdToAge.delete(objId);
        this.moveObjAboveTable(objId);
      }
    }
  };

  private getObjIdsUnderTable(): ReadonlySet<string> {
    const objIds: Set<string> = new Set<string>();
    const zone: Zone | undefined = this._zone;
    if (zone && zone.isValid()) {
      for (const obj of zone.getOverlappingObjects()) {
        if (obj.isValid() && obj.getContainer() === undefined) {
          objIds.add(obj.getId());
        }
      }
    }
    return objIds;
  }

  private moveObjAboveTable(objId: string): boolean {
    const obj: GameObject | undefined = world.getObjectById(objId);
    if (!obj || !obj.isValid() || obj.getContainer() !== undefined) {
      return false;
    }

    const objPos: Vector = obj.getPosition();
    const tableHeight: number = world.getTableHeight();
    if (objPos.z >= tableHeight) {
      return false;
    }

    const origPos: string = [
      objPos.x.toFixed(1),
      objPos.y.toFixed(1),
      objPos.z.toFixed(1),
    ].join(",");

    objPos.z = tableHeight + 10;
    obj.setPosition(objPos);
    obj.snapToGround();

    let nsid: string = NSID.get(obj);
    if (nsid.length === 0) {
      nsid = `template!${obj.getTemplateId()}`;
    } else {
      nsid = nsid.replace(/:/g, "!"); // replace ':' to avoid bugsplat using as delimiter
    }

    const msg: string = `fell through: "${nsid}" ([${origPos}] vs ${tableHeight.toFixed(1)})`;
    console.log(msg);
    if (this._reportErrors) {
      ErrorHandler.onError.trigger(msg);
    }

    // Tell any listeners that the object fell through the table.
    TI4.events.onObjectFellThroughTable.trigger(obj);

    return true;
  }

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

  static __findOrCreateZone(): Zone {
    const zoneId: string = "__below_table__";

    // Find the table (by NSID).
    const { tablePosition, tableExtent } =
      OnObjectFellThroughTable._getTablePositionAndExtent();
    const tableHeight: number = Math.max(
      world.getTableHeight(),
      tablePosition.z + tableExtent.z,
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
    const zone: Zone = OnObjectFellThroughTable.__findOrCreateZone();
    zone.destroy();
  }

  init(): void {
    this._zone = OnObjectFellThroughTable.__findOrCreateZone();

    if (GameWorld.getExecutionReason() !== "unittest") {
      setInterval(this._processObjs, 1000);
    }
  }

  setReportErrors(reportErrors: boolean): this {
    this._reportErrors = reportErrors;
    return this;
  }
}
