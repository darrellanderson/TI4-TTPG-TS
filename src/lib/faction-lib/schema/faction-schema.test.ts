import { FactionSchema, FactionSchemaType } from "./faction-schema";

it("parse", () => {
  const schema: FactionSchemaType = {
    nsidName: "my-nsid-name",
    name: "my-name",
    abbr: "my-abbr",
    abilities: [],
    commodities: 0,
    factionTechs: ["one", "two"],
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
    unitOverrides: [],
  };
  FactionSchema.parse(schema);
});

it("parse (invalid schema)", () => {
  expect(() => {
    FactionSchema.parse({
      name: "my-name",
      nsidName: "@@invalid!!",
      abilities: [],
      commodities: 0,
      factionTechs: ["one", "two"],
      home: 0,
      leaders: {
        agents: [],
        commanders: [],
        heroes: [],
        mechs: [],
      },
      promssories: [],
      startingTechs: [],
      startingUnits: { carrier: 0 },
      unitOverrides: [],
      extras: [{ nsid: "extra-nsid", count: 0 }],
    });
  }).toThrow();
});
