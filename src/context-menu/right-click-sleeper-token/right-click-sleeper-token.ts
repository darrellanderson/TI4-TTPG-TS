import {
  Container,
  GameObject,
  globalEvents,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, Find, GarbageContainer, IGlobal, NSID } from "ttpg-darrell";
import { UnitType } from "../../lib";

const TOKEN_NSID: string = "token.attachment.planet:pok/sleeper-token";
const ACTION_REPLACE_WITH_MECH_INF = "*Replace with Mech/Infantry";
const ACTION_REPLACE_WITH_PDS = "*Replace with PDS";

export class RightClickSleeperToken implements IGlobal {
  _onCustomAction = (
    object: GameObject,
    player: Player,
    identifier: string
  ) => {
    if (identifier === ACTION_REPLACE_WITH_MECH_INF) {
      this._replaceWithMechInf(object, player);
    } else if (identifier === ACTION_REPLACE_WITH_PDS) {
      this._replaceWithPDS(object, player);
    }
  };

  public init(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._maybeAdd(obj);
    }
    globalEvents.onObjectCreated.add((obj: GameObject) => {
      this._maybeAdd(obj);
    });
  }

  _maybeAdd(obj: GameObject): void {
    const nsid: string = NSID.get(obj);
    if (nsid === TOKEN_NSID) {
      this._add(obj);
    }
  }

  _add(obj: GameObject): void {
    obj.removeCustomAction(ACTION_REPLACE_WITH_MECH_INF);
    obj.addCustomAction(ACTION_REPLACE_WITH_MECH_INF);
    obj.removeCustomAction(ACTION_REPLACE_WITH_PDS);
    obj.addCustomAction(ACTION_REPLACE_WITH_PDS);
    obj.onCustomAction.remove(this._onCustomAction);
    obj.onCustomAction.add(this._onCustomAction);
  }

  _replaceWithMechInf(sleeperToken: GameObject, player: Player): void {
    const playerSlot: number = player.getSlot();
    const availalbe: boolean =
      this._hasUnit("mech", playerSlot) &&
      this._hasUnit("infantry", playerSlot);
    if (!availalbe) {
      Broadcast.chatOne(
        player,
        "You do not have both a Mech and Infantry unit available to place",
        Broadcast.ERROR
      );
      return;
    }

    const pos: Vector = sleeperToken.getPosition();
    const d: number = 1.2;
    const pos1: Vector = pos.add([0, -d, 0]);
    const pos2: Vector = pos.add([0, d, 0]);

    this._placeUnit("mech", playerSlot, pos1);
    this._placeUnit("infantry", playerSlot, pos2);
    this._returnToken(sleeperToken);
  }

  _replaceWithPDS(sleeperToken: GameObject, player: Player): void {
    const playerSlot: number = player.getSlot();
    const availalbe: boolean = this._hasUnit("pds", playerSlot);
    if (!availalbe) {
      Broadcast.chatOne(
        player,
        "You do not have a PDS unit available to place",
        Broadcast.ERROR
      );
      return;
    }

    const pos: Vector = sleeperToken.getPosition();
    this._placeUnit("pds", playerSlot, pos);
    this._returnToken(sleeperToken);
  }

  _getUnitContainer(unit: UnitType, playerSlot: number): Container {
    const find: Find = new Find();
    const source: string = unit === "mech" ? "pok" : "base";
    const nsid: string = `container.unit:${source}/${unit}`;
    const skipContained: boolean = true;
    const container: Container | undefined = find.findContainer(
      nsid,
      playerSlot,
      skipContained
    );
    if (!container) {
      throw new Error(
        `Could not find container for unit: ${unit} playerSlot: ${playerSlot}`
      );
    }
    return container;
  }

  _hasUnit(unit: UnitType, playerSlot: number): boolean {
    const container: Container = this._getUnitContainer(unit, playerSlot);
    return container.getNumItems() > 0;
  }

  _placeUnit(unit: UnitType, playerSlot: number, pos: Vector): void {
    const above: Vector = pos.add([0, 0, 10]);
    const container: Container = this._getUnitContainer(unit, playerSlot);
    const unitObj: GameObject | undefined = container.takeAt(0, above);
    if (!unitObj) {
      throw new Error(`Could not take unit: ${unit} playerSlot: ${playerSlot}`);
    }
    unitObj.snapToGround();
  }

  _returnToken(token: GameObject): void {
    GarbageContainer.tryRecycle(token, undefined);
  }
}
