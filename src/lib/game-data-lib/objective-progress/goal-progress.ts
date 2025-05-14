import { PlayerSlot } from "ttpg-darrell";
import { GoalCounter } from "./goal-counter";

export type GoalProgressPerPlayerType = {
  value: number;
  success: boolean;
};

export type GoalProgressType = {
  header: string;
  values: Array<GoalProgressPerPlayerType>;
};

function toSeats<T>(playerSlotToT: Map<PlayerSlot, T>): Array<T> {
  const result: Array<T> = [];
  playerSlotToT.forEach((value: T, playerSlot: PlayerSlot) => {
    const seatIndex: number =
      TI4.playerSeats.getSeatIndexByPlayerSlot(playerSlot);
    result[seatIndex] = value;
  });
  return result;
}

export class GoalProgress {
  private readonly _goalCounter: GoalCounter = new GoalCounter();

  flagshipOrWarSun(needed: number): GoalProgressType {
    return {
      header: "Flagship or War Sun",
      values: toSeats<number>(this._goalCounter.countFlagshipsAndWarSuns()).map(
        (value: number): GoalProgressPerPlayerType => {
          return {
            value: value,
            success: value >= needed,
          };
        }
      ),
    };
  }
}
