import { FactionSchemaType } from "../schema/faction-schema";
import { Faction } from "./faction";

it("constructor", () => {
  const schema: FactionSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    abbr: "my-abbr",
    abilities: [],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promissories: [],
    startingTechs: [],
    startingUnits: { carrier: 0 },
    techs: ["one", "two"],
    unitOverrides: [],
  };
  new Faction("my-source", schema);
});
