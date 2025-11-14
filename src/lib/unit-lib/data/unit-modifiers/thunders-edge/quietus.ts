import { GameObject, Vector } from "@tabletop-playground/api";
import { Facing, HexType } from "ttpg-darrell";
import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType, UnitType } from "../../../schema";
import { CombatAttrs, UnitAttrs } from "../../../unit-attrs";
import { UnitPlastic } from "../../../unit-plastic";

export function _getActiveBreachHexes(): Set<HexType> {
  const activeBreachHexes: Set<HexType> = new Set();

  TI4.findTracking.trackNsid(
    "token.attachment.system:thunders-edge/crimson-breach"
  );
  const breachObjs: Array<GameObject> = TI4.findTracking.find(
    "token.attachment.system:thunders-edge/crimson-breach"
  );

  breachObjs.forEach((breachObj: GameObject): void => {
    if (!breachObj.getContainer() && Facing.isFaceUp(breachObj)) {
      const pos: Vector = breachObj.getPosition();
      const hex: HexType = TI4.hex.fromPosition(pos);
      activeBreachHexes.add(hex);
    }
  });
  return activeBreachHexes;
}

export function _getFlagshipHexes(playerSlot: number): Set<HexType> {
  const flagshipHexes: Set<HexType> = new Set();

  TI4.findTracking.trackNsid("unit:base/flagship");
  const flagshipObjs: Array<GameObject> =
    TI4.findTracking.find("unit:base/flagship");

  flagshipObjs.forEach((flagshipObj: GameObject): void => {
    if (
      !flagshipObj.getContainer() &&
      flagshipObj.getOwningPlayerSlot() === playerSlot
    ) {
      const pos: Vector = flagshipObj.getPosition();
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
          const spaceCannon: CombatAttrs | undefined =
            unitAttrs.getSpaceCannon();
          if (spaceCannon) {
            const unit: UnitType = unitAttrs.getUnit();

            // Disable space cannon in hex.
            if (activeBreachHexes.has(combatRoll.getHex())) {
              combatRoll.self.overrideUnitCountHex.set(unit, 0);
            }

            // Disable adjacent space cannons in breaches.
            if (spaceCannon.getRange() > 0) {
              let reduceAdjCount: number = 0;
              combatRoll.self.unitPlasticAdj.forEach(
                (plasticAdj: UnitPlastic): void => {
                  if (
                    plasticAdj.getUnit() === unit &&
                    activeBreachHexes.has(plasticAdj.getHex())
                  ) {
                    reduceAdjCount++;
                  }
                }
              );
              let count: number = combatRoll.self.getCountAdj(unit);
              count = Math.max(0, count - reduceAdjCount);
              combatRoll.self.overrideUnitCountAdj.set(unit, count);
            }
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
