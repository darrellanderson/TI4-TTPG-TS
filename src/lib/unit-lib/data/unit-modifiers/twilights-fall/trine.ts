import { HexType } from "ttpg-darrell";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { SystemAdjacency } from "../../../../system-lib/system-adjacency/system-adjacency";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { UnitAttrs } from "../../../unit-attrs/unit-attrs";
import { Faction } from "../../../../faction-lib/faction/faction";
import { UnitPlastic } from "../../../unit-plastic";
import { UnitType } from "../../../schema";

export const Trine: UnitModifierSchemaType = {
  name: "Trine",
  description: "SPACE CANNON up to 2 systems away fire",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "tf-action", nsidName: "trine" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "spaceCannonOffense";
  },
  apply: (combatRoll: CombatRoll): void => {
    const adjacency: SystemAdjacency = new SystemAdjacency();

    const hex: HexType = combatRoll.getHex();
    const faction: Faction | undefined = combatRoll.self.faction;
    const adjHexesMax2: Set<HexType> = adjacency.getAdjHexes(hex, faction, 2);

    // Set space cannon range to 2.
    const spaceCannonUnits: Set<UnitType> = new Set();
    combatRoll.self.unitAttrsSet
      .getAll()
      .forEach((unitAttrs: UnitAttrs): void => {
        const spaceCannon: CombatAttrs | undefined = unitAttrs.getSpaceCannon();
        if (spaceCannon) {
          spaceCannonUnits.add(unitAttrs.getUnit());
          spaceCannon.setRange(2);
        }
      });

    const allPlasticsAdjMax2: Array<UnitPlastic> = UnitPlastic.getAll().filter(
      (plastic: UnitPlastic): boolean => {
        const plasticHex: HexType = plastic.getHex();
        return adjHexesMax2.has(plasticHex);
      }
    );
    const spaceCannonPlasticsAdjMax2: Array<UnitPlastic> =
      allPlasticsAdjMax2.filter((plastic: UnitPlastic): boolean => {
        return spaceCannonUnits.has(plastic.getUnit());
      });

    // Reset adjacent unit count to include range 2.
    spaceCannonUnits.forEach((unitType: UnitType): void => {
      combatRoll.self.overrideUnitCountAdj.set(unitType, 0);
    });
    spaceCannonPlasticsAdjMax2.forEach((plastic: UnitPlastic): void => {
      const unitType: UnitType = plastic.getUnit();
      const currentCount: number =
        combatRoll.self.overrideUnitCountAdj.get(unitType) ?? 0;
      combatRoll.self.overrideUnitCountAdj.set(unitType, currentCount + 1);
    });
  },
};
