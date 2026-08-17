import { AbilitySchemaType } from "../schema/ability-schema";
import { EchoSchemaType } from "../schema/echo-schema";
import { FactionTechSchemaType } from "../schema/faction-tech-schema";
import { GenomeSchemaType } from "../schema/genome-schema";
import { ParadigmSchemaType } from "../schema/paradigm-schema";
import { UnitUpgradeSchemaType } from "../schema/unit-upgrade-schema";
import { Ability } from "./ability";
import { Echo } from "./echo";
import { FactionTech } from "./faction-tech";
import { Genome } from "./genome";
import { Paradigm } from "./paradigm";
import { UnitUpgrade } from "./unit-upgrade";

// Ability Tests

it("ability", () => {
  const schema: AbilitySchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    color: "blue",
    origin: "arborec",
  };
  const ability: Ability = new Ability("my-source", schema);
  expect(ability.getNsid()).toEqual("card.tf-ability:my-source/my-nsid-name");
});

it("getColor", () => {
  const schema: AbilitySchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    color: "blue",
    origin: "empyrean",
  };
  const ability: Ability = new Ability("my-source", schema);
  expect(ability.getColor()).toEqual("blue");
});

it("getOrigin", () => {
  const schema: AbilitySchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    color: "blue",
    origin: "obsidian",
  };
  const ability: Ability = new Ability("my-source", schema);
  expect(ability.getOrigin()).toEqual("obsidian");
});

// Echo Tests

it("echo", () => {
  const schema: EchoSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "creuss",
  };
  const echo: Echo = new Echo("my-source", schema);
  expect(echo.getNsid()).toEqual("card.tf-echo:my-source/my-nsid-name");
});

it("getOrigin", () => {
  const schema: EchoSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "crimson",
  };
  const echo: Echo = new Echo("my-source", schema);
  expect(echo.getOrigin()).toEqual("crimson");
});

// Faction Tech Tests

it("factionTech", () => {
  const schema: FactionTechSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
  };
  const factionTech: FactionTech = new FactionTech("my-source", schema);
  expect(factionTech.getNsid()).toEqual("card.tf-faction-tech:my-source/my-nsid-name");
});

// Genome Tests

it("genome", () => {
  const schema: GenomeSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "arborec",
  };
  const genome: Genome = new Genome("my-source", schema);
  expect(genome.getNsid()).toEqual("card.tf-genome:my-source/my-nsid-name");
});

it("getOrigin", () => {
  const schema: GenomeSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "empyrean",
  };
  const genome: Genome = new Genome("my-source", schema);
  expect(genome.getOrigin()).toEqual("empyrean");
});

// Paradigm Tests

it("paradigm", () => {
  const schema: ParadigmSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "arborec",
  };
  const paradigm: Paradigm = new Paradigm("my-source", schema);
  expect(paradigm.getNsid()).toEqual("card.tf-paradigm:my-source/my-nsid-name");
});

it("getOrigin", () => {
  const schema: ParadigmSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "creuss",
  };
  const paradigm: Paradigm = new Paradigm("my-source", schema);
  expect(paradigm.getOrigin()).toEqual("creuss");
});

// Unit Upgrade Tests

it("unitUpgrade", () => {
  const schema: UnitUpgradeSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "arborec",
  };
  const unitUpgrade: UnitUpgrade = new UnitUpgrade("my-source", schema);
  expect(unitUpgrade.getNsid()).toEqual("card.tf-unit-upgrade:my-source/my-nsid-name");
});

it("getOrigin", () => {
  const schema: UnitUpgradeSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "empyrean",
  };
  const unitUpgrade: UnitUpgrade = new UnitUpgrade("my-source", schema);
  expect(unitUpgrade.getOrigin()).toEqual("empyrean");
});