import {
  Color,
  GameObject,
  refObject,
  Vector,
  world,
  Zone,
  ZonePermission,
} from "@tabletop-playground/api";
import { CombatRoll } from "lib/combat-lib/combat-roll/combat-roll";

const HEIGHT: number = 4;

export class BuildArea {
  private readonly _obj: GameObject;
  private readonly _zone: Zone;

  constructor(obj: GameObject) {
    this._obj = obj;
    this._zone = this._findOrCreateZone();

    this._obj.onReleased.add(() => {
      this._moveZone;
    });

    this._zone.onBeginOverlap.add(() => {
      this.update();
    });
    this._zone.onEndOverlap.add(() => {
      this.update();
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

  _moveZone() {
    const pos: Vector = this._obj.getPosition();
    pos.z = world.getTableHeight() + HEIGHT / 2;
    this._zone.setPosition(pos);
  }

  update() {
    // CombatRoll finds and applies unit modifiers.
    const combatRoll: CombatRoll = CombatRoll.createCooked({
      rollType: "production",
      hex: "<0,0,0>",
      activatingPlayerSlot: this._obj.getOwningPlayerSlot(),
      rollingPlayerSlot: this._obj.getOwningPlayerSlot(),
    });

    console.log("------ Build Area update " + this._obj.getOwningPlayerSlot());
    console.log(combatRoll.getUnitModifierNamesWithDescriptions().join("\n"));
  }
}

const obj: GameObject = refObject;
process.nextTick(() => {
  new BuildArea(obj);
});
