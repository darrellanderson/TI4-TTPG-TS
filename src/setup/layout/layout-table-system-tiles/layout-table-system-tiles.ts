import {
  Container,
  GameObject,
  ObjectType,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Find, LayoutObjects } from "ttpg-darrell";

export class LayoutTableSystemTiles {
  private readonly _layout: LayoutObjects;
  private readonly _find: Find = new Find();

  constructor() {
    this._layout = new LayoutObjects();

    this._layout.addAfterLayout(() => {
      let tileNumber: number;
      let pos: Vector;
      let rot: Rotator;
      let success: boolean;

      tileNumber = 18;
      pos = new Vector(0, 0, 0);
      rot = new Rotator(0, 0, 0);
      success = this._moveSystemTileFromContainer(tileNumber, pos, rot);
      if (!success) {
        throw new Error("failed to load tile " + tileNumber);
      }

      tileNumber = 82;
      pos = TI4.hex.toPosition("<0,-5,5>");
      rot = new Rotator(0, 0, 180);
      success = this._moveSystemTileFromContainer(tileNumber, pos, rot);
      if (!success) {
        throw new Error("failed to load tile " + tileNumber);
      }
    });
  }

  public getLayout(): LayoutObjects {
    return this._layout;
  }

  _moveSystemTileFromContainer(
    tileNumber: number,
    pos: Vector,
    rot: Rotator
  ): boolean {
    const above: Vector = new Vector(pos.x, pos.y, world.getTableHeight() + 10);
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tileNumber);
    if (nsid) {
      const skipContained: boolean = false;
      const obj: GameObject | undefined = this._find.findGameObject(
        nsid,
        undefined,
        skipContained
      );
      if (obj) {
        const container: Container | undefined = obj.getContainer();
        if (container) {
          if (container.take(obj, above, false)) {
            obj.setRotation(rot);
            obj.snapToGround();
            obj.setObjectType(ObjectType.Ground);
            return true;
          }
        }
      }
    }
    return false;
  }
}
