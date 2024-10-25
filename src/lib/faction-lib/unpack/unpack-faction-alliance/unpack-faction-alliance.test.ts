import { Card } from "@tabletop-playground/api";
import { MockCard, MockCardDetails } from "ttpg-mock";

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

  unpack._dealAllianceCardsAndDeleteDeck(deck);
});
