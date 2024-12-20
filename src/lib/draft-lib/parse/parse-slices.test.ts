import { SliceTiles } from "../generate-slices/generate-slices";
import { ParseSlices } from "./parse-slices";

it("parse", () => {
  const errors: Array<string> = [];
  const slices: Array<SliceTiles> | undefined = new ParseSlices(5).parseSlices(
    "slices=1,2,3,4,5|6,7,8,9,10&",
    errors
  );
  expect(errors).toEqual([]);
  expect(slices).toEqual([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
  ]);
});

it("parse (wrong tile count)", () => {
  const errors: Array<string> = [];
  const slices: Array<SliceTiles> | undefined = new ParseSlices(5).parseSlices(
    "1,2,3,4,5,6",
    errors
  );
  expect(errors).toEqual(['slice "1,2,3,4,5,6" has 6 tiles, expected 5']);
  expect(slices).toBeUndefined();
});

it("parse (tile not a number)", () => {
  const errors: Array<string> = [];
  const slices: Array<SliceTiles> | undefined = new ParseSlices(5).parseSlices(
    "1,2,3,4,x",
    errors
  );
  expect(errors).toEqual(['slice "1,2,3,4,x" has invalid tile number']);
  expect(slices).toBeUndefined();
});
