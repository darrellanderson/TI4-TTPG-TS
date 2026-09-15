import { MockCard, MockCardHolder } from "ttpg-mock";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { Card } from "@tabletop-playground/api";
import { UpdatorPlayerTFParadigms } from "./updator-player-tf-paradigms";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerTFParadigms;
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
    "card.tf-paradigm:twilights-fall/extortion",
  );
  const c1: Card = MockCard.simple(
    "card.tf-paradigm:twilights-fall/twilight-directive",
  );
  const c2: Card = MockCard.simple(
    "card.tf-paradigm:twilights-fall/twilight-directive",
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
  new UpdatorPlayerTFParadigms().update(gameData);
  expect(gameData.players[0]?.tfParadigms).toEqual([
    "Extortion",
    "Twilight Directive",
  ]);
});

it("assign timestamp", () => {
  new UpdatorPlayerTFParadigms();

  const a: Card = MockCard.simple(
    "card.tf-paradigm:twilights-fall/twilight-directive",
  );
  process.flushTicks();
  const data: string = a.getSavedData("timestamp");
  expect(data.length).toBeGreaterThan(0);
});

it("static", () => {
  const a: Card = MockCard.simple(
    "card.tf-paradigm:twilights-fall/twilight-directive",
  );
  expect(UpdatorPlayerTFParadigms.getTimestamp(a)).toBe(0);
  a.setSavedData("1", "timestamp");
  expect(UpdatorPlayerTFParadigms.getTimestamp(a)).toBe(1);
});
