import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";
import {
  CommandTokenAllocation,
  CommandTokenTypes,
} from "../../../../command-token-lib/command-token-allocation/command-token-allocation";
import { GameObject } from "@tabletop-playground/api";

export const ArviconRex: UnitModifierSchemaType = {
  name: "Arvicon Rex",
  description:
    "+2 flagship COMBAT against opponent with no token in your fleet pool",
  owner: "self",
  priority: "adjust",
  triggers: [{ cardClass: "unit", nsidName: "arvicon-rex" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.self.hasUnit("flagship");
  },
  apply: (combatRoll: CombatRoll): void => {
    const commandTokenAllocation = new CommandTokenAllocation();
    const playerSlotToCommandTokenTypes: Map<number, CommandTokenTypes> =
      commandTokenAllocation.getPlayerSlotToCommandTokenTypes();
    const commandTokenTypes: CommandTokenTypes | undefined =
      playerSlotToCommandTokenTypes.get(combatRoll.self.playerSlot);
    if (commandTokenTypes) {
      const fleetTokens: Array<GameObject> = commandTokenTypes.fleet;
      for (const fleetToken of fleetTokens) {
        if (
          fleetToken.getOwningPlayerSlot() === combatRoll.opponent.playerSlot
        ) {
          const combatAttrs: CombatAttrs | undefined =
            combatRoll.self.unitAttrsSet
              .getOrThrow("flagship")
              .getSpaceCombatOrThrow();
          combatAttrs.addHit(2);
        }
        break;
      }
    }
  },
};
