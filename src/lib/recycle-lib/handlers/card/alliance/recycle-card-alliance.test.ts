import { Card, CardHolder } from "@tabletop-playground/api";
import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
} from "ttpg-mock";
import { NSID } from "ttpg-darrell";

import { Faction } from "../../../../faction-lib/faction/faction";
import { RecycleCardAlliance } from "./recycle-card-alliance";
import { SourceAndPackageIdSchemaType } from "../../../../system-lib/schema/basic-types-schema";

it("recycle", () => {
  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.alliance:my-source/my-faction.omega",
      }),
    ],
  });

  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  TI4.factionRegistry.load(sourceAndPackageId, [
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
      promissories: [],
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

  const recycle = new RecycleCardAlliance();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  expect(cardHolder.getCards().map((card) => NSID.get(card))).toEqual([
    "card.alliance:my-source/my-faction.omega",
  ]);
});

it("recycle (not a card)", () => {
  const recycle = new RecycleCardAlliance();
  expect(recycle.canRecycle(new MockGameObject())).toBe(false);
  expect(recycle.recycle(new MockGameObject())).toBe(false);
});
