import { MapStringParser } from "../../map-string-lib/map-string/map-string-parser";
import { ParseBaseMap } from "./parse-base-map";

it("parse", () => {
  const config = "base=1&other=other";
  const errors: Array<string> = [];
  const result = new ParseBaseMap().parseBaseMap(config, errors);
  expect(result).toBe("1");
  expect(errors.length).toBe(0);
});

it("parse (empty)", () => {
  const config = "base=";
  const errors: Array<string> = [];
  const result = new ParseBaseMap().parseBaseMap(config, errors);
  expect(result).toBeUndefined();
});

it("parse (missing)", () => {
  const config = "x";
  const errors: Array<string> = [];
  const result = new ParseBaseMap().parseBaseMap(config, errors);
  expect(result).toBeUndefined();
});

it("parse (invalid)", () => {
  const config = "base=~~invalid~~";
  let errors: Array<string> = [];
  new MapStringParser().parse("~~invalid~~", errors);
  expect(errors).toEqual(["~~invalid~~"]);

  errors = [];
  const result = new ParseBaseMap().parseBaseMap(config, errors);
  expect(result).toBeUndefined();
  expect(errors).toEqual(["base map bad tiles: ~~invalid~~"]);
});
