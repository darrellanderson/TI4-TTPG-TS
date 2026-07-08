import { TFUnpackFaction } from "./tf-unpack-faction";

it("constructor", () => {
  const faction = TI4.factionRegistry.getByNsidName("tf-red");
  new TFUnpackFaction(faction, 10);
});

it("getColorNameFromFaction", () => {
  const faction = TI4.factionRegistry.getByNsidName("tf-red");
  const unpackFaction = new TFUnpackFaction(faction, 10);
  const colorName = unpackFaction._getColorNameFromFaction();
  expect(colorName).toBe("red");
});
