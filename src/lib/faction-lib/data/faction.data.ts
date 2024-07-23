import { FactionSchemaType } from "../schema/faction-schema";

export const SOURCE_TO_FACTION_DATA: Record<
  string,
  Array<FactionSchemaType>
> = {
  base: [
    {
      nsidName: "arborec",
      name: "The Arborec",
      abbr: "Arborec",
      abilities: ["mitosis"],
      commodities: 3,
      home: 5,
      leaders: {
        agents: ["letani-ospha"],
        commanders: ["dirzuga-rophal"],
        heroes: ["letani-miasmiala"],
        mechs: ["letani-behemoth"],
      },
      promissoryNotes: ["stymie"],
      startingTechs: ["magen-defense-grid"],
      startingUnits: {
        carrier: 1,
        cruiser: 1,
        fighter: 2,
        infantry: 4,
        pds: 1,
        spaceDock: 1,
      },
      techs: ["bioplasmosis", "letani-warrior-2"],
      unitOverrides: ["duha-menaimon", "letani-behemoth", "letani-warrior"],
      extras: [],
    },
  ],
};
