import { ChooseTechnologyUI } from "./choose-technology-ui";
import { Faction } from "../../lib/faction-lib/faction/faction";
import { PlayerTechSummary } from "../../lib/tech-lib/player-tech-summary/player-tech-summary";

it("static _getTechColumn", () => {
  const scale: number = 1;
  const faction: Faction | undefined =
    TI4.factionRegistry.getByNsid("faction:base/sol");
  expect(faction).toBeDefined();
  const playerTechSummary: PlayerTechSummary = new PlayerTechSummary(10);
  ChooseTechnologyUI._getTechColumn(
    scale,
    "unit-upgrade",
    faction,
    playerTechSummary
  );
});

it("constructor/destroy", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  new ChooseTechnologyUI(scale, playerSlot).destroy();
});
