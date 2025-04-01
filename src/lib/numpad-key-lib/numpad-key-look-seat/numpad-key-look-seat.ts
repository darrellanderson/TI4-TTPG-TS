import { globalEvents, Player, Vector, world } from "@tabletop-playground/api";
import { PlayerSeatType } from "../../player-lib/player-seats/player-seats";

export class NumpadKeyLookSeat {
  private readonly _onScriptButtonPressed = (
    player: Player,
    index: number,
    ctrl: boolean,
    alt: boolean
  ): void => {
    // Our key?
    if (!ctrl || alt) {
      return;
    }
    const seats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
    const seat: PlayerSeatType | undefined = seats[index - 1];
    if (!seat) {
      return;
    }
    const lookAt: Vector = seat.cardHolder.getPosition();
    lookAt.x = lookAt.x * 0.7; // move towards center
    lookAt.z = world.getTableHeight();

    const lookFrom: Vector = lookAt.add([-10, 0, 70]);
    const rot = lookFrom.findLookAtRotation(lookAt);
    player.setPositionAndRotation(lookFrom, rot);
  };

  constructor() {
    globalEvents.onScriptButtonPressed.add(this._onScriptButtonPressed);
  }

  destroy(): void {
    globalEvents.onScriptButtonPressed.remove(this._onScriptButtonPressed);
  }
}
