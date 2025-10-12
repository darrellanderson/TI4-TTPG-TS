import { SourceAndPackageIdSchemaType } from "../../system-lib/schema/basic-types-schema";
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
    breakthroughs: [
      { breakthrough: "my-breakthrough", techEquivalence: ["red", "blue"] },
    ],
    commodities: 1,
    home: 2,
    leaders: {
      agents: ["my-agent"],
      commanders: ["my-commander"],
      heroes: ["my-hero"],
      mechs: ["my-mech"],
    },
    promissories: ["my-promissory"],
    startingTechs: ["antimass-deflectors"], // looks up in tech registry
    startingUnits: { carrier: 3 },
    factionTechs: ["plasma-scoring"], // looks up in tech registry
    unitOverrides: ["my-unit-override", "my-mech"],
    extras: [{ nsid: "my-extra-1" }, { nsid: "my-extra-2", count: 2 }],
    isExcludeFromDraft: true,
  };
  const faction: Faction = new Faction(sourceAndPackageId, schema);

  expect(faction.getAbbr()).toEqual("my-abbr");
  expect(faction.getAbilityNsidNames()).toEqual(["my-ability"]);
  expect(faction.getAbilityNsids()).toEqual([
    "faction-ability:my-source/my-ability",
  ]);
  expect(faction.getAgentNsids()).toEqual([
    "card.leader.agent:my-source/my-agent",
  ]);
  expect(faction.getAllianceNsids()).toEqual([
    "card.alliance:my-source/my-nsid-name",
  ]);
  expect(faction.getBreakthroughNsids()).toEqual([
    "card.breakthrough:my-source/my-breakthrough",
  ]);
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
  expect(faction.getFactionTechNsids()).toEqual([
    "card.technology.red:base/plasma-scoring",
  ]);
  expect(faction.getHeroNsids()).toEqual([
    "card.leader.hero:my-source/my-hero",
  ]);
  expect(faction.getHomeSurrogateTileNumber()).toEqual(-1);
  expect(faction.getHomeImg()).toEqual("tile/system/tile-002.png");
  expect(faction.getHomeImgPackageId()).toEqual("my-package-id");
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
  expect(faction.getSource()).toEqual("my-source");
  expect(faction.getStartingUnits()).toEqual({ carrier: 3 });
  expect(faction.getStartingTechNsids().sort()).toEqual([
    "card.technology.blue:base/antimass-deflectors",
  ]);
  expect(faction.getUnitOverrideNsids()).toEqual([
    "unit:my-source/my-unit-override",
    "card.leader.mech:my-source/my-mech",
  ]);
  expect(faction.isExcludeFromDraft()).toEqual(true);
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
  expect(faction.getAllianceNsids()).toEqual([
    "card.alliance:pok/my-nsid-name",
  ]);
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

it("rewrite alliance omega source", () => {
  const yin: Faction = TI4.factionRegistry.getByNsid("faction:base/yin")!;
  const allianceNsids: Array<string> = yin.getAllianceNsids();
  expect(allianceNsids.sort()).toEqual([
    "card.alliance:codex.vigil/yin.omega",
    "card.alliance:pok/yin",
  ]);
});

it("rewrite hero omega source", () => {
  const xxcha: Faction = TI4.factionRegistry.getByNsid("faction:base/xxcha")!;
  const heroNsids: Array<string> = xxcha.getHeroNsids();
  expect(heroNsids.sort()).toEqual([
    "card.leader.hero:codex.vigil/xxekir-grom.omega",
    "card.leader.hero:pok/xxekir-grom",
  ]);
});

it("rewrite promissory omega source", () => {
  const arborec: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  const promissoryNsids: Array<string> = arborec.getPromissoryNsids();
  expect(promissoryNsids.sort()).toEqual([
    "card.promissory:base/stymie",
    "card.promissory:codex.ordinian/stymie.omega",
  ]);
});

it("inject extras", () => {
  const arborec: Faction = TI4.factionRegistry.getByNsid(
    "faction:base/arborec"
  )!;
  expect(arborec.getExtras()).not.toContain("my-extra");
  expect(arborec.getExtraCount("my-extra")).toEqual(0);

  arborec.injectExtras({ "my-extra": 3 });
  expect(arborec.getExtras()).toContain("my-extra");
  expect(arborec.getExtraCount("my-extra")).toEqual(3);
});
