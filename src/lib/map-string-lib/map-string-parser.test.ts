import { MapStringEntry, MapStringParser } from "./map-string-parser";

it("parseEntry (tile only)", () => {
  const entry = new MapStringParser().parseEntry("-1");
  expect(entry).toEqual({ tile: -1 });
});

it("parseEntry (tile + side)", () => {
  const entry = new MapStringParser().parseEntry("1A");
  expect(entry).toEqual({ tile: 1, side: "a" });
});

it("parseEntry (tile + side + rot)", () => {
  const entry = new MapStringParser().parseEntry("1A5");
  expect(entry).toEqual({ tile: 1, side: "a", rot: 5 });
});

it("parseEntry (invalid tile)", () => {
  const entry = new MapStringParser().parseEntry("<invalid>");
  expect(entry).toBeUndefined();
});

it("parseEntry (invalid side)", () => {
  const entry = new MapStringParser().parseEntry("1C");
  expect(entry).toBeUndefined();
});

it("parseEntry (invalid rot)", () => {
  const entry = new MapStringParser().parseEntry("1A7");
  expect(entry).toBeUndefined();
});

it("parse (standard map string)", () => {
  const errors: Array<string> = [];
  const entries = new MapStringParser().parse("1 2A3", errors);
  expect(entries).toEqual([
    { tile: 18 },
    { tile: 1 },
    { rot: 3, side: "a", tile: 2 },
  ]);
  expect(errors.length).toBe(0);
});

it("parse (override first)", () => {
  const errors: Array<string> = [];
  const entries = new MapStringParser().parse("{1} 2A3", errors);
  expect(entries).toEqual([{ tile: 1 }, { rot: 3, side: "a", tile: 2 }]);
  expect(errors.length).toBe(0);
});

it("parse (invalid entry)", () => {
  const errors: Array<string> = [];
  const entries = new MapStringParser().parse("<invalid> 2A3", errors);
  expect(entries).toEqual([{ tile: 18 }, { rot: 3, side: "a", tile: 2 }]);
  expect(errors).toEqual("<invalid>");
});

it("parseOrThrow (parse)", () => {
  const entries = new MapStringParser().parseOrThrow("{1} 2A3");
  expect(entries).toEqual([{ tile: 1 }, { rot: 3, side: "a", tile: 2 }]);
});

it("parseOrThrow (throw)", () => {
  expect(() => {
    new MapStringParser().parseOrThrow("<invalid>");
  }).toThrow();
});
