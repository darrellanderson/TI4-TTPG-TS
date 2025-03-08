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
        metadata: "card.alliance:my-source/my-faction",
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

  const faction: Faction | undefined = TI4.factionRegistry.getByPlayerSlot(3);
  if (!faction) {
    throw new Error("Missing faction");
  }
  expect(faction.getName()).toBe("my-faction-name");
  expect(faction.getAllianceNsids()).toEqual([
    "card.alliance:my-source/my-faction",
  ]);

  const recycle = new RecycleCardAlliance();
  expect(recycle.canRecycle(card)).toBe(true);
  expect(recycle.recycle(card)).toBe(true);

  expect(
    cardHolder.getCards().map((inHolderCard) => NSID.get(inHolderCard))
  ).toEqual(["card.alliance:my-source/my-faction"]);
});

it("recycle (not a card)", () => {
  const recycle = new RecycleCardAlliance();
  expect(recycle.canRecycle(new MockGameObject())).toBe(false);
  expect(recycle.recycle(new MockGameObject())).toBe(false);
});
