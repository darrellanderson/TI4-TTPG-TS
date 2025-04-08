import { Card } from "@tabletop-playground/api";
import { CardUtil, Facing } from "ttpg-darrell";
import { MockCard, MockCardDetails } from "ttpg-mock";

import { GameData } from "../../game-data/game-data";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { UpdatorLaws } from "./updator-laws";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorLaws;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  const card: Card = new MockCard({
    cardDetails: [
      new MockCardDetails({
        metadata: "card.agenda:base/representative-government",
        name: "Representative Government",
      }),
    ],
    isFaceUp: true,
  });
  expect(card).toBeInstanceOf(Card);
  const cardName: string = card.getCardDetails().name;
  expect(cardName).toEqual("Representative Government");
  expect(Facing.isFaceUp(card)).toBe(true);

  const cardUtil: CardUtil = new CardUtil();
  const allowFaceDown: boolean = false;
  const rejectSnapPointTags: Array<string> = [];
  expect(cardUtil.isLooseCard(card, allowFaceDown, rejectSnapPointTags)).toBe(
    true
  );

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorLaws().update(gameData);
  expect(gameData.laws).toEqual(["Representative Government"]);
});
