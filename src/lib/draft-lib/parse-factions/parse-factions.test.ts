import { Faction } from "lib/faction-lib/faction/faction";
import { ParseFactions } from "./parse-factions";

it("parse", () => {
  const unknown: Array<string> = [];
  const factions: Array<Faction> = new ParseFactions().parseFactions(
    "factions=arborec|sol|_bogus_&",
    unknown
  );
  const abbrs: Array<string> = factions.map((faction) => faction.getAbbr());
  expect(abbrs).toEqual(["Arborec", "Sol"]);
  expect(unknown).toEqual(["_bogus_"]);
});
