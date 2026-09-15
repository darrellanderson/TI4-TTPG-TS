import { MockCard, MockCardHolder } from "ttpg-mock";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { Card } from "@tabletop-playground/api";
import { UpdatorPlayerTFGenomes } from "./updator-player-tf-genomes";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerTFGenomes;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  TI4.config.setSources(["twilights-fall"]);

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const a: Card = MockCard.simple("card.tf-edict:twilights-fall/arbitrate");
  const b: Card = MockCard.simple(
    "card.tf-genome:twilights-fall/silver-genome",
  );
  const c1: Card = MockCard.simple(
    "card.tf-genome:twilights-fall/clever-genome",
  );
  const c2: Card = MockCard.simple(
    "card.tf-genome:twilights-fall/clever-genome",
  );
  const d: Card = MockCard.simple(
    "card.technology.bogus:base/_does-not-exist_",
  );

  a.setSavedData("1", "timestamp");
  b.setSavedData("2", "timestamp");
  c1.setSavedData("2", "timestamp"); // tie
  c2.setSavedData("3", "timestamp"); // copy, newer
  d.setSavedData("4", "timestamp");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerTFGenomes().update(gameData);
  expect(gameData.players[0]?.tfGenomes).toEqual([
    "Silver Genome",
    "Clever Genome",
  ]);
});

it("assign timestamp", () => {
  new UpdatorPlayerTFGenomes();

  const a: Card = MockCard.simple(
    "card.tf-genome:twilights-fall/clever-genome",
  );
  process.flushTicks();
  const data: string = a.getSavedData("timestamp");
  expect(data.length).toBeGreaterThan(0);
});

it("static", () => {
  const a: Card = MockCard.simple(
    "card.tf-genome:twilights-fall/clever-genome",
  );
  expect(UpdatorPlayerTFGenomes.getTimestamp(a)).toBe(0);
  a.setSavedData("1", "timestamp");
  expect(UpdatorPlayerTFGenomes.getTimestamp(a)).toBe(1);
});
