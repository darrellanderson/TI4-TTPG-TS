import { Faction } from "../../faction/faction";
import { UnpackFactionExtras } from "./unpack-faction-extras";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid("faction:base/muaat")!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionExtras(faction, playerSlot);
  unpack.unpack();
  unpack.remove();
});
