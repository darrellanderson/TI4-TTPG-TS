import { TFUnpackFaction } from "./tf-unpack-faction";

it("constructor", () => {
  const faction = TI4.factionRegistry.getByNsidName("tf-red");
  new TFUnpackFaction(faction, 10);
});
