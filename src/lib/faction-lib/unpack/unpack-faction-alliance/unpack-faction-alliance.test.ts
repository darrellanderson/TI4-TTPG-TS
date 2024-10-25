import { Card } from "@tabletop-playground/api";
import { MockCard, MockCardDetails, MockCardHolder } from "ttpg-mock";

import { Faction } from "../../faction/faction";
import { UnpackFactionAlliance } from "./unpack-faction-alliance";

it("unpack/remove", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionAlliance(faction, playerSlot);
  expect(() => {
    unpack.unpack();
  }).toThrow(/Missing alliance cards/);
  unpack.remove();
});

it("_dealAllianceCardsAndDeleteDeck", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionAlliance(faction, playerSlot);

  const deck: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({ metadata: "card.alliance:pok/arborec" }),
      new MockCardDetails({ metadata: "_other_" }),
    ],
  });

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: playerSlot,
  });

  unpack._dealAllianceCardsAndDeleteDeck(deck);
});

it("remove (find card)", () => {
  const faction: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const playerSlot: number = 10;

  const unpack = new UnpackFactionAlliance(faction, playerSlot);

  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({ metadata: "card.alliance:pok/arborec" }),
    ],
  });

  expect(card.isValid()).toBe(true);
  unpack.remove();
  expect(card.isValid()).toBe(false);
});
