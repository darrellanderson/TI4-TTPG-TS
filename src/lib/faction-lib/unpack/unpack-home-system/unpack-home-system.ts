import {
  GameObject,
  ObjectType,
  Vector,
  world,
} from "@tabletop-playground/api";
import { DeletedItemsContainer, Find } from "ttpg-darrell";

import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
import { MapHomeSystemLocations } from "../../../map-string-lib/map-home-system-locations/map-home-system-locations";

export class UnpackHomeSystem extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  _findGenericHomeSystemTileOrThrow(): GameObject {
    return new MapHomeSystemLocations().findOrSpawnGenericHomeSystemOrThrow(
      this.getPlayerSlot()
    );
  }

  _findStatusPadOrThrow(): GameObject {
    const nsid: string = "mat:base/status-pad";
    const obj: GameObject | undefined = this._find.findGameObject(
      nsid,
      this.getPlayerSlot(),
      true
    );
    if (!obj) {
      throw new Error(`Could not find status pad for ${this.getPlayerSlot()}`);
    }
    return obj;
  }

  _spawnGenericHomeSystemTileOrThrow(): GameObject {
    return new MapHomeSystemLocations().findOrSpawnGenericHomeSystemOrThrow(
      this.getPlayerSlot()
    );
  }

  _getHomeSystemTileNsid(): string {
    const home: number = this.getFaction().getHomeSystemTileNumber();
    const homeSystemTileNsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(home);
    if (!homeSystemTileNsid) {
      throw new Error(`Could not find home system tile for ${home}`);
    }
    return homeSystemTileNsid;
  }

  _spawnHomeSystemTile(): GameObject {
    const homeSystemTileNsid: string = this._getHomeSystemTileNsid();
    const obj: GameObject = TI4.spawn.spawnOrThrow(homeSystemTileNsid);
    obj.setOwningPlayerSlot(this.getPlayerSlot());
    return obj;
  }

  _findHomeSystemTileOrThrow(): GameObject {
    const homeSystemTileNsid: string = this._getHomeSystemTileNsid();
    const obj: GameObject | undefined = this._find.findGameObject(
      homeSystemTileNsid,
      undefined,
      true
    );
    if (!obj) {
      throw new Error(
        `Could not find home system tile for ${this.getPlayerSlot()}`
      );
    }
    return obj;
  }

  _getSurrogateSystemTileNsid(): string | undefined {
    const surrogate: number = this.getFaction().getHomeSurrogateTileNumber();
    return TI4.systemRegistry.tileNumberToSystemTileObjNsid(surrogate);
  }

  _spawnSurrogateSystemTile(): GameObject | undefined {
    const surrogateSystemTileNsid: string | undefined =
      this._getSurrogateSystemTileNsid();
    if (!surrogateSystemTileNsid) {
      return undefined;
    }
    const obj: GameObject = TI4.spawn.spawnOrThrow(surrogateSystemTileNsid);
    obj.setOwningPlayerSlot(this.getPlayerSlot());
    return obj;
  }

  _findSurrogateSystemTile(): GameObject | undefined {
    let result: GameObject | undefined = undefined;
    const surrogateSystemTileNsid: string | undefined =
      this._getSurrogateSystemTileNsid();
    if (surrogateSystemTileNsid) {
      result = this._find.findGameObject(
        surrogateSystemTileNsid,
        undefined,
        true
      );
    }
    return result;
  }

  unpack(): void {
    // Get generic home system tile.
    const genericHomeSystemTile: GameObject =
      this._findGenericHomeSystemTileOrThrow();

    // Get status pad (for surrogate, but always do for code exercise in all cases).
    const statusPad: GameObject = this._findStatusPadOrThrow();

    const homeSystemTileObj: GameObject = this._spawnHomeSystemTile();
    const surrogatSystemTileeObj: GameObject | undefined =
      this._spawnSurrogateSystemTile();

    const homePos: Vector = genericHomeSystemTile.getPosition().add([0, 0, 10]);
    const dx: number = (statusPad.getPosition().x < 0 ? 1 : -1) * 15;
    let secondHomePos: Vector = statusPad.getPosition().add([dx, 15, 10]);
    secondHomePos = TI4.hex.toPosition(TI4.hex.fromPosition(secondHomePos));
    secondHomePos.z = world.getTableHeight() + 10;

    DeletedItemsContainer.destroyWithoutCopying(genericHomeSystemTile);
    if (surrogatSystemTileeObj) {
      surrogatSystemTileeObj.setPosition(homePos);
      surrogatSystemTileeObj.snapToGround();
      surrogatSystemTileeObj.setObjectType(ObjectType.Ground);
      homeSystemTileObj.setPosition(secondHomePos);
      homeSystemTileObj.snapToGround();
      homeSystemTileObj.setObjectType(ObjectType.Ground);
    } else {
      homeSystemTileObj.setPosition(homePos);
      homeSystemTileObj.snapToGround();
      homeSystemTileObj.setObjectType(ObjectType.Ground);
    }
  }

  remove(): void {
    const homeSystemTileObj: GameObject = this._findHomeSystemTileOrThrow();
    const surrogatSystemTileeObj: GameObject | undefined =
      this._findSurrogateSystemTile();

    let pos: Vector;
    if (surrogatSystemTileeObj) {
      pos = surrogatSystemTileeObj.getPosition().add([0, 0, 10]);
    } else {
      pos = homeSystemTileObj.getPosition().add([0, 0, 10]);
    }

    DeletedItemsContainer.destroyWithoutCopying(homeSystemTileObj);
    if (surrogatSystemTileeObj) {
      DeletedItemsContainer.destroyWithoutCopying(surrogatSystemTileeObj);
    }

    const genericHomeSystemTile: GameObject =
      this._spawnGenericHomeSystemTileOrThrow();
    genericHomeSystemTile.setPosition(pos);
    genericHomeSystemTile.snapToGround();
  }
}
