import { Faction } from "lib/faction-lib/faction/faction";
import { ParseFactions } from "./parse-factions";

it("parse", () => {
  const errors: Array<string> = [];
  const factions: Array<Faction> | undefined =
    new ParseFactions().parseFactions("&factions=arborec|sol|_bogus_&", errors);
  if (!factions) {
    throw new Error("factions is undefined");
  }
  const abbrs: Array<string> = factions.map((faction) => faction.getAbbr());
  expect(abbrs).toEqual(["Arborec", "Sol"]);
  expect(errors).toEqual(['unknown faction "_bogus_"']);
});

it("parse (absent)", () => {
  const errors: Array<string> = [];
  const factions: Array<Faction> | undefined =
    new ParseFactions().parseFactions("abc", errors);
  expect(factions).toBeUndefined();
});

it("parse (present, but empty)", () => {
  const errors: Array<string> = [];
  const factions: Array<Faction> | undefined =
    new ParseFactions().parseFactions("&factions=", errors);
  expect(factions).toBeUndefined();
});
