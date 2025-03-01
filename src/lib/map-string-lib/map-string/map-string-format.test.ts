import { MapStringFormat } from "./map-string-format";
import { MapStringEntry } from "./map-string-parser";

it("constructor", () => {
  new MapStringFormat();
});

it("format", () => {
  const format = new MapStringFormat();
  const entries: Array<MapStringEntry> = [
    { tile: 1, side: "a", rot: 0 },
    { tile: 2 },
  ];
  expect(format.format(entries)).toEqual("{1A0} 2");
});
