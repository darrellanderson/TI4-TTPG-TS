import { Faction } from "lib/faction-lib/faction/faction";
import { ParseFactions } from "./parse-factions";

it("parse", () => {
  const errors: Array<string> = [];
  const factions: Array<Faction> = new ParseFactions().parseFactions(
    "factions=arborec|sol|_bogus_&",
    errors
  );
  const abbrs: Array<string> = factions.map((faction) => faction.getAbbr());
  expect(abbrs).toEqual(["Arborec", "Sol"]);
  expect(errors).toEqual(['unknown faction "_bogus_"']);
});

it("parse (absent)", () => {
  const errors: Array<string> = [];
  const factions: Array<Faction> = new ParseFactions().parseFactions(
    "abc",
    errors
  );
  expect(factions).toEqual([]);
});
