import { MockGameObject } from "ttpg-mock";
import {
  GenerateSlices,
  GenerateSlicesParams,
  Slice,
  SliceInProgress,
} from "./generate-slices";
import { SystemTierType } from "../../system-lib/system/system-tier";
import { System } from "../../system-lib/system/system";
import { Milty } from "../drafts/milty";

// Systems must exist for registry to know about them.
beforeEach(() => {
  for (const tile of TI4.systemRegistry.getAllSystemTileNumbers()) {
    const nsid: string | undefined =
      TI4.systemRegistry.tileNumberToSystemTileObjNsid(tile);
    if (nsid) {
      MockGameObject.simple(nsid);
    }
  }
});

describe("SliceInProgress", () => {
  it("should initialize with correct makeup and size", () => {
    const makeup: Array<SystemTierType> = ["low", "med", "high"];
    const sliceInProgress = new SliceInProgress(makeup);
    expect(sliceInProgress.getSystems()).toEqual([]);
    expect(sliceInProgress.getNextRemainingTier()).toBeDefined();
  });

  it("should add systems correctly", () => {
    const makeup: Array<SystemTierType> = ["low", "med"];
    const sliceInProgress = new SliceInProgress(makeup);
    const system1: System | undefined =
      TI4.systemRegistry.getBySystemTileNumber(19);
    const system2: System | undefined =
      TI4.systemRegistry.getBySystemTileNumber(20);
    if (!system1 || !system2) {
      throw new Error("system not found");
    }

    sliceInProgress.addSystem(system1);
    sliceInProgress.addSystem(system2);

    expect(sliceInProgress.getSystems()).toEqual([system1, system2]);
  });

  it("should throw error when adding too many systems", () => {
    const makeup: Array<SystemTierType> = ["low"];
    const sliceInProgress = new SliceInProgress(makeup);
    const system1: System | undefined =
      TI4.systemRegistry.getBySystemTileNumber(19);
    const system2: System | undefined =
      TI4.systemRegistry.getBySystemTileNumber(20);
    if (!system1 || !system2) {
      throw new Error("system not found");
    }
    sliceInProgress.addSystem(system1);
    expect(() => sliceInProgress.addSystem(system2)).toThrow(
      "too many systems added"
    );
  });

  it("should return the next remaining tier", () => {
    const makeup: Array<SystemTierType> = ["low", "med"];
    const sliceInProgress = new SliceInProgress(makeup);
    expect(sliceInProgress.getNextRemainingTier()).toBe("low");
  });

  it("should check if a tier is remaining", () => {
    const makeup: Array<SystemTierType> = ["low", "med"];
    const sliceInProgress = new SliceInProgress(makeup);
    expect(sliceInProgress.hasRemainingTier("low")).toBe(true);
    expect(sliceInProgress.hasRemainingTier("high")).toBe(false);
  });

  it("should remove a remaining tier", () => {
    const makeup: Array<SystemTierType> = ["low", "med"];
    const sliceInProgress = new SliceInProgress(makeup);
    sliceInProgress.removeRemainingTier("low");
    expect(sliceInProgress.hasRemainingTier("low")).toBe(false);
  });

  it("should throw error when removing a non-existing tier", () => {
    const makeup: Array<SystemTierType> = ["low", "med"];
    const sliceInProgress = new SliceInProgress(makeup);
    expect(() => sliceInProgress.removeRemainingTier("high")).toThrow(
      "system tier (high) not in remaining makeup"
    );
  });
});

it("constructor", () => {
  new GenerateSlices({
    sliceCount: 1,
    sliceMakeup: ["high"],
    sliceShape: ["<0,0,0>", "<1,0,-1>"],
  });
});

it("constructor (makeup, shape mismatch", () => {
  expect(() => {
    new GenerateSlices({
      sliceCount: 1,
      sliceMakeup: ["high", "med"],
      sliceShape: ["<0,0,0>", "<1,0,-1>"],
    });
  }).toThrow();
});

it("generateSlices", () => {
  const generator = new GenerateSlices({
    sliceCount: 6,
    sliceMakeup: ["high", "med", "low", "red"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>", "<3,0,-3>", "<4,0,-4>"],
    minAlphaWormholes: 1,
    minBetaWormholes: 1,
    minLegendary: 1,
  });
  const slices = generator.generateSlices();
  expect(slices.length).toBe(6);
});

it("_getShuffledSystems", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high"],
    sliceShape: ["<0,0,0>", "<1,0,-1>"],
  });
  const systems: Array<System> = generateSlices._getShuffledSystems();
  expect(systems).toBeDefined();
});

it("_getSystemsForTier", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  const systems: Array<System> = generateSlices._getShuffledSystems();
  const systemsForTier: Array<System> = generateSlices._getSystemsForTier(
    systems,
    "high"
  );
  expect(systems).toBeDefined();
  expect(systemsForTier).not.toEqual(systems);
});

it("_getSystemsForTier (none in tier)", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  const system: System | undefined =
    TI4.systemRegistry.getBySystemTileNumber(19);
  if (!system) {
    throw new Error("system not found");
  }
  const systems: Array<System> = [system];
  const systemsForTier: Array<System> = generateSlices._getSystemsForTier(
    systems,
    "high"
  );
  expect(systems).toBeDefined();
  expect(systemsForTier).toEqual(systems);
});

it("_getSystemsForTier (none)", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  const systems: Array<System> = [];
  expect(() => {
    generateSlices._getSystemsForTier(systems, "high");
  }).toThrow();
});

it("_getShortestSliceWithTier", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  generateSlices._getShortestSliceWithTier("high");
});

it("_score (multiple legendaries)", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  const sliceInProgress = new SliceInProgress(["high", "med"]);
  let system: System | undefined;

  system = TI4.systemRegistry.getBySystemTileNumber(65);
  if (system) {
    sliceInProgress.addSystem(system);
  }

  system = TI4.systemRegistry.getBySystemTileNumber(66);
  if (system) {
    generateSlices._score(sliceInProgress, system);
  }
});

it("_score (multiple wormholes1Gwq)", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  const sliceInProgress = new SliceInProgress(["high", "med"]);
  let system: System | undefined;

  system = TI4.systemRegistry.getBySystemTileNumber(25);
  if (system) {
    sliceInProgress.addSystem(system);
  }

  system = TI4.systemRegistry.getBySystemTileNumber(26);
  if (system) {
    generateSlices._score(sliceInProgress, system);
  }
});

it("_promoteWormholesAndLegendaries", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
    minAlphaWormholes: 1,
    minBetaWormholes: 1,
    minLegendary: 1,
  });
  const systems: Array<System> = TI4.systemRegistry.getAllSystemsWithObjs();
  const promoted: Array<System> =
    generateSlices._promoteWormholesAndLegendaries(systems);
  expect(promoted.length).toBe(3);
});

it("_promoteWormholesAndLegendaries (defaults)", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  const systems: Array<System> = TI4.systemRegistry.getAllSystemsWithObjs();
  const promoted: Array<System> =
    generateSlices._promoteWormholesAndLegendaries(systems);
  expect(promoted.length).toBe(0);
});

it("_hasAdjacentAnomalies", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med"],
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
    sliceMakeup: ["high", "med"],
    sliceShape: ["<0,0,0>", "<1,0,-1>", "<2,0,-2>"],
  });
  const slice: Array<number> = [19, 20, 21];
  expect(() => {
    generateSlices._hasAdjacentAnomalies(slice);
  }).toThrow();
});

it("_separateAnomalies", () => {
  const generateSlices = new GenerateSlices({
    sliceCount: 0,
    sliceMakeup: ["high", "med", "low"],
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
    sliceMakeup: ["high"],
    sliceShape: ["<0,0,0>", "<1,0,-1>"],
  });
  const permuted: Array<number> | undefined = generateSlices._permutator(
    slice,
    inspector
  );
  expect(permuted).toEqual([20, 19]);
});

it("milty", () => {
  const params: GenerateSlicesParams = new Milty().getGenerateSlicesParams();
  const generateSlices = new GenerateSlices(params);
  const slices: Array<Slice> = generateSlices.generateSlices();
  expect(slices.length).toBe(6);
});
