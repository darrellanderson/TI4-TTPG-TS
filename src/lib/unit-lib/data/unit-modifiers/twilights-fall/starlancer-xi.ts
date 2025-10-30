import { HexType } from "ttpg-darrell";
import {
  CombatRoll,
  CombatRollType,
} from "../../../../combat-lib/combat-roll/combat-roll";
import { System, SystemAdjacency } from "../../../../system-lib";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { Faction } from "../../../../faction-lib";
import { Vector } from "@tabletop-playground/api";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";

export const StarlancerXI: UnitModifierSchemaType = {
  name: "Starlancer XI",
  description:
    "Participates in SPACE COMBAT; +1 COMBAT for each in or adjacent anomaly",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "unit", nsidName: "starlancer-xi" }],
  applies: (combatRoll: CombatRoll): boolean => {
    const rollType: CombatRollType = combatRoll.getRollType();
    return (
      (rollType === "spaceCombat" || rollType === "groundCombat") &&
      combatRoll.self.hasUnit("mech")
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    let adjAnomalies: number = 0;

    const hex: HexType = combatRoll.getHex();
    const faction: Faction | undefined = combatRoll.self.faction;
    const adjHexes: Set<HexType> = new SystemAdjacency().getAdjHexes(
      hex,
      faction
    );
    adjHexes.add(hex); // include self hex
    for (const adjHex of adjHexes) {
      const pos: Vector = TI4.hex.toPosition(adjHex);
      const system: System | undefined = TI4.systemRegistry.getByPosition(pos);
      if (system && system.getAnomalies().length > 0) {
        adjAnomalies++;
      }
    }

    const mechAttrs: UnitAttrs =
      combatRoll.self.unitAttrsSet.getOrThrow("mech");
    const spaceCombat: CombatAttrs | undefined = mechAttrs.getSpaceCombat();
    if (spaceCombat) {
      spaceCombat.addHit(adjAnomalies);
    }

    const groundCombat: CombatAttrs | undefined = mechAttrs.getGroundCombat();
    if (groundCombat) {
      groundCombat.addHit(adjAnomalies);
    }
  },
};
