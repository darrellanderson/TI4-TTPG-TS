import { MockCard, MockCardHolder } from "ttpg-mock";
import { AbstractUI } from "../abstract-ui/abtract-ui";
import { Faction } from "../../lib/faction-lib/faction/faction";
import { PlayerTechSummary } from "../../lib/tech-lib/player-tech-summary/player-tech-summary";
import { Tech } from "../../lib/tech-lib/tech/tech";
import { SingleTechUI } from "./single-tech-ui";

it("constructor/destroy", () => {
  const scale: number = 1;
  const tech: Tech | undefined = TI4.techRegistry.getByNsid(
    "card.technology.blue:base/antimass-deflectors"
  );
  if (!tech) {
    throw new Error("Tech not found");
  }
  const faction: Faction | undefined = undefined;
  const playerTechSummary: PlayerTechSummary = new PlayerTechSummary(10);
  const ui: AbstractUI = new SingleTechUI(
    scale,
    tech,
    faction,
    playerTechSummary
  );
  ui.destroy();
});

it("partial prerequisites", () => {
  new MockCardHolder({
    templateMetadata: "card-holder:base/player-hand",
    owningPlayerSlot: 10,
  });
  MockCard.simple("card.technology.blue:base/antimass-deflectors");

  const scale: number = 1;
  const tech: Tech | undefined = TI4.techRegistry.getByNsid(
    "card.technology.blue:base/gravity-drive"
  );
  if (!tech) {
    throw new Error("Tech not found");
  }

  const faction: Faction | undefined = undefined;
  const playerTechSummary: PlayerTechSummary = new PlayerTechSummary(10);
  expect(playerTechSummary.getOwnedCount("blue")).toBe(1);

  const ui: AbstractUI = new SingleTechUI(
    scale,
    tech,
    faction,
    playerTechSummary
  );
  ui.destroy();
});
