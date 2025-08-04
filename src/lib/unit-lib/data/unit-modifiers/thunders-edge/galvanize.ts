import { GameObject, Vector, world } from "@tabletop-playground/api";
import { HexType, NSID } from "ttpg-darrell";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { UnitPlastic } from "../../../unit-plastic/unit-plastic";
import { UnitType } from "../../../schema/unit-attrs-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";

export function _getAllGalvanizeTokens(): Array<GameObject> {
  const allGalvanizeTokens: Array<GameObject> = [];
  const tokenNsid: string = "token:thunders-edge:galvanize";
  const skipContained: boolean = true;
  for (const obj of world.getAllObjects(skipContained)) {
    const nsid: string = NSID.get(obj);
    if (nsid === tokenNsid) {
      allGalvanizeTokens.push(obj);
    }
  }
  return allGalvanizeTokens;
}

export const Galvanize: UnitModifierSchemaType = {
  name: "Galvanize",
  description:
    "Galvanized units gain an extra die for combat rolls and unit abilities",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "faction-ability", nsidName: "galvanize" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const combatRollOrUnitAbility: Set<CombatRollType> = new Set([
      "spaceCannonOffense",
      "antiFighterBarrage",
      "spaceCombat",
      "bombardment",
      "spaceCannonDefense",
      "groundCombat",
    ]);
    return combatRollOrUnitAbility.has(combatRoll.getRollType());
  },
  apply: (combatRoll: CombatRoll): void => {
    const combatHex: HexType = combatRoll.getHex();

    const allGalvanizeTokens: Array<GameObject> = _getAllGalvanizeTokens();
    const galvanizeTokens: Array<GameObject> = allGalvanizeTokens.filter(
      (token: GameObject) => {
        const pos: Vector = token.getPosition();
        const hex: HexType = TI4.hex.fromPosition(pos);
        return hex === combatHex;
      }
    );

    galvanizeTokens.forEach((token: GameObject) => {
      const pos: Vector = token.getPosition();
      const plastic: UnitPlastic | undefined = UnitPlastic.getClosestPlastic(
        pos,
        combatRoll.self.unitPlasticHex
      );
      if (plastic) {
        const unit: UnitType = plastic.getUnit();
        const combatAttrs: CombatAttrs | undefined =
          combatRoll.getUnitCombatAttrs(unit);
        if (combatAttrs) {
          combatAttrs.addExtraDice(1);
        }
      }
    });
  },
};
