import { IGlobal } from "ttpg-darrell";
import { NumpadKeySpawn } from "../numpad-key-spawn/numpad-key-spawn";
import { NumpadKeyRecycle } from "../numpad-key-recycle/numpad-key-recycle";
import { NumpadKeyLookSeat } from "../numpad-key-look-seat/numpad-key-look-seat";
import { NumpadKeyLookActiveSystem } from "../numpad-key-look-active-system/numpad-key-look-active-system";
import { NumpadKeyLookMap } from "../numpad-key-look-map/numpad-key-look-map";
import { NumpadKeyLookMySeat } from "../numpad-key-look-my-seat/numpad-key-look-my-seat";
import { NumpadKeyLookScoring } from "../numpad-key-look-scoring/numpad-key-look-scoring";

export class NumpadKeyAll implements IGlobal {
  init(): void {
    new NumpadKeyLookSeat(); // ctrl + numpad 1 to 8 (seat count)
    new NumpadKeySpawn({
      1: "token:base/tradegood-commodity-1",
      2: "token:base/fighter-1",
      3: "token:base/infantry-1",
    });
    new NumpadKeyLookActiveSystem(5);
    new NumpadKeyLookMap(6);
    new NumpadKeyLookScoring(7);
    new NumpadKeyLookMySeat(9);
    new NumpadKeyRecycle(10); // 10 is zero key
    // Unused: 4 (ui), 8 (agenda)
  }
}
