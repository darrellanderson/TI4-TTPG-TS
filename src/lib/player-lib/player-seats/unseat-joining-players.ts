import { globalEvents, Player, world } from "@tabletop-playground/api";
import { IGlobal, PlayerSlot } from "ttpg-darrell";
import { PlayerSeatType } from "./player-seats";

/**
 * When a player joins the game, TTPG places them in a "seat" (unassigned owned
 * cardholder).  It tries to restore seats on rejoin but got a report of it
 * putting players in the wrong seat after host lost internet and restarted.
 *
 * When a player joins, pull them into an open slot without a cardholder.
 */
export class UnseatJoiningPlayers implements IGlobal {
  onPlayerJoinedHandler = (player: Player): void => {
    this._delayedMaybeUnseatPlayer(player);
  };

  init(): void {
    globalEvents.onPlayerJoined.add(this.onPlayerJoinedHandler);

    for (const player of world.getAllPlayers()) {
      this._delayedMaybeUnseatPlayer(player);
    }
  }

  destroy(): void {
    globalEvents.onPlayerJoined.remove(this.onPlayerJoinedHandler);
  }

  /**
   * Wait a tick before unseating to let current player slot settle.
   *
   * @param player
   */
  _delayedMaybeUnseatPlayer(player: Player): void {
    process.nextTick(() => {
      // We waited a tick, validate player is still valid before attempting to unseat.
      if (player.isValid()) {
        this._maybeUnseatPlayer(player);
      }
    });
  }

  /**
   * Unseat the player if they are in a cardholder seat.
   *
   * @param player
   */
  _maybeUnseatPlayer(player: Player): void {
    const cardHolderSeats: Set<PlayerSlot> = this._getAllCardHolderSeats();
    const playerSlot: PlayerSlot = player.getSlot();
    if (cardHolderSeats.has(playerSlot)) {
      console.log(
        `_maybeUnseatPlayer: player ${playerSlot} ("${player.getName()}") is in a cardholder seat`,
      );
      this._unseatPlayer(player);
    } else {
      console.log(
        `_maybeUnseatPlayer: player ${playerSlot} ("${player.getName()}") is not in a cardholder seat`,
      );
    }
  }

  _unseatPlayer(player: Player): void {
    const oldSeat: PlayerSlot = player.getSlot();
    const newSeat: PlayerSlot | undefined = this._getOneOpenSeat();
    if (newSeat === undefined) {
      console.warn(
        `No open seat available to unseat player from old seat ${oldSeat}`,
      );
      return;
    }

    console.log(
      `Unseating player from old seat ${oldSeat} to new seat ${newSeat}`,
    );
    player.switchSlot(newSeat);

    // Make sure the switch worked (otherwise compeating unseats this frame can fail)
    if (player.getSlot() !== newSeat) {
      console.warn("Unseat player did not take effect immediately");
    }

    // It takes a tick for the assigned cardholder to clear, but it is doing
    // so in testing so leave it alone.
  }

  /**
   * Return an array of player slots assigned to cardholders.
   */
  _getAllCardHolderSeats(): Set<PlayerSlot> {
    const cardHolderSeatsArray: Array<PlayerSlot> = TI4.playerSeats
      .getAllSeats()
      .map((playerSeatType: PlayerSeatType): PlayerSlot => {
        return playerSeatType.playerSlot;
      });
    console.log(`Cardholder seats: ${cardHolderSeatsArray.join(", ")}`);
    return new Set(cardHolderSeatsArray);
  }

  /**
   * Return an array of player slots currently in-use by players.
   *
   * @returns
   */
  _getAllOccupiedSeats(): Set<PlayerSlot> {
    const occupiedSeatsArray: Array<PlayerSlot> = world
      .getAllPlayers()
      .map((player: Player): PlayerSlot => {
        return player.getSlot();
      });
    return new Set(occupiedSeatsArray);
  }

  _getAllOpenSeats(): Array<PlayerSlot> {
    const allSeats: Array<PlayerSlot> = new Array(20)
      .fill(-1)
      .map((_, index) => index as PlayerSlot);

    const cardHolderSeats: Set<PlayerSlot> = this._getAllCardHolderSeats();
    const occupiedSeats: Set<PlayerSlot> = this._getAllOccupiedSeats();

    const allOpenSeats: Array<PlayerSlot> = allSeats.filter(
      (seat: PlayerSlot): boolean => {
        return !cardHolderSeats.has(seat) && !occupiedSeats.has(seat);
      },
    );
    return allOpenSeats;
  }

  _getOneOpenSeat(): PlayerSlot | undefined {
    const openSeats: Array<PlayerSlot> = this._getAllOpenSeats();
    return openSeats.length > 0 ? openSeats[0] : undefined;
  }
}
