import { MockCardHolder } from "ttpg-mock";
import { Faction } from "../../faction/faction";
import { AbstractUnpack } from "./abstract-unpack";
import { CardHolder } from "@tabletop-playground/api";

class MyUnpack extends AbstractUnpack {
  constructor() {
    const faction: Faction = TI4.factionRegistry.getByNsid(
      "faction:bace/arborec"
    )!;
    const playerSlot: number = 10;
    super(faction, playerSlot);
  }
  unpack(): void {}
  remove(): void {}
}

it("getters", () => {
  const unpack = new MyUnpack();

  expect(() => {
    unpack.getPlayerHandHolderOrThrow();
  }).toThrow(/Missing player hand holder/);

  const holder: CardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });

  expect(unpack.getPlayerHandHolderOrThrow()).toEqual(holder);
});
