import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import {
  CommandTokenAllocation,
  CommandTokenLib,
} from "../../../../command-token-lib/command-token-lib";
import { GameObject } from "@tabletop-playground/api";

export const ArviconRex: UnitModifierSchemaType = {
  name: "Arvicon Rex",
  description:
    "+2 flagship COMBAT against opponent with no token in your fleet pool",
  isCombat: true,
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "flagship", nsidName: "arvicon-rex" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    const commandTokenLib = new CommandTokenLib();
    const playerSlotToCommandTokenAllocations: Map<
      number,
      CommandTokenAllocation
    > = commandTokenLib.getPlayerSlotToCommandTokenAllocations();
    const commandTokenAllocation: CommandTokenAllocation | undefined =
      playerSlotToCommandTokenAllocations.get(combatRoll.self.playerSlot);
    if (commandTokenAllocation) {
      const fleetTokens: Array<GameObject> = commandTokenAllocation.fleet;
      for (const fleetToken of fleetTokens) {
        if (
          fleetToken.getOwningPlayerSlot() === combatRoll.opponent.playerSlot
        ) {
          const combatAttrs: CombatAttrs | undefined =
            combatRoll.self.unitAttrsSet
              .getOrThrow("flagship")
              .getSpaceCombatOrThrow();
          combatAttrs.addHit(-2);
        }
        break;
      }
    }
  },
};
