import { CombatAttrs } from "../../../unit-attrs/combat-attrs";
import { CombatRoll } from "../../../../combat-lib/combat-roll/combat-roll";
import { UnitModifierSchemaType } from "../../../schema/unit-modifier-schema";

export const EvelynDelouis: UnitModifierSchemaType = {
  name: "Evelyn Delouis",
  description: "+1 die to a single GROUND COMBAT roll",
  owner: "self",
  priority: "choose",
  triggers: [{ cardClass: "agent", nsidName: "evelyn-delouis" }],
  applies: (combatRoll: CombatRoll): boolean => {
    return combatRoll.getRollType() === "groundCombat";
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
