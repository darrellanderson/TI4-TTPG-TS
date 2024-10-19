import { Find } from "ttpg-darrell";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { GameObject } from "@tabletop-playground/api";

export class UnpackHomeSystem extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const home: number = this.getFaction().getHomeSystemTileNumber();
    const surrogate: number = this.getFaction().getHomeSurrogateTileNumber();

    const homeNsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(home);
    const surrogateNsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(surrogate);

    const nsid: string = "tile.system:base/000";
    const skipContained: boolean = true;
    const generic: GameObject | undefined = this._find.findGameObject(
      nsid,
      this.getPlayerSlot(),
      skipContained
    );
    if (!generic) {
      throw new Error(
        `Could not find generic home system tile for ${this.getPlayerSlot()}`
      );
    }

    let pos = generic.getPosition().add([0, 0, 10]);

    if (surrogateNsid) {
      const surrogateObj: GameObject | undefined = this._find.findGameObject(
        surrogateNsid,
        this.getPlayerSlot(),
        skipContained
      );
      if (surrogateObj) {
        pos = surrogateObj.getPosition().add([0, 0, 10]);
      }
    }
    // TODO XXX
  }

  remove(): void {}
}
