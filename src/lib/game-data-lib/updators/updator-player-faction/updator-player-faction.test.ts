import { MockCardHolder, MockGameObject } from "ttpg-mock";
import { GAME_DATA_UPDATORS } from "../../game-data-updators/game-data-updators";
import { UpdatorPlayerFaction } from "./updator-player-faction";
import { GameData } from "../../game-data/game-data";
import { GameDataUpdator } from "../../game-data-updator/game-data-updator";

it("registered", () => {
  const index: number = GAME_DATA_UPDATORS.findIndex((updator) => {
    return updator instanceof UpdatorPlayerFaction;
  });
  expect(index).toBeGreaterThanOrEqual(0);
});

it("data", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    position: [10, 0, 0],
    owningPlayerSlot: 10,
  });
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    position: [20, 0, 0],
    owningPlayerSlot: 11,
  });
  new MockGameObject({
    position: [10, 0, 0],
    templateMetadata: "sheet.faction:base/arborec",
  });
  new MockGameObject({
    position: [20, 0, 0],
    templateMetadata: "sheet.faction:pok/argent",
  });

  const gameData: GameData = GameDataUpdator.createGameData();
  new UpdatorPlayerFaction().update(gameData);
  expect(gameData).toEqual({
    players: [
      { factionFull: "The Arborec", factionShort: "Arborec" },
      { factionFull: "The Argent Flight", factionShort: "Argent" },
      { factionFull: "", factionShort: "" },
      { factionFull: "", factionShort: "" },
      { factionFull: "", factionShort: "" },
      { factionFull: "", factionShort: "" },
    ],
  });
});
