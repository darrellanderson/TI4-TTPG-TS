import { MockGameObject } from "ttpg-mock";
import { GenerateSlices } from "./generate-slices";

it("_hasAdjacentAnomalies", () => {
  MockGameObject.simple("tile.system:base/19");
  MockGameObject.simple("tile.system:base/20");
  MockGameObject.simple("tile.system:base/41"); // anomaly
  MockGameObject.simple("tile.system:base/42"); // anomaly

  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: [],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  let slice: Array<number>;

  slice = [19, 20]; // no anomalies
  expect(generateSlices._hasAdjacentAnomalies(slice)).toBe(false);

  slice = [41, 42]; // both anomalies
  expect(generateSlices._hasAdjacentAnomalies(slice)).toBe(true);
});

it("_hasAdjacentAnomalies (slice length mismatch)", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: [],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  const slice: Array<number> = [19, 20, 21];
  expect(() => {
    generateSlices._hasAdjacentAnomalies(slice);
  }).toThrow();
});

it("_separateAnomalies", () => {
  MockGameObject.simple("tile.system:base/19");
  MockGameObject.simple("tile.system:base/41"); // anomaly
  MockGameObject.simple("tile.system:base/42"); // anomaly

  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: [],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>", "<3,0,-3>"],
  });

  const slice: Array<number> = [19, 41, 42];
  let separated: Array<number>;

  // With shuffline (do a few times to be more likely to work).
  for (let i = 0; i < 10; i++) {
    separated = generateSlices._separateAnomalies(slice);
    expect(separated[1]).toEqual(19);
  }

  // Without shuffling.
  separated = generateSlices._separateAnomalies(slice, false);
  expect(separated[1]).toEqual(19);

  // Again but
  expect(() => {
    generateSlices._separateAnomalies([]);
  }).toThrow();
});

it("_permutator", () => {
  const slice: Array<number> = [19, 20];
  const inspector = (slice: Array<number>): boolean => {
    return slice[0] === 20;
  };

  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: [],
    sliceShape: [],
  });
  const permuted: Array<number> | undefined = generateSlices._permutator(
    slice,
    inspector
  );
  expect(permuted).toEqual([20, 19]);
});
