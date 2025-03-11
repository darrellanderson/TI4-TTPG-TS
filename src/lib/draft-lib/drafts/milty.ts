import { NamespaceId, WeightedChoice } from "ttpg-darrell";

import { DraftState } from "../draft-state/draft-state";
import {
  GenerateSlicesParams,
  SliceShape,
} from "../generate-slices/generate-slices";
import { SystemTierType } from "../../system-lib/system/system-tier";
import { IDraft } from "./idraft";

export const MILTY_SLICE_MAKEUP: ReadonlyArray<SystemTierType> = [
  "high",
  "med",
  "low",
  "red",
  "red",
];

export const MILTY_SLICE_SHAPE: SliceShape = [
  "<0,0,0>", // home system
  "<1,-1,0>", // left
  "<1,0,-1>", // front
  "<0,1,-1>", // right
  "<2,-1,-1>", // left-eq
  "<2,0,-2>", // front-far
];

// 7p seat index 3,
// 8p seat index 3 and 7
export const MILTY_SLICE_SHAPE_ALT: SliceShape = [
  "<0,0,0>", // home system
  "<1,-1,0>", // left
  "<2,0,-2>", // front (pushed forward)
  "<1,0,-1>", // right (pushed forward)
  "<2,-1,-1>", // left-eq
  "<3,-1,-2>", // front-far (pushed forward)
];

export class Milty implements IDraft {
  public getDraftName(): string {
    return "Milty Draft";
  }

  public getGenerateSlicesParams(): GenerateSlicesParams {
    return {
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

  /**
   * Create the draft state with slice shapes.
   * Does not generate slices, factions, etc.
   *
   * @param namespaceId
   * @returns
   */
  public createEmptyDraftState(namespaceId: NamespaceId): DraftState {
    const draftState: DraftState = new DraftState(namespaceId);

    draftState.setSliceShape(MILTY_SLICE_SHAPE);

    if (TI4.config.playerCount === 7) {
      draftState.overrideSliceShape(3, MILTY_SLICE_SHAPE_ALT);
    } else if (TI4.config.playerCount === 8) {
      draftState.overrideSliceShape(3, MILTY_SLICE_SHAPE_ALT);
      draftState.overrideSliceShape(7, MILTY_SLICE_SHAPE_ALT);
    }

    return draftState;
  }
}
