import { CardHolder, Vector, world } from "@tabletop-playground/api";

export type PlayerSeatType = {
  cardHolder: CardHolder;
  playerSlot: number;
};

export class PlayerSeats {
  getAllSeats(): Array<PlayerSeatType> {
    const seats: Array<PlayerSeatType> = [];

    // Find all seats.
    const skipContained: boolean = true;
    for (const obj of world.getAllObjects(skipContained)) {
      if (
        obj instanceof CardHolder &&
        obj.getOwningPlayerSlot() !== undefined
      ) {
        seats.push({
          cardHolder: obj,
          playerSlot: obj.getOwningPlayerSlot(),
        });
      }
    }

    // Sort by clockwise order.
    seats.sort((a: PlayerSeatType, b: PlayerSeatType) => {
      const aPos: Vector = a.cardHolder.getPosition();
      const bPos: Vector = b.cardHolder.getPosition();
      const aAngle: number =
        (Math.atan2(aPos.x, aPos.y) * (180 / Math.PI) + 360) % 360;
      const bAngle: number =
        (Math.atan2(bPos.x, bPos.y) * (180 / Math.PI) + 360) % 360;
      return bAngle - aAngle;
    });

    return seats;
  }
}
