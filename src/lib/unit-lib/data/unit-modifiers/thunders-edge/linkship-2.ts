import { CombatRoll } from "../../../../combat-lib";
import { UnitModifierSchemaType, UnitType } from "../../../schema";
import { CombatAttrs } from "../../../unit-attrs";
import { LinkshipCount, _countLinkship } from "./linkship";

export const Linkship2: UnitModifierSchemaType = {
  name: "Linkship II",
  description:
    "Linkships get SPACE CANNON of a structure in the space area, linkships can share structures",
  triggers: [
    {
      cardClass: "technology.unit-upgrade",
      nsidName: "linkship-2",
    },
  ],
  owner: "self",
  priority: "choose",
  applies: (combatRoll: CombatRoll): boolean => {
    if (combatRoll.getRollType() !== "spaceCannonOffense") {
      return false;
    }
    const linkshipCount: LinkshipCount = _countLinkship(combatRoll, false);
    return (
      linkshipCount.linkshipPdsHex > 0 ||
      linkshipCount.linkshipPdsAdj > 0 ||
      linkshipCount.linkshipSpaceDockHex > 0 ||
      linkshipCount.linkshipSpaceDockAdj > 0
    );
  },
  apply: (combatRoll: CombatRoll): void => {
    const pds: CombatAttrs | undefined = combatRoll.getUnitCombatAttrs("pds");
    const spaceDock: CombatAttrs | undefined =
      combatRoll.getUnitCombatAttrs("space-dock");

    const linkshipCount: LinkshipCount = _countLinkship(combatRoll, false);

    combatRoll.self.overrideUnitCountHex.set("pds", linkshipCount.pdsHex);
    combatRoll.self.overrideUnitCountHex.set(
      "space-dock",
      linkshipCount.spaceDockHex
    );
    combatRoll.self.overrideUnitCountAdj.set("pds", linkshipCount.pdsAdj);
    combatRoll.self.overrideUnitCountAdj.set(
      "space-dock",
      linkshipCount.spaceDockAdj
    );

    if (pds) {
      let linkshipPdsCount: number = linkshipCount.linkshipPdsHex;
      if (pds.getRange() > 0) {
        linkshipPdsCount += linkshipCount.linkshipPdsAdj;
      }
      if (linkshipPdsCount > 0) {
        combatRoll.self.addSyntheticUnit(
          {
            name: "Linkship (pds)",
            unit: "linkship-pds" as UnitType,
            spaceCannon: {
              hit: pds.getHit(),
              dice: pds.getDice(),
              rerollMisses: pds.getRerollMisses(),
            },
          },
          linkshipPdsCount
        );
      }
    }

    if (spaceDock) {
      let linkshipSpaceDockCount: number = linkshipCount.linkshipSpaceDockHex;
      if (spaceDock.getRange() > 0) {
        linkshipSpaceDockCount += linkshipCount.linkshipSpaceDockAdj;
      }
      if (linkshipSpaceDockCount > 0) {
        combatRoll.self.addSyntheticUnit(
          {
            name: "Linkship (space dock)",
            unit: "linkship-space-dock" as UnitType,
            spaceCannon: {
              hit: spaceDock.getHit(),
              dice: spaceDock.getDice(),
              rerollMisses: spaceDock.getRerollMisses(),
            },
          },
          linkshipSpaceDockCount
        );
      }
    }
  },
};
