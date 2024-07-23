import { FactionSchema, FactionSchemaType } from "./faction-schema";

it("parse", () => {
  const schema: FactionSchemaType = {
    name: "my-name",
    nsidName: "my-nsid-name",
    abilities: [],
    commodities: 0,
    home: 0,
    leaders: {
      agents: [],
      commanders: [],
      heroes: [],
      mechs: [],
    },
    promssoryNotes: [],
    startingTechs: [],
    startingUnits: { carrier: 0 },
    techs: [],
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
      home: 0,
      leaders: {
        agents: [],
        commanders: [],
        heroes: [],
        mechs: [],
      },
      promssoryNotes: [],
      startingTechs: [],
      startingUnits: { carrier: 0 },
      techs: [],
      unitOverrides: [],
      extras: [{ nsid: "extra-nsid", count: 0 }],
    });
  }).toThrow();
});
