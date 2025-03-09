import { PlayerSlot } from "ttpg-darrell";
import { CombatUIAll } from "./combat-ui-all";

it("constructor/destroy", () => {
  const scale: number = 1;
  const playerSlot: PlayerSlot = 10;
  new CombatUIAll(scale, playerSlot).destroy();
});
