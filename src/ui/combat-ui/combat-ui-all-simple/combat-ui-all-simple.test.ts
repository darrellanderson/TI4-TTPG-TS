import { PlayerSlot } from "ttpg-darrell";
import { CombatUIAllSimple } from "./combat-ui-all-simple";

it("constructor/destroy", () => {
  const scale: number = 1;
  const playerSlot: PlayerSlot = 10;
  new CombatUIAllSimple(scale, playerSlot).destroy();
});
