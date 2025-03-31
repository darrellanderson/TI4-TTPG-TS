import { Tech } from "../tech/tech";
import { PlayerWithFactionTechs } from "./player-with-faction-techs";

it("constructor", () => {
  new PlayerWithFactionTechs();
});

it("_getAllTechs", () => {
  const playerWithFactionTechs: PlayerWithFactionTechs =
    new PlayerWithFactionTechs();
  const techs: Array<Tech> = playerWithFactionTechs._getAllTechs();
  expect(techs.length).not.toBe(0);
});
