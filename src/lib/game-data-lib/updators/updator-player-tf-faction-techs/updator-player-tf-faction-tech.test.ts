import { MockCard, MockCardHolder } from "ttpg-mock";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";
import { Card } from "@tabletop-playground/api";
import { UpdatorPlayerTFFactionTechs } from "./updator-player-tf-faction-tech";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerTFFactionTechs;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  TI4.config.setSources(["twilights-fall"]);

  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  const a: Card = MockCard.simple(
    "card.tf-faction-tech:twilights-fall/wavelength-pink",
  );
  const b: Card = MockCard.simple(
    "card.tf-faction-tech:twilights-fall/wavelength-blue",
  );

  a.setSavedData("1", "timestamp");
  b.setSavedData("2", "timestamp");

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerTFFactionTechs().update(gameData);
  expect(gameData.players[0]?.tfFactionTechs).toEqual([
    "Wavelength: Pink",
    "Wavelength: Blue",
  ]);
});

it("assign timestamp", () => {
  new UpdatorPlayerTFFactionTechs();

  const a: Card = MockCard.simple(
    "card.tf-faction-tech:twilights-fall/wavelength-pink",
  );
  process.flushTicks();
  const data: string = a.getSavedData("timestamp");
  expect(data.length).toBeGreaterThan(0);
});

it("static", () => {
  const a: Card = MockCard.simple(
    "card.tf-ability:twilights-fall/nanomachines",
  );
  expect(UpdatorPlayerTFFactionTechs.getTimestamp(a)).toBe(0);
  a.setSavedData("1", "timestamp");
  expect(UpdatorPlayerTFFactionTechs.getTimestamp(a)).toBe(1);
});
