import { CardHolder, world } from "@tabletop-playground/api";

export type PlayerSeatType = {
  playerSlot: number;
};

export class PlayerSeats {
  getAllSeats(): Array<PlayerSeatType> {
    const seats: Array<PlayerSeatType> = [];
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (
        obj instanceof CardHolder &&
        obj.getOwningPlayerSlot() !== undefined
      ) {
        seats.push({ playerSlot: obj.getOwningPlayerSlot() });
      }
    }
    return seats;
  }
}
