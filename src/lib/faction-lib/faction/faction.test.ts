import { FactionSchemaType } from "../schema/faction-schema";
import { Faction } from "./faction";

it("constructor", () => {
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
    startingUnits: { carrier: 0 },
    techs: ["one", "two"],
    unitOverrides: ["my-unit-override", "my-mech"],
  };
  const faction: Faction = new Faction("my-source", schema);

  expect(faction.getAbbr()).toEqual("my-abbr");
  expect(faction.getAbilityNsids()).toEqual([
    "faction-ability:my-source/my-ability",
  ]);
  expect(faction.getAgentNsids()).toEqual([
    "card.leader.agent:my-source/my-agent",
  ]);
  expect(faction.getCommanderNsids()).toEqual([
    "card.leader.commander:my-source/my-commander",
  ]);
  expect(faction.getCommodities()).toEqual(1);
  expect(faction.getHeroNsids()).toEqual([
    "card.leader.hero:my-source/my-hero",
  ]);
  expect(faction.getHomeSurrogateTileNumber()).toEqual(-1);
  expect(faction.getHomeSystemTileNumber()).toEqual(2);
  expect(faction.getMechNsids()).toEqual([
    "card.leader.mech:my-source/my-mech",
  ]);
  expect(faction.getName()).toEqual("my-name");
  expect(faction.getNsid()).toEqual("faction:my-source/my-nsid-name");
  expect(faction.getPromissoryNsids()).toEqual([
    "card.promissory:my-source/my-promissory",
  ]);
  expect(faction.getUnitOverrideNsids()).toEqual([
    "unit:my-source/my-unit-override",
    "card.leader.mech:my-source/my-mech",
  ]);
});

it("constructor (base source get pok mech)", () => {
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
    techs: ["one", "two"],
    unitOverrides: ["my-unit-override", "my-mech"],
  };
  const faction: Faction = new Faction("base", schema);

  expect(faction.getHomeSurrogateTileNumber()).toEqual(3);
  expect(faction.getUnitOverrideNsids()).toEqual([
    "unit:base/my-unit-override",
    "card.leader.mech:pok/my-mech",
  ]);
});
