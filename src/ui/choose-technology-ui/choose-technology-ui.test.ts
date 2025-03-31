import { ChooseTechnologyUI } from "./choose-technology-ui";
import { Faction } from "../../lib/faction-lib/faction/faction";

it("static _getTechColumn", () => {
  const scale: number = 1;
  const faction: Faction | undefined =
    TI4.factionRegistry.getByNsid("faction:base/sol");
  expect(faction).toBeDefined();
  ChooseTechnologyUI._getTechColumn(scale, "unit-upgrade", faction);
});

it("constructor/destroy", () => {
  const scale: number = 1;
  const playerSlot: number = 10;
  new ChooseTechnologyUI(scale, playerSlot).destroy();
});
