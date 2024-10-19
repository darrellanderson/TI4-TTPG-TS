import { SourceAndPackageIdSchemaType } from "lib/system-lib/schema/basic-types-schema";
import { FactionSchemaType } from "../schema/faction-schema";
import { Faction } from "./faction";

it("constructor", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "my-source",
    packageId: "my-package-id",
  };
  const schema: FactionSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    abbr: "my-abbr",
    abilities: ["my-ability"],
    commodities: 1,
    home: 2,
    leaders: {
      agents: ["my-agent"],
      commanders: ["my-commander"],
      heroes: ["my-hero"],
      mechs: ["my-mech"],
    },
    promissories: ["my-promissory"],
    startingTechs: ["my-starting-tech"],
    startingUnits: { carrier: 3 },
    factionTechs: ["my-faction-tech"],
    unitOverrides: ["my-unit-override", "my-mech"],
    extras: [{ nsid: "my-extra-1" }, { nsid: "my-extra-2", count: 2 }],
  };
  const faction: Faction = new Faction(sourceAndPackageId, schema);

  expect(faction.getAbbr()).toEqual("my-abbr");
  expect(faction.getAbilityNsids()).toEqual([
    "faction-ability:my-source/my-ability",
  ]);
  expect(faction.getAgentNsids()).toEqual([
    "card.leader.agent:my-source/my-agent",
  ]);
  expect(faction.getAllianceNsid()).toEqual(
    "card.alliance:my-source/my-nsid-name"
  );
  expect(faction.getCommanderNsids()).toEqual([
    "card.leader.commander:my-source/my-commander",
  ]);
  expect(faction.getCommodities()).toEqual(1);
  expect(faction.getControlTokenNsid()).toEqual(
    "token.control:my-source/my-nsid-name"
  );
  expect(faction.getExtraCount("my-extra-1")).toEqual(1);
  expect(faction.getExtraCount("my-extra-2")).toEqual(2);
  expect(faction.getExtraCount("my-extra-3")).toEqual(0);
  expect(faction.getExtras()).toEqual(["my-extra-1", "my-extra-2"]);
  expect(faction.getFactionSheetNsid()).toEqual(
    "sheet.faction:my-source/my-nsid-name"
  );
  expect(faction.getFactionTechNsidNames()).toEqual(["my-faction-tech"]);
  expect(faction.getHeroNsids()).toEqual([
    "card.leader.hero:my-source/my-hero",
  ]);
  expect(faction.getHomeSurrogateTileNumber()).toEqual(-1);
  expect(faction.getHomeSystemTileNumber()).toEqual(2);
  expect(faction.getIcon()).toEqual("icon/faction/my-nsid-name.png");
  expect(faction.getIconPackageId()).toEqual("my-package-id");
  expect(faction.getMechNsids()).toEqual([
    "card.leader.mech:my-source/my-mech",
  ]);
  expect(faction.getName()).toEqual("my-name");
  expect(faction.getNsid()).toEqual("faction:my-source/my-nsid-name");
  expect(faction.getPromissoryNsids()).toEqual([
    "card.promissory:my-source/my-promissory",
  ]);
  expect(faction.getStartingUnits()).toEqual({ carrier: 3 });
  expect(faction.getStartingTechNsidNames()).toEqual(["my-starting-tech"]);
  expect(faction.getUnitOverrideNsids()).toEqual([
    "unit:my-source/my-unit-override",
    "card.leader.mech:my-source/my-mech",
  ]);
});

it("constructor (base source get pok mech)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "base",
    packageId: "my-package-id",
  };
  const schema: FactionSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    abbr: "my-abbr",
    abilities: ["my-ability"],
    commodities: 1,
    home: 2,
    homeSurrogate: 3,
    leaders: {
      agents: ["my-agent"],
      commanders: ["my-commander"],
      heroes: ["my-hero"],
      mechs: ["my-mech"],
    },
    promissories: ["my-promissory"],
    startingTechs: ["my-starting-tech"],
    startingUnits: { carrier: 0 },
    factionTechs: ["one", "two"],
    unitOverrides: ["my-unit-override", "my-mech"],
  };
  const faction: Faction = new Faction(sourceAndPackageId, schema);

  expect(faction.getHomeSurrogateTileNumber()).toEqual(3);
  expect(faction.getUnitOverrideNsids()).toEqual([
    "unit:base/my-unit-override",
    "card.leader.mech:pok/my-mech",
  ]);

  // Alliance is also a PoK addition.
  expect(faction.getAllianceNsid()).toEqual("card.alliance:pok/my-nsid-name");
});

it("getHomeSystemTileObj", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "base",
    packageId: "my-package-id",
  };
  const schema: FactionSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    abbr: "my-abbr",
    abilities: ["my-ability"],
    commodities: 1,
    home: 2,
    homeSurrogate: 3,
    leaders: {
      agents: ["my-agent"],
      commanders: ["my-commander"],
      heroes: ["my-hero"],
      mechs: ["my-mech"],
    },
    promissories: ["my-promissory"],
    startingTechs: ["my-starting-tech"],
    startingUnits: { carrier: 0 },
    factionTechs: ["one", "two"],
    unitOverrides: ["my-unit-override", "my-mech"],
  };
  const faction: Faction = new Faction(sourceAndPackageId, schema);
  expect(faction.getHomeSystemTileObj(4)).toBeUndefined();
});

it("getHomeSystemTileObj (bad tile number)", () => {
  const sourceAndPackageId: SourceAndPackageIdSchemaType = {
    source: "base",
    packageId: "my-package-id",
  };
  const schema: FactionSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    abbr: "my-abbr",
    abilities: ["my-ability"],
    commodities: 1,
    home: -123456789,
    homeSurrogate: 3,
    leaders: {
      agents: ["my-agent"],
      commanders: ["my-commander"],
      heroes: ["my-hero"],
      mechs: ["my-mech"],
    },
    promissories: ["my-promissory"],
    startingTechs: ["my-starting-tech"],
    startingUnits: { carrier: 0 },
    factionTechs: ["one", "two"],
    unitOverrides: ["my-unit-override", "my-mech"],
  };
  const faction: Faction = new Faction(sourceAndPackageId, schema);
  expect(faction.getHomeSystemTileObj(4)).toBeUndefined();
});
