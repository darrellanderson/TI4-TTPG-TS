import { IGlobal } from "ttpg-darrell";
import { NumpadKeySpawn } from "../numpad-key-spawn/numpad-key-spawn";
import { NumpadKeyRecycle } from "../numpad-key-recycle/numpad-key-recycle";
import { NumpadKeyLookSeat } from "../numpad-key-look-seat/numpad-key-look-seat";

export class NumpadKeyAll implements IGlobal {
  init(): void {
    new NumpadKeyLookSeat(); // ctrl + numpad 1 to 8 (seat count)
    new NumpadKeySpawn({
      1: "token:base/tradegood-commodity-1",
      2: "token:base/fighter-1",
      3: "token:base/infantry-1",
    });
    new NumpadKeyRecycle(10); // 10 is zero key
  }
}
