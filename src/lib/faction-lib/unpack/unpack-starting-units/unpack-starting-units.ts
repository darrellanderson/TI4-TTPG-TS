import { Container, GameObject, Vector, world } from "@tabletop-playground/api";
import { Find, GarbageContainer, NSID } from "ttpg-darrell";

import { UnitType } from "../../../unit-lib/schema/unit-attrs-schema";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";

export class UnpackStartingUnits extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  _getUnitPlasticOrThrow(unit: UnitType): GameObject {
    const source: string = unit === "mech" ? "pok" : "base";
    const nsid: string = `container.unit:${source}/${unit}`;

    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      nsid,
      this.getPlayerSlot(),
      skipContained
    );
    if (!container) {
      throw new Error(
        `Could not find container for ${unit}/${this.getPlayerSlot()}`
      );
    }
    const obj: GameObject | undefined = container.takeAt(0, [0, 0, 0]);
    if (!obj) {
      throw new Error(
        `Could not find plastic for ${unit}/${this.getPlayerSlot()}`
      );
    }
    return obj;
  }

  _findHomeSystemTileOrThrow(): GameObject {
    const playerSlot: number = this.getPlayerSlot();
    const systemTileObj: GameObject | undefined =
      this.getFaction().getHomeSystemTileObj(playerSlot);
    if (!systemTileObj) {
      throw new Error(
        `Could not find home system tile for ${this.getPlayerSlot()}`
      );
    }
    return systemTileObj;
  }

  unpack() {
    const systemTileObj: GameObject = this._findHomeSystemTileOrThrow();

    const unitObjs: Array<GameObject> = [];
    const startingUnits: { [unit: string]: number } =
      this.getFaction().getStartingUnits();
    for (const [unit, count] of Object.entries(startingUnits)) {
      for (let i = 0; i < count; i++) {
        const obj: GameObject = this._getUnitPlasticOrThrow(unit as UnitType);
        obj.setOwningPlayerSlot(this.getPlayerSlot());
        unitObjs.push(obj);
      }
    }

    const rotate: number = 360 / (unitObjs.length + 1);
    let localPos: Vector = new Vector(3, 0, 10);
    for (const obj of unitObjs) {
      const pos: Vector = systemTileObj.localPositionToWorld(localPos);
      obj.setPosition(pos);
      obj.snapToGround();
      localPos = localPos.rotateAngleAxis(rotate, [0, 0, 1]);
    }
  }

  remove() {
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid.startsWith("unit:") &&
        obj.getOwningPlayerSlot() === this.getPlayerSlot() &&
        obj.getContainer() === undefined // loose on table
      ) {
        GarbageContainer.tryRecycle(obj, undefined);
      }
    }
  }
}
