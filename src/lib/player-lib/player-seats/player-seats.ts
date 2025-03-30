import { CardHolder, Vector, world } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";

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
      if (obj instanceof CardHolder && obj.getOwningPlayerSlot() >= 0) {
        const nsid: string = NSID.get(obj);
        if (nsid === "card-holder:base/player-hand") {
          seats.push({
            cardHolder: obj,
            playerSlot: obj.getOwningPlayerSlot(),
          });
        }
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

  getPlayerSlotBySeatIndex(seatIndex: number): number {
    const seats: Array<PlayerSeatType> = this.getAllSeats();
    return seats[seatIndex]?.playerSlot ?? -1;
  }

  getPlayerSlotBySeatIndexOrThrow(seatIndex: number): number {
    const playerSlot: number = this.getPlayerSlotBySeatIndex(seatIndex);
    if (playerSlot === -1) {
      throw new Error(`Seat index ${seatIndex} not found.`);
    }
    return playerSlot;
  }

  getSeatIndexByPlayerSlot(playerSlot: number): number {
    const seats: Array<PlayerSeatType> = this.getAllSeats();
    return seats.findIndex((seat: PlayerSeatType) => {
      return seat.playerSlot === playerSlot;
    });
  }

  getSeatIndexByPlayerSlotOrThrow(playerSlot: number): number {
    const seatIndex: number = this.getSeatIndexByPlayerSlot(playerSlot);
    if (seatIndex === -1) {
      throw new Error(`Player slot ${playerSlot} not found.`);
    }
    return seatIndex;
  }

  getCardHolderByPlayerSlot(playerSlot: number): CardHolder | undefined {
    const seats: Array<PlayerSeatType> = this.getAllSeats();
    const seat: PlayerSeatType | undefined = seats.find(
      (candidate: PlayerSeatType) => {
        return candidate.playerSlot === playerSlot;
      }
    );
    return seat?.cardHolder;
  }

  getCardHolderByPlayerSlotOrThrow(playerSlot: number): CardHolder {
    const cardHolder: CardHolder | undefined =
      this.getCardHolderByPlayerSlot(playerSlot);
    if (!cardHolder) {
      throw new Error(`Card holder for player slot ${playerSlot} not found.`);
    }
    return cardHolder;
  }
}
