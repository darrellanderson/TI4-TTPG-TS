import { Card } from "@tabletop-playground/api";
import { NSID } from "ttpg-darrell";
import {
  MockCard,
  MockCardDetails,
  MockCardHolder,
  MockGameObject,
  MockSnapPoint,
} from "ttpg-mock";
import { UpdatorObjectives } from "./updator-objectives";
import { UpdatorObjectivesType } from "./updator-objectives-type";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

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
    isFaceUp: true,
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.public-2:pok/achieve-supremacy",
        name: "Achieve Supremacy",
      }),
    ],
    isFaceUp: true,
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.secret:base/adapt-new-strategies",
        name: "Adapt New Strategies",
      }),
    ],
    isFaceUp: true,
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.relic:pok/the-obsidian",
        name: "The Obsidian",
      }),
    ],
    isFaceUp: true,
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.promissory.white:base/support-for-the-throne",
        name: "Support for the Throne",
      }),
    ],
    isFaceUp: true,
  });
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.action:base/not-scorable",
        name: "Not Scorable",
      }),
    ],
    isFaceUp: true,
  });

  const updatorObjectives = new UpdatorObjectives();
  const cards: Array<Card> = updatorObjectives._getRelevantCards();
  expect(cards.length).toBe(5);

  const objectivesType: UpdatorObjectivesType =
    updatorObjectives._fillObjectivesType(cards);
  expect(objectivesType).toEqual({
    Agenda: [],
    Other: ["Support for the Throne", "Breakthrough"],
    "Public Objectives I": ["Amass Wealth"],
    "Public Objectives II": ["Achieve Supremacy"],
    Relics: ["The Obsidian"],
    "Secret Objectives": ["Adapt New Strategies"],
  });
});

it("_fillObjectivesType (secret made public)", () => {
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.secret:base/secret-1",
        name: "secret-1",
      }),
    ],
    isFaceUp: true,

    snappedToPoint: new MockSnapPoint({
      parentObject: MockGameObject.simple("mat:base/objective-1"),
    }),
  });

  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.secret:base/secret-2",
        name: "secret-2",
      }),
    ],
    isFaceUp: true,

    snappedToPoint: new MockSnapPoint({
      parentObject: MockGameObject.simple("mat:base/objective-2"),
    }),
  });

  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.secret:base/secret-3",
        name: "secret-3",
      }),
    ],
    isFaceUp: true,

    snappedToPoint: new MockSnapPoint({
      parentObject: MockGameObject.simple("mat:base/agenda-laws"),
    }),
  });

  const updatorObjectives = new UpdatorObjectives();
  const cards: Array<Card> = updatorObjectives._getRelevantCards();
  expect(cards.length).toBe(3);

  const objectivesType: UpdatorObjectivesType =
    updatorObjectives._fillObjectivesType(cards);
  expect(objectivesType).toEqual({
    Agenda: [],
    Other: ["Breakthrough"],
    "Public Objectives I": ["secret-1", "secret-2", "secret-3"],
    "Public Objectives II": [],
    Relics: [],
    "Secret Objectives": [],
  });
});

it("update", () => {
  // Establish seat.
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
    position: [-100, 0, 0],
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 11,
    position: [-200, 0, 0],
  });

  const cardHolder = new MockCardHolder({
    templateMetadata: "card-holder:base/player-scoring",
    owningPlayerSlot: 10,
  });

  // Secret in scoring card holder.
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.secret:base/adapt-new-strategies",
        name: "Adapt New Strategies",
      }),
    ],
    isFaceUp: true,

    cardHolder,
  });

  // Public with a control token.
  new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.objective.public-1:pok/amass-wealth",
        name: "Amass Wealth",
      }),
    ],
    isFaceUp: true,

    position: [100, 0, 0],
  });
  new MockGameObject({
    templateMetadata: "token.control:base/arborec",
    owningPlayerSlot: 11,
    position: [100, 0, 0],
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorObjectives().update(gameData);

  expect(gameData).toEqual({
    objectives: {
      Agenda: [],
      Other: ["Breakthrough"],
      "Public Objectives I": ["Amass Wealth"],
      "Public Objectives II": [],
      Relics: [],
      "Secret Objectives": ["Adapt New Strategies"],
    },
    players: [
      { objectives: ["Adapt New Strategies"] },
      { objectives: ["Amass Wealth"] },
      { objectives: [] },
      { objectives: [] },
      { objectives: [] },
      { objectives: [] },
    ],
  });
});
