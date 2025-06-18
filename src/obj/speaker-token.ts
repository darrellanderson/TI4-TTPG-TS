import { GameObject, Player, refObject } from "@tabletop-playground/api";
import { PlayerSeatType } from "lib/player-lib/player-seats/player-seats";
import { Broadcast } from "ttpg-darrell";

const ACTION_NAME = "*Choose Random Player";

refObject.addCustomAction(ACTION_NAME);

refObject.onCustomAction.add(
  (_obj: GameObject, _player: Player, actionName: string) => {
    if (actionName === ACTION_NAME) {
      const seats: Array<PlayerSeatType> = TI4.playerSeats.getAllSeats();
      const choice: number = Math.floor(Math.random() * seats.length);
      const seat: PlayerSeatType | undefined = seats[choice];
      if (seat) {
        const playerSlot: number = seat.playerSlot;
        const playerName: string =
          TI4.playerColor.getSlotColorNameOrThrow(playerSlot);
        Broadcast.broadcastAll(`Speaker token chooses ${playerName}`);
      }
    }
  }
);
