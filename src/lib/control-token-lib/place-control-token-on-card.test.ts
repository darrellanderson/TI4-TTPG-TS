import { Card } from "@tabletop-playground/api";
import { MockCard, MockCardHolder, MockGameObject } from "ttpg-mock";

import { PlaceControlTokenOnCard } from "./place-control-token-on-card";

import { addObjectTemplatesToMockWorld } from "../../nsid/nsid-to-template-id.test";
beforeEach(() => {
  addObjectTemplatesToMockWorld();
});

it("constructor", () => {
  new PlaceControlTokenOnCard();
});

it("place", () => {
  const placeControlTokenOnCard: PlaceControlTokenOnCard =
    new PlaceControlTokenOnCard();
  const card: Card = new MockCard();
  let success: boolean;

  success = placeControlTokenOnCard.place(card, 3);
  expect(success).toBe(false);

  // Set up faction.
  new MockGameObject({
    templateMetadata: "sheet.faction:base/arborec",
    owningPlayerSlot: 3,
  });
  new MockCardHolder({ owningPlayerSlot: 3 });
  expect(TI4.factionRegistry.getByPlayerSlot(3)).toBeDefined();

  success = placeControlTokenOnCard.place(card, 3);
  expect(success).toBe(true);
});
