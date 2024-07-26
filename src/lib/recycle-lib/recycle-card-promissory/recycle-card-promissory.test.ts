import { Card, CardHolder } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
} from "ttpg-mock";

import { Faction } from "../../faction-lib/faction/faction";
import { RecycleCardPromissory } from "./recycle-card-promissory";
import { NSID } from "ttpg-darrell";

it("recycle", () => {
  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.promissory:my-source/my-promissory.omega",
      }),
    ],
  });

  TI4.factionRegistry.load("my-source", [
    {
      nsidName: "my-faction",
      name: "my-faction-name",
      abbr: "my-faction-abbr",
      abilities: [],
      commodities: 1,
      home: 2,
      leaders: {
        agents: [],
        commanders: [],
        heroes: [],
        mechs: [],
      },
      promissories: ["my-promissory"],
      startingTechs: [],
      startingUnits: {},
      factionTechs: ["one", "two"],
      unitOverrides: [],
    },
  ]);
  const cardHolder: CardHolder = new MockCardHolder({
    position: [10, 0, 0],
    owningPlayerSlot: 3,
  });
  new MockGameObject({
    position: [10, 0, 0],
    templateMetadata: "sheet.faction:my-source/my-faction",
  });

  const playerSlotToFaction: Map<number, Faction> =
    TI4.factionRegistry.getPlayerSlotToFaction();
  expect(playerSlotToFaction.get(3)?.getName()).toBe("my-faction-name");

  const recycle = new RecycleCardPromissory();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  expect(cardHolder.getCards().map((card) => NSID.get(card))).toEqual([
    "card.promissory:my-source/my-promissory.omega",
  ]);
});

it("recycle (not a card)", () => {
  const recycle = new RecycleCardPromissory();
  expect(recycle.canRecycle(new MockGameObject())).toBe(false);
  expect(recycle.recycle(new MockGameObject())).toBe(false);
});
