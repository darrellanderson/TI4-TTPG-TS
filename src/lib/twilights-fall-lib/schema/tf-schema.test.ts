import { AbilitySchema, AbilitySchemaType } from "./ability-schema";
import { GenomeSchema, GenomeSchemaType } from "./genome-schema";
import { UnitUpgradeSchema, UnitUpgradeSchemaType } from "./unit-upgrade-schema";
import { ParadigmSchema, ParadigmSchemaType } from "./paradigm-schema";

it("parse", () => {
  const ability: AbilitySchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    color: "blue",
    origin: "arborec"
  };

  const parsed: AbilitySchemaType = AbilitySchema.parse(ability);
  expect(parsed).toEqual(ability);
});

it("parse", () => {
  const genome: GenomeSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "creuss"
  };

  const parsed: GenomeSchemaType = GenomeSchema.parse(genome);
  expect(parsed).toEqual(genome);
});

it("parse", () => {
  const unitupgrade: UnitUpgradeSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "empyrean"
  };

  const parsed: UnitUpgradeSchemaType = UnitUpgradeSchema.parse(unitupgrade);
  expect(parsed).toEqual(unitupgrade);
});

it("parse", () => {
  const paradigm: ParadigmSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    origin: "obsidian"
  };

  const parsed: ParadigmSchemaType = ParadigmSchema.parse(paradigm);
  expect(parsed).toEqual(paradigm);
});
