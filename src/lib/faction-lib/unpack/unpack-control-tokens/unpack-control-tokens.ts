import {
  Color,
  Container,
  GameObject,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { DeletedItemsContainer, Find, NSID } from "ttpg-darrell";

import { AbstractUnpack } from "../abstract-unpack/abstract-unpack";
import { Faction } from "../../faction/faction";
import { Scoreboard } from "../../../score-lib/scoreboard/scoreboard";

export class UnpackControlTokens extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    this._unpackControlTokenToContainer();
    this._unpackControlTokenToScoreboard();
  }

  _unpackControlTokenToContainer(): void {
    const controlTokenContainer: Container =
      this._getControlTokenContainerOrThrow();
    const pos: Vector = controlTokenContainer.getPosition().add([0, 0, 10]);
    const rot: Rotator = new Rotator(0, 0, 0);
    const controlToken: GameObject = this._spawnControlToken(pos, rot);
    controlTokenContainer.insert([controlToken]);
  }

  _unpackControlTokenToScoreboard(): void {
    const scoreboard: Scoreboard = new Scoreboard();
    const pos: Vector | undefined = scoreboard.scoreToPos(
      0,
      this.getPlayerSlot(),
    );
    const rot: Rotator | undefined = scoreboard.getControlTokenRotation();
    if (!pos || !rot) {
      throw new Error(
        "Cannot find scoreboard control token position and/or rotation",
      );
    }
    pos.z = world.getTableHeight() + 10;
    const scoreboardToken: GameObject = this._spawnControlToken(pos, rot);
    scoreboardToken.snapToGround();
  }

  _spawnControlToken(pos: Vector, rot: Rotator): GameObject {
    const color: Color = TI4.playerColor.getSlotPlasticColorOrThrow(
      this.getPlayerSlot(),
    );
    const controlTokenNsid: string = this.getFaction().getControlTokenNsid();
    const controlToken: GameObject = TI4.spawn.spawnOrThrow(
      controlTokenNsid,
      pos,
      rot,
    );
    controlToken.setOwningPlayerSlot(this.getPlayerSlot());
    controlToken.setTags([`control(${this.getPlayerSlot()})`, "token-control"]);
    controlToken.setPrimaryColor(color);

    return controlToken;
  }

  remove(): void {
    const controlTokenContainer: Container =
      this._getControlTokenContainerOrThrow();
    controlTokenContainer.clear();

    const controlTokenNsid: string = this.getFaction().getControlTokenNsid();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid === controlTokenNsid &&
        obj.getOwningPlayerSlot() === this.getPlayerSlot()
      ) {
        DeletedItemsContainer.destroyWithoutCopying(obj);
      }
    }
  }

  _getControlTokenContainerOrThrow(): Container {
    const nsid: string = "container.token.control:base/generic";
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      nsid,
      this.getPlayerSlot(),
      skipContained,
    );
    if (!container) {
      throw new Error(`Cannot find container with nsid: ${nsid}`);
    }
    return container;
  }
}
