import { HexType, NamespaceId, WeightedChoice } from "ttpg-darrell";
import {
  GenerateSlicesParams,
  SliceTiles,
} from "../generate-slices/generate-slices";
import { SystemTierType } from "../../system-lib/system/system-tier";
import { DraftState } from "../draft-state/draft-state";
import { ParseSlices } from "../parse/parse-slices";

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

// 7p seat index 3,
// 8p seat index 3 and 7
export const MILTY_SLICE_SHAPE_ALT: ReadonlyArray<HexType> = [
  "<0,0,0>", // home system
  "<1,-1,0>", // left
  "<2,0,-2>", // front (pushed forward)
  "<1,0,-1>", // right (pushed forward)
  "<2,-1,-1>", // left-eq
  "<3,-1,-2>", // front-far (pushed forward)
];

export class Milty {
  public static _getGenerateSlicesParams(): GenerateSlicesParams {
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

  public static generateDraftState(
    config: string,
    namespaceId: NamespaceId
  ): DraftState {
    const draftState: DraftState = new DraftState(namespaceId);
    const errors: Array<string> = [];

    const slices: Array<SliceTiles> = new ParseSlices(5).parseSlices(
      config,
      errors
    );

    xxx;

    return draftState;
  }
}
