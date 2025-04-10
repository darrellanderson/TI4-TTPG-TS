import { Card } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";
import { MockCard, MockCardDetails, MockSnapPoint } from "ttpg-mock";
import { UpdatorObjectives } from "./updator-objectives";
import { UpdatorObjectivesType } from "./updator-objectives-type";

it("constructor", () => {
  new UpdatorObjectives();
});

it("_getRelevantCards", () => {
  MockCard.simple("card.objective.public-1:pok/amass-wealth");
  MockCard.simple("card.objective.public-2:pok/achieve-supremacy");
  MockCard.simple("card.objective.secret:base/adapt-new-strategies");
  MockCard.simple("card.relic:pok/the-obsidian");
  MockCard.simple("card.promissory.white:base/support-for-the-throne");
  MockCard.simple("card.action:base/not-scorable");

  const cards: Array<Card> = new UpdatorObjectives()._getRelevantCards();
  const nsids: Array<string> = cards.map((card) => NSID.get(card));
  expect(nsids).toEqual([
    "card.objective.public-1:pok/amass-wealth",
    "card.objective.public-2:pok/achieve-supremacy",
    "card.objective.secret:base/adapt-new-strategies",
    "card.relic:pok/the-obsidian",
    "card.promissory.white:base/support-for-the-throne",
  ]);
});

it("_getRelevantCards (ignore held)", () => {
  MockCard.simple("card.objective.public-1:pok/amass-wealth");
  MockCard.simple("card.objective.public-2:pok/achieve-supremacy", {
    isHeld: true,
  });
  const cards: Array<Card> = new UpdatorObjectives()._getRelevantCards();
  const nsids: Array<string> = cards.map((card) => NSID.get(card));
  expect(nsids).toEqual(["card.objective.public-1:pok/amass-wealth"]);
});

it("_getRelevantCards (ignore snapped to certain points)", () => {
  MockCard.simple("card.objective.public-1:pok/amass-wealth", {
    snappedToPoint: new MockSnapPoint({ tags: ["card-agenda"] }),
  });
  MockCard.simple("card.objective.public-2:pok/achieve-supremacy", {
    snappedToPoint: new MockSnapPoint({ tags: ["discard-agenda"] }),
  });
  MockCard.simple("card.objective.secret:base/adapt-new-strategies", {
    snappedToPoint: new MockSnapPoint({ tags: ["active-agenda"] }),
  });

  const cards: Array<Card> = new UpdatorObjectives()._getRelevantCards();
  const nsids: Array<string> = cards.map((card) => NSID.get(card));
  expect(nsids).toEqual(["card.objective.public-1:pok/amass-wealth"]);
});

it("_fillObjectivesType", () => {
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.public-1:pok/amass-wealth",
        name: "Amass Wealth",
      }),
    ],
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.public-2:pok/achieve-supremacy",
        name: "Achieve Supremacy",
      }),
    ],
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.secret:base/adapt-new-strategies",
        name: "Adapt New Strategies",
      }),
    ],
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.relic:pok/the-obsidian",
        name: "The Obsidian",
      }),
    ],
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.promissory.white:base/support-for-the-throne",
        name: "Support for the Throne",
      }),
    ],
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.action:base/not-scorable",
        name: "Not Scorable",
      }),
    ],
  });

  const updatorObjectives = new UpdatorObjectives();
  const cards: Array<Card> = updatorObjectives._getRelevantCards();
  expect(cards.length).toBe(5);

  const objectivesType: UpdatorObjectivesType =
    updatorObjectives._fillObjectivesType(cards);
  expect(objectivesType).toEqual({
    Agenda: [],
    Other: ["Support for the Throne"],
    "Public Objectives I": ["Amass Wealth"],
    "Public Objectives II": ["Achieve Supremacy"],
    Relics: ["The Obsidian"],
    "Secret Objectives": ["Adapt New Strategies"],
  });
});
