import {
  Container,
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, HexType, IGlobal, NSID } from "ttpg-darrell";

export class DiplomacySystem implements IGlobal {
  private readonly _actionName: string = "*Diplomacy System";
  private readonly _customActionHandler = (
    systemTileObj: GameObject,
    player: Player,
    actionName: string
  ) => {
    if (actionName === this._actionName) {
      this.diplomacySystem(systemTileObj, player);
    }
  };

  init(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAddContextMenuItem(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject) => {
      this._maybeAddContextMenuItem(obj);
    });
  }

  _maybeAddContextMenuItem(obj: GameObject) {
    const nsid: string = NSID.get(obj);
    if (nsid.startsWith("tile.system:")) {
      obj.removeCustomAction(this._actionName);
      obj.addCustomAction(this._actionName);
      obj.onCustomAction.remove(this._customActionHandler);
      obj.onCustomAction.add(this._customActionHandler);
    }
  }

  diplomacySystem(systemTileObj: GameObject, player: Player): boolean {
    let success: boolean = true;
    const skipPlayerSlots: Set<number> =
      this._getExistingCommandTokenOwners(systemTileObj);
    skipPlayerSlots.add(player.getSlot());

    const commandTokenContainers: Array<Container> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (
        nsid === "container.token.command:base/generic" &&
        obj instanceof Container &&
        obj.getOwningPlayerSlot() >= 0 &&
        !skipPlayerSlots.has(obj.getOwningPlayerSlot())
      ) {
        commandTokenContainers.push(obj);
      }
    }

    for (const container of commandTokenContainers) {
      let token: GameObject | undefined = undefined;
      if (container.getNumItems() > 0) {
        const r: number = 2;
        const pos: Vector = systemTileObj
          .getPosition()
          .add([0, 0, 10])
          .add([r * Math.random(), r * Math.random(), 0]);
        token = container.takeAt(0, pos);
      }
      if (!token) {
        const playerSlot: number = container.getOwningPlayerSlot();
        const colorName: string | undefined =
          TI4.playerColor.getSlotColorName(playerSlot);
        if (colorName) {
          Broadcast.broadcastAll(
            `No command tokens available for ${colorName}`,
            Broadcast.ERROR
          );
        }
        success = false;
      }
    }

    return success;
  }

  _getExistingCommandTokenOwners(systemTileObj: GameObject): Set<number> {
    const systemPos: Vector = systemTileObj.getPosition();
    const systemHex: HexType = TI4.hex.fromPosition(systemPos);

    const existingCommandTokenOwners: Set<number> = new Set();
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const nsid: string = NSID.get(obj);
      if (nsid.startsWith("token.command:")) {
        const pos: Vector = obj.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        if (hex === systemHex) {
          existingCommandTokenOwners.add(obj.getOwningPlayerSlot());
        }
      }
    }
    return existingCommandTokenOwners;
  }
}
