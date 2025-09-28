import { MockCard, MockCardHolder } from "ttpg-mock";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerTech } from "./updator-player-tech";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { Card } from "@tabletop-playground/api";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerTech;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const a: Card = MockCard.simple(
    "card.technology.blue:base/antimass-deflectors"
  );
  const b: Card = MockCard.simple("card.technology.blue:base/fleet-logistics");
  const c1: Card = MockCard.simple("card.technology.blue:base/gravity-drive");
  const c2: Card = MockCard.simple("card.technology.blue:base/gravity-drive");
  const d: Card = MockCard.simple(
    "card.technology.bogus:base/_does-not-exist_"
  );

  a.setSavedData("1", "timestamp");
  b.setSavedData("2", "timestamp");
  c1.setSavedData("2", "timestamp"); // tie
  c2.setSavedData("3", "timestamp"); // copy, newer
  d.setSavedData("4", "timestamp");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerTech().update(gameData);
  expect(gameData.players[0]?.technologies).toEqual([
    "Antimass Deflectors",
    "Fleet Logistics",
    "Gravity Drive",
  ]);
});

it("assign timestamp", () => {
  new UpdatorPlayerTech();

  const a: Card = MockCard.simple(
    "card.technology.blue:base/antimass-deflectors"
  );
  process.flushTicks();
  const data: string = a.getSavedData("timestamp");
  expect(data.length).toBeGreaterThan(0);
});

it("static", () => {
  const a: Card = MockCard.simple(
    "card.technology.blue:base/antimass-deflectors"
  );
  expect(UpdatorPlayerTech.getTimestamp(a)).toBe(0);
  a.setSavedData("1", "timestamp");
  expect(UpdatorPlayerTech.getTimestamp(a)).toBe(1);
});
