import { GameData } from "../../lib/game-data-lib/game-data/game-data";
import { AllPlayersTechsUI } from "./all-players-techs-ui";

it("constructor", () => {
  const scale: number = 1;
  const gameData: GameData = {
    players: [
      {
        steamName: "my-name",
        technologies: [
          "Antimass Deflectors",
          "long name will be truncated super long text",
        ],
      },
    ],
  };
  new AllPlayersTechsUI(scale, gameData);
});

it("constructor (empty)", () => {
  const scale: number = 1;
  const gameData = {
    players: [{}],
  };
  new AllPlayersTechsUI(scale, gameData);
});
