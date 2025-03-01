import { HexType } from "ttpg-darrell";
import { MapStringHex } from "./map-string-hex";

const FIRST_RING: Array<HexType> = [
  "<1,0,-1>",
  "<0,1,-1>",
  "<-1,1,0>",
  "<-1,0,1>",
  "<0,-1,1>",
  "<1,-1,0>",
];

const FOURTH_RING: Array<HexType> = [
  "<4,0,-4>",
  "<3,1,-4>",
  "<2,2,-4>",
  "<1,3,-4>",
  "<0,4,-4>",
  "<-1,4,-3>",
  "<-2,4,-2>",
  "<-3,4,-1>",
  "<-4,4,0>",
  "<-4,3,1>",
  "<-4,2,2>",
  "<-4,1,3>",
  "<-4,0,4>",
  "<-3,-1,4>",
  "<-2,-2,4>",
  "<-1,-3,4>",
  "<0,-4,4>",
  "<1,-4,3>",
  "<2,-4,2>",
  "<3,-4,1>",
  "<4,-4,0>",
  "<4,-3,-1>",
  "<4,-2,-2>",
  "<4,-1,-3>",
];

// test hex to idx
it("hexToIndex : test central hex", () => {
  expect(new MapStringHex().hexToIndex("<0,0,0>")).toBe(0);
});

it("hexToIndex : test first ring", () => {
  const mapStringHex = new MapStringHex();
  FIRST_RING.forEach((hex, i): void => {
    expect(mapStringHex.hexToIndex(hex)).toBe(i + 1);
  });
});

it("hexToIndex : test fourth ring", () => {
  const mapStringHex = new MapStringHex();
  FOURTH_RING.forEach((hex, i): void => {
    expect(mapStringHex.hexToIndex(hex)).toBe(i + 37);
  });
});

// test idx to hex
it("indexToHex : test central hex", () => {
  expect(new MapStringHex().indexToHex(0)).toEqual("<0,0,0>");
});

it("indexToHex : test first ring", () => {
  const mapStringHex = new MapStringHex();
  FIRST_RING.forEach((hex, i): void => {
    expect(mapStringHex.indexToHex(i + 1)).toEqual(hex);
  });
});

it("indexToHex : test fourth ring", () => {
  const mapStringHex = new MapStringHex();
  FOURTH_RING.forEach((hex, i): void => {
    expect(mapStringHex.indexToHex(i + 37)).toEqual(hex);
  });
});
