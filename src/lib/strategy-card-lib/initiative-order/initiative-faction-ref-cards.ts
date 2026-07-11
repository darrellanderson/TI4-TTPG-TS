import { Faction } from "../../faction-lib/faction/faction";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";
import { TFSetupMatsDraftExt } from "../../twilights-fall-lib/setup/tf-setup-mats-draft-ext";

/**
 * Calculate initiative order for faction reference card on reserved mat slot.
 */
export class InitiativeFactionRefCards {
  _getPriorityForPlayerSlot(playerSlot: number): number | undefined {
    const faction: Faction | undefined = TFSetupMatsDraftExt.getFactionChoice(
      playerSlot,
      "tf-draft-priority",
    );
    if (!faction) {
      return undefined;
    }
    const priority: number | undefined = faction.getPriority();
    return priority;
  }

  getInitiativeOrder(errors: Array<string>): Array<number> {
    const playerSlotToPriority: Map<number, number> = new Map();

    TI4.playerSeats
      .getAllSeats()
      .forEach((playerSeat: PlayerSeatType): void => {
        const playerSlot: number = playerSeat.playerSlot;
        const playerName: string = TI4.playerName.getBySlot(playerSlot);

        let playerPriority: number | undefined =
          this._getPriorityForPlayerSlot(playerSlot);

        if (playerPriority === undefined) {
          errors.push(`no priority for ${playerName}`);
          playerPriority = 1000 + Math.random(); // arbitrary at-end value
        }

        playerSlotToPriority.set(playerSlot, playerPriority);
      });

    const order: Array<number> = [];
    Array.from(playerSlotToPriority.entries())
      .sort((a, b) => a[1] - b[1])
      .forEach(([playerSlot, _priority]: [number, number]): void => {
        order.push(playerSlot);
      });

    return order;
  }
}
