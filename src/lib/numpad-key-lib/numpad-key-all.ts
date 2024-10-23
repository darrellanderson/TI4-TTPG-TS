import { IGlobal } from "ttpg-darrell";
import { NumpadKeySpawn } from "./numpad-key-spawn";

export class NumpadKeyAll implements IGlobal {
  init(): void {
    new NumpadKeySpawn({
      1: "token:base/tradegood-commodity-1",
      2: "token:base/fighter-1",
      3: "token:base/infantry-1",
    });
  }
}
