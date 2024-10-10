import {
  Color,
  GameObject,
  GameWorld,
  Player,
  refObject,
  Vector,
  world,
  Zone,
  ZonePermission,
} from "@tabletop-playground/api";

import { CombatRoll } from "../lib/combat-lib/combat-roll/combat-roll";
import { Faction } from "../lib/faction-lib/faction/faction";
import { System } from "../lib/system-lib/system/system";
import { BuildConsume } from "../lib/build-lib/build-consume";
import { BuildProduce } from "../lib/build-lib/build-produce";

const HEIGHT: number = 4;

export class BuildArea {
  private readonly _obj: GameObject;
  private readonly _zone: Zone;

  private _lastActivatedSystemTileObj: GameObject | undefined;

  // public for testing
  _onUpdateHandler: () => void = () => {
    this.update();
  };

  constructor(obj: GameObject) {
    if (obj.getOwningPlayerSlot() === -1) {
      throw new Error("BuildArea must have an owning player slot.");
    }

    this._obj = obj;
    this._zone = this._findOrCreateZone();

    this._obj.onReleased.add(() => {
      const pos: Vector = this._obj.getPosition();
      pos.z = world.getTableHeight() + HEIGHT / 2;
      this._zone.setPosition(pos);
    });

    this._zone.onBeginOverlap.add(this._onUpdateHandler);
    this._zone.onEndOverlap.add(this._onUpdateHandler);

    TI4.onSystemActivated.add((system: System, player: Player) => {
      if (player.getSlot() === this._obj.getOwningPlayerSlot()) {
        this._lastActivatedSystemTileObj = system.getObj();
      }
    });
  }

  _findOrCreateZone(): Zone {
    const zoneId: string = "zone:" + this._obj.getId();
    let zone: Zone | undefined = world.getZoneById(zoneId);

    if (!zone) {
      const pos: Vector = this._obj.getPosition();
      pos.z = world.getTableHeight() + HEIGHT / 2;

      const scale: Vector = this._obj.getExtent(false, false).multiply(2);
      scale.z = HEIGHT;

      const playerSlot: number = this._obj.getOwningPlayerSlot();
      const color: Color =
        TI4.playerColor.getSlotPlasticColorOrThrow(playerSlot);
      color.a = 0.1;

      zone = world.createZone(pos);
      zone.setAlwaysVisible(true);
      zone.setColor(color);
      zone.setId(zoneId);
      zone.setScale(scale);
      zone.setSlotOwns(playerSlot, true);
      zone.setStacking(ZonePermission.Nobody);
      zone.setObjectVisibility(ZonePermission.Everybody);
      zone.setInserting(ZonePermission.Everybody);
    }

    return zone;
  }

  _getSystemTileHome(): GameObject | undefined {
    const playerSlot: number = this._obj.getOwningPlayerSlot();
    const faction: Faction | undefined =
      TI4.factionRegistry.getByPlayerSlot(playerSlot);
    if (faction) {
      return faction.getHomeSystemTileObj(playerSlot);
    }
    return undefined;
  }

  _getSystemTileLastActivated(): GameObject | undefined {
    return this._lastActivatedSystemTileObj;
  }

  getSummary(objs: Array<GameObject>, combatRoll: CombatRoll): string {
    const produce = new BuildProduce(objs, combatRoll.self.unitAttrsSet);
    const consume = new BuildConsume(objs, combatRoll.getUnitModifierNames());

    const cost: number = 0;
    const spend: number = 0;
    const unitCount: number = 0;

    return `Cost: ${cost}   Resources: ${spend}  #Units: ${unitCount}`;
  }

  update() {
    // CombatRoll finds and applies unit modifiers.
    const combatRoll: CombatRoll = CombatRoll.createCooked({
      rollType: "production",
      hex: "<0,0,0>",
      activatingPlayerSlot: this._obj.getOwningPlayerSlot(),
      rollingPlayerSlot: this._obj.getOwningPlayerSlot(),
    });

    const objs: Array<GameObject> = this._zone.getOverlappingObjects();
    const buildConsume: BuildConsume = new BuildConsume(
      objs,
      combatRoll.getUnitModifierNames()
    );
    const buildProduce: BuildProduce = new BuildProduce(
      objs,
      combatRoll.self.unitAttrsSet
    );

    console.log("------ Build Area update " + this._obj.getOwningPlayerSlot());
    console.log(combatRoll.getUnitModifierNamesWithDescriptions().join("\n"));
    console.log(buildConsume.report());
    console.log(buildProduce.report());
  }
}

export function delayedCreateBuildArea(
  obj: GameObject,
  executionReason: string
): void {
  if (executionReason !== "unittest") {
    process.nextTick(() => {
      new BuildArea(obj);
    });
  }
}
delayedCreateBuildArea(refObject, GameWorld.getExecutionReason());
