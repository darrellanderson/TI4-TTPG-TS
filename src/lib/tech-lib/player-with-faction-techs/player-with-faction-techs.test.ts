import { Tech } from "../tech/tech";
import { Faction } from "../../faction-lib/faction/faction";
import { PlayerWithFactionTechs } from "./player-with-faction-techs";

it("constructor", () => {
  const faction: Faction | undefined = undefined;
  new PlayerWithFactionTechs(faction);
});

it("_getAllTechs", () => {
  const faction: Faction | undefined = undefined;
  const playerWithFactionTechs: PlayerWithFactionTechs =
    new PlayerWithFactionTechs(faction);
  const techs: Array<Tech> = playerWithFactionTechs._getAllTechs();
  const nsids: Array<string> = techs.map((tech: Tech) => tech.getNsid());

  expect(nsids).toContain("card.technology.green:base/yin-spinner");
});

it("_applyRemoveRules", () => {
  const faction: Faction | undefined = undefined;
  const playerWithFactionTechs: PlayerWithFactionTechs =
    new PlayerWithFactionTechs(faction);
  let techs: Array<Tech> = playerWithFactionTechs._getAllTechs();
  let nsids: Array<string> = techs.map((tech: Tech) => tech.getNsid());

  // ALL techs, including faction techs without replacements applied.
  expect(nsids).toContain("card.technology.green:base/yin-spinner");
  expect(nsids).toContain(
    "card.technology.green:codex.ordinian/yin-spinner.omega"
  );

  techs = playerWithFactionTechs._applyRemoveRules(techs);
  nsids = techs.map((tech: Tech) => tech.getNsid());

  // Removed replacements.
  expect(nsids).not.toContain("card.technology.green:base/yin-spinner");
  expect(nsids).toContain(
    "card.technology.green:codex.ordinian/yin-spinner.omega"
  );
});

it("_pruneOtherFactionTechs", () => {
  const faction: Faction | undefined =
    TI4.factionRegistry.getByNsid("faction:base/sol");
  const playerWithFactionTechs: PlayerWithFactionTechs =
    new PlayerWithFactionTechs(faction);
  let techs: Array<Tech> = playerWithFactionTechs._getAllTechs();
  let nsids: Array<string> = techs.map((tech: Tech) => tech.getNsid());

  // All faction tech.
  expect(nsids).toContain("card.technology.green:base/yin-spinner");
  expect(nsids).toContain(
    "card.technology.unit-upgrade:base/advanced-carrier-2"
  );

  techs = playerWithFactionTechs._pruneOtherFactionTechs(techs);
  nsids = techs.map((tech: Tech) => tech.getNsid());

  // Only faction techs of Sol.
  expect(nsids).not.toContain("card.technology.green:base/yin-spinner");
  expect(nsids).toContain(
    "card.technology.unit-upgrade:base/advanced-carrier-2"
  );
});

it("_pruneOverridenUnitUpgrades", () => {
  const faction: Faction | undefined =
    TI4.factionRegistry.getByNsid("faction:base/sol");
  const playerWithFactionTechs: PlayerWithFactionTechs =
    new PlayerWithFactionTechs(faction);
  let techs: Array<Tech> = playerWithFactionTechs._getAllTechs();
  let nsids: Array<string> = techs.map((tech: Tech) => tech.getNsid());

  // All unit upgrades.
  expect(nsids).toContain(
    "card.technology.unit-upgrade:base/advanced-carrier-2"
  );
  expect(nsids).toContain("card.technology.unit-upgrade:base/carrier-2");

  techs = playerWithFactionTechs._pruneOverridenUnitUpgrades(techs);
  nsids = techs.map((tech: Tech) => tech.getNsid());

  // Faction tech unit upgrade replaces base version.
  expect(nsids).toContain(
    "card.technology.unit-upgrade:base/advanced-carrier-2"
  );
  expect(nsids).not.toContain("card.technology.unit-upgrade:base/carrier-2");
});

it("non-regression test: vuilraith dimensional-tear-2 replaces space-dock-2", () => {
  const faction: Faction | undefined = TI4.factionRegistry.getByNsid(
    "faction:pok/vuilraith"
  );
  expect(faction).toBeDefined();
  expect(faction?.getFactionTechNsids()).toEqual([
    "card.technology.red:pok/vortex",
    "card.technology.unit-upgrade:pok/dimensional-tear-2",
  ]);

  const playerWithFactionTechs: PlayerWithFactionTechs =
    new PlayerWithFactionTechs(faction);
  const techs: Array<Tech> = playerWithFactionTechs.get();
  const nsids: Array<string> = techs.map((tech: Tech) => tech.getNsid());

  const dimensionalTear: Tech | undefined = techs.find(
    (tech: Tech) =>
      tech.getNsid() === "card.technology.unit-upgrade:pok/dimensional-tear-2"
  );
  expect(dimensionalTear).toBeDefined();
  expect(dimensionalTear?.replacesNsidName()).toEqual("space-dock-2");

  expect(nsids).toContain(
    "card.technology.unit-upgrade:pok/dimensional-tear-2"
  );
  expect(nsids).not.toContain("card.technology.unit-upgrade:base/space-dock-2");
});
