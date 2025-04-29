import { GameData } from "../../lib/game-data-lib/game-data/game-data";
import { StatsUI } from "./stats-ui";

it("constructor/destroy", () => {
  const statsUi: StatsUI = new StatsUI(1);
  statsUi.destroy();
});

it("update", () => {
  const _statsUi: StatsUI = new StatsUI(1);

  const gameData: GameData = {
    players: [
      {
        steamName: "my-name",
        planetTotals: {
          resources: { avail: 1, total: 2 },
          influence: { avail: 3, total: 4 },
          techs: { blue: 0, green: 0, red: 0, yellow: 0 },
          traits: { cultural: 0, hazardous: 0, industrial: 0 },
          legendary: 0,
        },
        commandTokens: {
          tactics: 1,
          strategy: 2,
          fleet: 3,
        },
        tradeGoods: 4,
      },
      {},
    ],
  };
  TI4.events.onGameData.trigger(gameData);
});
