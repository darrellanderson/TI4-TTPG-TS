import { Faction } from "../../faction/faction";
import { UnpackStartingTech } from "./unpack-starting-tech";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackStartingTech(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});
