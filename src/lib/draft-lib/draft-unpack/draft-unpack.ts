import { PlayerSeatType } from "lib/player-lib/player-seats/player-seats";
import { DraftState } from "../draft-state/draft-state";
import { GameObject, Player, Vector, world } from "@tabletop-playground/api";
import { Find } from "ttpg-darrell";

export class DraftUnpack {
  private readonly _draftState: DraftState;
  private readonly _find: Find = new Find();

  constructor(draftState: DraftState) {
    this._draftState = draftState;
  }

  movePlayersToSeats(): this {
    const playerCount: number = TI4.config.playerCount;

    // Get the player for each seat.
    const seatIndexToDstPlayer: Map<number, Player> = new Map();
    for (let seatIndex = 0; seatIndex < playerCount; seatIndex++) {
      const playerSlot: number =
        this._draftState.getSeatIndexToPlayerSlot(seatIndex);
      if (playerSlot >= 0) {
        const player: Player | undefined = world.getPlayerBySlot(playerSlot);
        if (player) {
          seatIndexToDstPlayer.set(seatIndex, player);
        }
      }
    }

    // Find unused player slots.
    const seats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    const openSlots: Set<number> = new Set(
      new Array(20).fill(0).map((_, i) => i)
    );
    for (const player of world.getAllPlayers()) {
      openSlots.delete(player.getSlot());
    }
    for (const seat of seats) {
      openSlots.delete(seat.playerSlot);
    }

    // Move players to open slots.
    const openSlotsArray = new Array(...openSlots);
    seatIndexToDstPlayer.forEach((player: Player, seatIndex: number) => {
      const openSlot: number = openSlotsArray.pop();
      player.switchSlot(openSlot);

      const seat: PlayerSeatType | undefined = seats[seatIndex];
      if (seat) {
        const dstSlot: number = seat.playerSlot;
        process.nextTick(() => {
          player.switchSlot(dstSlot);
        });
      }
    });

    return this;
  }

  moveSpeakerToken(): this {
    const nsid: string = "token:base/speaker";
    const speakerToken: GameObject | undefined =
      this._find.findGameObject(nsid);

    const speakerIndex: number = this._draftState.getSpeakerIndex();
    const playerSeats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    const playerSeat: PlayerSeatType | undefined = playerSeats[speakerIndex];

    if (speakerToken && playerSeat) {
      const cardHolderPos: Vector = playerSeat.cardHolder.getPosition();
      const tokenPos: Vector = cardHolderPos.clone();
      tokenPos.x = (tokenPos.x < 0 ? -1 : 1) * 72.5;
      tokenPos.z = world.getTableHeight() + 10;
      speakerToken.setPosition(tokenPos);
      speakerToken.snapToGround();
      console.log("xxx", tokenPos.toString());
    }

    return this;
  }
}
