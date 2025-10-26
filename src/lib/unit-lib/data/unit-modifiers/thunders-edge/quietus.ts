import {
  GameObject,
  globalEvents,
  Vector,
  world,
} from "@tabletop-playground/api";
import { Facing, HexType, NSID } from "ttpg-darrell";
import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType, UnitType } from "../../../schema";
import { UnitAttrs } from "../../../unit-attrs";
import { UnitPlastic } from "../../../unit-plastic";

// Track breach tokens and all flagships.
const _breachObjIds: Set<string> = new Set();
const _flagshipObjIds: Set<string> = new Set();

function _maybeAddObjId(obj: GameObject): void {
  const nsid: string = NSID.get(obj);
  const id: string = obj.getId();
  if (nsid === "token.attachment.system:thunders-edge/crimson-breach") {
    _breachObjIds.add(id);
  } else if (nsid === "unit:base/flagship") {
    _flagshipObjIds.add(id); // all flagships, may not have owner yet
  }
}

function _maybeDelObjId(obj: GameObject): void {
  const id: string = obj.getId();
  if (_breachObjIds.has(id)) {
    _breachObjIds.delete(id);
  }
  if (_flagshipObjIds.has(id)) {
    _flagshipObjIds.delete(id);
  }
}

export function quietusInit(): void {
  globalEvents.onObjectCreated.add(_maybeAddObjId);
  globalEvents.onObjectDestroyed.add(_maybeDelObjId);
  world.getAllObjects().forEach((obj: GameObject): void => {
    _maybeAddObjId(obj);
  });
}
quietusInit();

export function _getActiveBreachHexes(): Set<HexType> {
  const activeBreachHexes: Set<HexType> = new Set();
  _breachObjIds.forEach((id: string) => {
    const obj: GameObject | undefined = world.getObjectById(id);
    if (obj && !obj.getContainer() && Facing.isFaceUp(obj)) {
      const pos: Vector = obj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      activeBreachHexes.add(hex);
    }
  });
  return activeBreachHexes;
}

export function _getFlagshipHexes(playerSlot: number): Set<HexType> {
  const flagshipHexes: Set<HexType> = new Set();
  _flagshipObjIds.forEach((id: string) => {
    const obj: GameObject | undefined = world.getObjectById(id);
    if (
      obj &&
      !obj.getContainer() &&
      obj.getOwningPlayerSlot() === playerSlot
    ) {
      const pos: Vector = obj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      flagshipHexes.add(hex);
    }
  });

  return flagshipHexes;
}

export const Quietus: UnitModifierSchemaType = {
  name: "Quietus",
  description:
    "When Quietus is in an active breach, other players' units in active breaches lose unit abilities",
  triggers: [
    {
      cardClass: "unit",
      nsidName: "quietus",
    },
  ],
  owner: "opponent",
  priority: "mutate-late",
  applies: (combatRoll: CombatRoll): boolean => {
    if (
      combatRoll.getRollType() !== "spaceCannonOffense" &&
      combatRoll.getRollType() !== "antiFighterBarrage" &&
      combatRoll.getRollType() !== "bombardment" &&
      combatRoll.getRollType() !== "spaceCannonDefense"
    ) {
      return false; // not a unit ability roll
    }

    const activeBreachHexes: Set<HexType> = _getActiveBreachHexes();
    if (!activeBreachHexes.has(combatRoll.getHex())) {
      return false; // not in an active breach
    }

    const flagshipHexes: Set<HexType> = _getFlagshipHexes(
      combatRoll.opponent.playerSlot
    );
    const quietusInBreach: boolean = Array.from(activeBreachHexes).some((hex) =>
      flagshipHexes.has(hex)
    );
    return quietusInBreach;
  },
  apply: (combatRoll: CombatRoll): void => {
    const activeBreachHexes: Set<HexType> = _getActiveBreachHexes();

    // Adjacent space cannon need to eliminate only units in breaches.
    if (combatRoll.getRollType() === "spaceCannonOffense") {
      combatRoll.self.unitAttrsSet
        .getAll()
        .forEach((unitAttrs: UnitAttrs): void => {
          if (unitAttrs.getSpaceCannon()) {
            const unit: UnitType = unitAttrs.getUnit();

            if (activeBreachHexes.has(combatRoll.getHex())) {
              combatRoll.self.overrideUnitCountHex.set(unit, 0);
            }

            let reduceAdjCount: number = 0;
            combatRoll.self.unitPlasticAdj.forEach(
              (plasticAdj: UnitPlastic): void => {
                if (activeBreachHexes.has(plasticAdj.getHex())) {
                  reduceAdjCount++;
                }
              }
            );
            let count: number = combatRoll.self.getCountAdj(unit);
            count = Math.max(0, count - reduceAdjCount);
            combatRoll.self.overrideUnitCountAdj.set(unit, count);
          }
        });
    }

    // Remove other unit abilities.
    if (activeBreachHexes.has(combatRoll.getHex())) {
      combatRoll.self.unitAttrsSet
        .getAll()
        .forEach((unitAttrs: UnitAttrs): void => {
          unitAttrs.setDisableAntiFighterBarrage(true);
          unitAttrs.setDisableBombardment(true);
          unitAttrs.setDisableSpaceCannonDefense(true);
        });
    }
  },
};
