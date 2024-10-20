import { DeletedItemsContainer, Find } from "ttpg-darrell";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Container, GameObject, Vector } from "@tabletop-playground/api";

export class UnpackHomeSystem extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const home: number = this.getFaction().getHomeSystemTileNumber();
    const surrogate: number = this.getFaction().getHomeSurrogateTileNumber();

    const homeSystemTileNsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(home);
    const surrogateSystemTileNsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(surrogate);

    // Get generic home system tile.
    const genericHomeSystemTileNsid: string = "tile.system:base/000";
    const skipContained: boolean = true;
    const genericHomeSystemTile: GameObject | undefined =
      this._find.findGameObject(
        genericHomeSystemTileNsid,
        this.getPlayerSlot(),
        skipContained
      );
    if (!genericHomeSystemTile) {
      throw new Error(
        `Could not find generic home system tile for ${this.getPlayerSlot()}`
      );
    }

    // Get faction sheet (for surrogate, but always do for code exercise in all cases).
    const factionSheetNsid: string = this.getFaction().getFactionSheetNsid();
    const factionSheet: GameObject | undefined = this._find.findGameObject(
      factionSheetNsid,
      this.getPlayerSlot(),
      skipContained
    );
    if (!factionSheet) {
      throw new Error(
        `Could not find faction sheet for ${this.getPlayerSlot()}`
      );
    }

    DeletedItemsContainer.destroyWithoutCopying(genericHomeSystemTile);

    let pos: Vector = genericHomeSystemTile.getPosition().add([0, 0, 10]);
    let surrogatePos: Vector = new Vector(0, 0, 0);

    // Place surrogate, if any.
    if (surrogateSystemTileNsid) {
      surrogatePos = pos;
      pos = factionSheet.getPosition().add([0, 0, 10]);
      const surrogateObj: GameObject | undefined = this._find.findGameObject(
        surrogateSystemTileNsid,
        this.getPlayerSlot(),
        skipContained
      );
      if (surrogateObj) {
        const container: Container | undefined = surrogateObj.getContainer();
        if (container) {
          container.take(surrogateObj, surrogatePos);
        } else {
          surrogateObj.setPosition(surrogatePos);
        }
        surrogateObj.snapToGround();
      }
    }

    // Place home system tile.
    // TODO XXX
  }

  remove(): void {}
}
