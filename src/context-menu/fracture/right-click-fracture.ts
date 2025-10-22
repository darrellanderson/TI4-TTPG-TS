import {
  Card,
  Color,
  GameObject,
  globalEvents,
  ObjectType,
  Player,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Broadcast, Facing, Find, IGlobal } from "ttpg-darrell";
import { System } from "../../lib/system-lib/system/system";
import { UnitType } from "../../lib/unit-lib/schema/unit-attrs-schema";

const ACTION_DEPLOY_FRACTURE: string = "*Deploy fracture";
const ACTION_FETCH_RELIC: string = "*Fetch relic";

export class RightClickFracture implements IGlobal {
  readonly _onObjectCreated = (obj: GameObject): void => {
    const system: System | undefined = TI4.systemRegistry.getBySystemTileObjId(
      obj.getId()
    );
    if (system && system.getClass() === "fracture") {
      obj.removeCustomAction(ACTION_DEPLOY_FRACTURE);
      if (!Facing.isFaceUp(obj)) {
        obj.addCustomAction(ACTION_DEPLOY_FRACTURE);
      }
      obj.onCustomAction.remove(this._onCustomAction);
      obj.onCustomAction.add(this._onCustomAction);

      if (system.getPlanets().length > 0) {
        obj.removeCustomAction(ACTION_FETCH_RELIC);
        obj.addCustomAction(ACTION_FETCH_RELIC);
      }
    }
  };

  readonly _onCustomAction = (
    obj: GameObject,
    player: Player,
    identifier: string
  ): void => {
    if (identifier === ACTION_DEPLOY_FRACTURE) {
      const playerName: string = TI4.playerName.getByPlayer(player);
      const msg: string = `${playerName} deployed the fracture`;
      const color: Color = world.getSlotColor(player.getSlot());
      Broadcast.chatAll(msg, color);

      this._deployFracture();
    }

    if (identifier === ACTION_FETCH_RELIC) {
      const find: Find = new Find();
      const relicDeck: Card | undefined = find.findDeckOrDiscard("deck-relic");
      if (relicDeck) {
        const card: Card | undefined = relicDeck.takeCards(1);
        if (card) {
          const above: Vector = obj.getPosition().add([0, 0, 5]);
          card.setPosition(above, 1);
          card.setRotation([0, 0, 180], 1);
          card.snapToGround();
        }
      }
    }
  };

  init(): void {
    const skipContained: boolean = false;
    for (const obj of world.getAllObjects(skipContained)) {
      this._onObjectCreated(obj);
    }
    globalEvents.onObjectCreated.add(this._onObjectCreated);
  }

  _deployFracture(): void {
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      const system: System | undefined =
        TI4.systemRegistry.getBySystemTileObjId(obj.getId());
      if (system && system.getClass() === "fracture") {
        obj.removeCustomAction(ACTION_DEPLOY_FRACTURE);
        obj.setObjectType(ObjectType.Regular);
        obj.setRotation([0, 0, 0]);
        obj.setObjectType(ObjectType.Ground);
        this._placeUnits(obj, system.getSystemTileNumber());
      }
    }
  }

  _placeUnits(systemTileObj: GameObject, tile: number): void {
    const unitsWithCounts: { [unit: string]: number } = {};

    if (tile === 901) {
      unitsWithCounts["dreadnought"] = 2;
      unitsWithCounts["destroyer"] = 1;
      unitsWithCounts["infantry"] = 3;
    } else if (tile === 904) {
      unitsWithCounts["carrier"] = 1;
      unitsWithCounts["fighter"] = 4;
      unitsWithCounts["infantry"] = 2;
    } else if (tile === 905) {
      unitsWithCounts["cruiser"] = 2;
      unitsWithCounts["infantry"] = 2;
    }

    const totalCount: number = Object.values(unitsWithCounts).reduce(
      (a, b) => a + b,
      0
    );
    const rotate: number = 360 / totalCount;
    let localPos: Vector = new Vector(5, 0, 10);
    for (const [unit, count] of Object.entries(unitsWithCounts)) {
      for (let i = 0; i < count; i++) {
        const pos: Vector = systemTileObj.localPositionToWorld(localPos);
        const obj: GameObject = this._getUnitPlasticOrThrow(
          unit as UnitType,
          pos
        );
        obj.snapToGround();
        localPos = localPos.rotateAngleAxis(rotate, [0, 0, 1]);
      }
    }
  }

  _getUnitPlasticOrThrow(unit: UnitType, pos: Vector): GameObject {
    const source: string = unit === "mech" ? "pok" : "base";

    /*
    const nsid: string = `container.unit:${source}/${unit}`;

    const find: Find = new Find();
    const skipContained: boolean = true;
    const container: Container | undefined = find.findContainer(
      nsid,
      19,
      skipContained
    );
    if (!container) {
      throw new Error(`Could not find container for ${unit}/19`);
    }

    const takeIndex: number = 0;
    const showAnimation: boolean = false;
    const keep: boolean = true;
    const obj: GameObject | undefined = container.takeAt(
      takeIndex,
      pos,
      showAnimation,
      keep
    );
    if (!obj) {
      throw new Error(`Could not find plastic for ${unit}/19`);
    }
      */

    // takeAt with keep is buggy on released TTPG.
    // TODO remove this when fixed.
    const nsid: string = `unit:${source}/${unit}`;
    const obj: GameObject | undefined = TI4.spawn.spawn(nsid, pos);
    if (!obj) {
      throw new Error(`Could not spawn plastic for ${nsid}`);
    }

    const color: Color = TI4.playerColor.getAnonymousPlasticColor();
    obj.setPrimaryColor(color);
    obj.setOwningPlayerSlot(19); // Neutral

    return obj;
  }
}
