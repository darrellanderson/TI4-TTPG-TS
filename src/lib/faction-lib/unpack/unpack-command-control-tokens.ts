import {
  Color,
  Container,
  GameObject,
  Rotator,
  Vector,
  world,
} from "@tabletop-playground/api";
import { DeletedItemsContainer, Find, NSID, Spawn } from "ttpg-darrell";

import { AbstractUnpack } from "./abstract-unpack";
import { Faction } from "../faction/faction";
import { Scoreboard } from "../../score-lib/scoreboard/scoreboard";

export class UnpackCommandControlTokens extends AbstractUnpack {
  private readonly _find: Find = new Find();

  constructor(faction: Faction, playerSlot: number) {
    super(faction, playerSlot);
  }

  unpack(): void {
    const color: Color = TI4.playerColor.getSlotPlasticColorOrThrow(
      this.getPlayerSlot()
    );

    // Command tokens in container and on command sheet.
    const commandTokenContainer: Container =
      this._getCommandTokenContainerOrThrow();
    const commandTokenNsid: string = this.getFaction().getCommandTokenNsid();
    for (let i: number = 0; i < 16; i++) {
      const commandToken: GameObject = Spawn.spawnOrThrow(commandTokenNsid);
      commandToken.setOwningPlayerSlot(this.getPlayerSlot());
      commandToken.setTags([`command(${this.getPlayerSlot()})`]);
      commandToken.setPrimaryColor(color);
      commandTokenContainer.insert([commandToken]);
    }

    const skipContained: boolean = true;
    const commandSheet: GameObject | undefined = this._find.findGameObject(
      "sheet:base/command",
      this.getPlayerSlot(),
      skipContained
    );
    if (!commandSheet) {
      throw new Error("Cannot find command sheet");
    }
    const sheetPosArray: Array<{
      x: number;
      y: number;
      roll: number;
    }> = [
      // Tactic
      { x: 6.7, y: -2.3, roll: 0 },
      { x: 6.7, y: 0.5, roll: 0 },
      { x: 3.7, y: -1.0, roll: 0 },
      // Fleet
      { x: 4.5, y: 3.8, roll: 180 },
      { x: 2.6, y: 1.8, roll: 180 },
      { x: 1.6, y: 5.4, roll: 180 },
      // Strategy
      { x: -1.3, y: 5.7, roll: 0 },
      { x: -4.3, y: 4.0, roll: 0 },
    ];
    const z: number = world.getTableHeight() + 10;
    for (const sheetPos of sheetPosArray) {
      let pos: Vector = new Vector(sheetPos.x, sheetPos.y + 1.5, 0);
      pos = commandSheet.localPositionToWorld(pos);
      pos.z = z;
      const rot: Rotator = new Rotator(0, 270, sheetPos.roll);
      const commandToken: GameObject | undefined = commandTokenContainer.takeAt(
        0,
        pos
      );
      if (!commandToken) {
        throw new Error("Cannot take command token from container");
      }
      commandToken.setRotation(rot);
      commandToken.snapToGround();
    }

    // Control token in container.
    const controlTokenContainer: Container =
      this._getControlTokenContainerOrThrow();
    const controlTokenNsid: string = this.getFaction().getControlTokenNsid();
    const controlToken: GameObject = Spawn.spawnOrThrow(controlTokenNsid);
    controlToken.setOwningPlayerSlot(this.getPlayerSlot());
    controlToken.setTags([`control(${this.getPlayerSlot()})`]);
    controlToken.setPrimaryColor(color);
    controlTokenContainer.insert([controlToken]);

    // Control token on scoreboard.
    const scoreboard: Scoreboard = new Scoreboard();
    const pos: Vector | undefined = scoreboard.scoreToPos(
      0,
      this.getPlayerSlot()
    );
    const rot: Rotator | undefined = scoreboard.getControlTokenRotation();
    if (!pos || !rot) {
      throw new Error(
        "Cannot find scoreboard control token position and/or rotation"
      );
    }
    pos.z = z;
    const scoreboardToken: GameObject = Spawn.spawnOrThrow(
      controlTokenNsid,
      pos,
      rot
    );
    scoreboardToken.setOwningPlayerSlot(this.getPlayerSlot());
    scoreboardToken.setTags([`control(${this.getPlayerSlot()})`]);
    scoreboardToken.setPrimaryColor(color);
    scoreboardToken.snapToGround();
  }

  remove(): void {
    const commandTokenContainer: Container =
      this._getCommandTokenContainerOrThrow();
    commandTokenContainer.clear();

    const controlTokenContainer: Container =
      this._getControlTokenContainerOrThrow();
    controlTokenContainer.clear();

    const commandTokenNsid: string = this.getFaction().getCommandTokenNsid();
    const controlTokenNsid: string = this.getFaction().getControlTokenNsid();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid === commandTokenNsid || nsid === controlTokenNsid) {
        DeletedItemsContainer.destroyWithoutCopying(obj);
      }
    }
  }

  _getCommandTokenContainerOrThrow(): Container {
    const nsid: string = "container.token.command:base/generic";
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      nsid,
      this.getPlayerSlot(),
      skipContained
    );
    if (!container) {
      throw new Error(`Cannot find container with nsid: ${nsid}`);
    }
    return container;
  }

  _getControlTokenContainerOrThrow(): Container {
    const nsid: string = "container.token.control:base/generic";
    const skipContained: boolean = true;
    const container: Container | undefined = this._find.findContainer(
      nsid,
      this.getPlayerSlot(),
      skipContained
    );
    if (!container) {
      throw new Error(`Cannot find container with nsid: ${nsid}`);
    }
    return container;
  }
}
