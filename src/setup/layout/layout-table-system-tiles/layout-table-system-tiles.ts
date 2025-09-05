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

    const custudiansToken: GameObject = TI4.spawn.spawnOrThrow(
      "token:base/custodians"
    );

    this._layout.addAfterLayout(() => {
      let tileNumber: number;
      let pos: Vector;
      let rot: Rotator;

      tileNumber = 18;
      pos = new Vector(0, 0, 0);
      rot = new Rotator(0, 0, 0);
      this._moveSystemTileFromContainer(tileNumber, pos, rot);

      tileNumber = 82;
      pos = TI4.hex.toPosition("<0,-6,6>");
      rot = new Rotator(0, 0, 180);
      this._moveSystemTileFromContainer(tileNumber, pos, rot);

      // Place custodians token.
      custudiansToken.setPosition([0, 0, world.getTableHeight() + 10]);
      custudiansToken.snapToGround();
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
