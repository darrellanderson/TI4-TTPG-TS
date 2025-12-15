import { PlayerSlot } from "ttpg-darrell";
import z from "zod";

const TurnOrderStateSchema = z
  .object({
    order: z.array(z.number()),
    currentTurn: z.number(),
    passed: z.array(z.number()),
  })
  .strict();
type TurnOrderStateSchemaType = z.infer<typeof TurnOrderStateSchema>;

/**
 * Serialize and deserialize turn order state.
 */
export class SaveRestoreTurnOrder {
  static save(): string {
    const state: TurnOrderStateSchemaType = {
      order: TI4.turnOrder.getTurnOrder(),
      currentTurn: TI4.turnOrder.getCurrentTurn(),
      passed: TI4.turnOrder
        .getTurnOrder()
        .filter((playerSlot: PlayerSlot): boolean => {
          return TI4.turnOrder.getPassed(playerSlot);
        }),
    };
    return JSON.stringify(state);
  }

  static saveAndClearPassed(): string {
    const state: string = SaveRestoreTurnOrder.save();
    for (const playerSlot of TI4.turnOrder.getTurnOrder()) {
      TI4.turnOrder.setPassed(playerSlot, false);
    }
    return state;
  }

  static restore(savedState: string): void {
    const parsed = JSON.parse(savedState);
    const state: TurnOrderStateSchemaType = TurnOrderStateSchema.parse(parsed);
    TI4.turnOrder.setTurnOrder(state.order, "forward", state.currentTurn);
    for (const playerSlot of state.passed) {
      TI4.turnOrder.setPassed(playerSlot, true);
    }
  }
}
