import { HexType, WeightedChoice } from "ttpg-darrell";
import { GenerateSlicesParams } from "../generate-slices/generate-slices";
import { SystemTierType } from "../../system-lib/system/system-tier";

export const MILTY_SLICE_MAKEUP: ReadonlyArray<SystemTierType> = [
  "high",
  "med",
  "low",
  "red",
  "red",
];

export const MILTY_SLICE_SHAPE: ReadonlyArray<HexType> = [
  "<0,0,0>", // home system
  "<1,-1,0>", // left
  "<1,0,-1>", // front
  "<0,1,-1>", // right
  "<2,-1,-1>", // left-eq
  "<2,0,-2>", // front-far
];

export class Milty {
  public getGenerateSlicesParams(): GenerateSlicesParams {
    return {
      sliceCount: 6,
      sliceMakeup: MILTY_SLICE_MAKEUP,
      sliceShape: MILTY_SLICE_SHAPE,
      minAlphaWormholes: new WeightedChoice<number>([
        { weight: 1, value: 2 },
        { weight: 1, value: 3 },
      ]).choice(),
      minBetaWormholes: new WeightedChoice<number>([
        { weight: 1, value: 2 },
        { weight: 1, value: 3 },
      ]).choice(),
      minLegendary: new WeightedChoice<number>([
        { weight: 1, value: 1 },
        { weight: 1, value: 2 },
      ]).choice(),
    };
  }
}
