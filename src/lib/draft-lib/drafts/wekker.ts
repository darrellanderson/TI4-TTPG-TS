import { NamespaceId, WeightedChoice } from "ttpg-darrell";

import { DraftState } from "../draft-state/draft-state";
import {
  GenerateSlicesParams,
  SliceShape,
} from "../generate-slices/generate-slices";
import { IDraft } from "./idraft";
import { MILTY_SLICE_MAKEUP } from "./milty";

export const WEKKER_SLICE_SHAPE: SliceShape = [
  "<0,0,0>", //home
  "<0,2,-2>", // right-right [0]
  "<0,1,-1>", // right [1]
  "<1,0,-1>", // front [2]
  "<2,-1,-1>", // left-eq [3]
  "<3,-1,-2>", // left-far [4]
];

export const WEKKER_SLICE_SHAPE_R: SliceShape = [
  "<0,0,0>", //home
  "<0,2,-2>", // right-right
  "<0,1,-1>", // right
  "<1,0,-1>", // front
  "<3,-3,0>",
  "<4,-1,-3>",
];

export const WEKKER_SLICE_SHAPE_L: SliceShape = [
  "<0,0,0>", //home
  "<2,3,-5>",
  "<0,1,-1>", // right
  "<1,0,-1>", // front
  "<2,-1,-1>", // left-eq
  "<3,-1,-2>", // left-far
];

export class Wekker implements IDraft {
  public isEnabled(): boolean {
    return true;
  }

  public getDraftName(): string {
    return "Wekker Draft";
  }

  public getGenerateSlicesParams(): GenerateSlicesParams {
    return {
      sliceMakeups: [MILTY_SLICE_MAKEUP],
      sliceShape: WEKKER_SLICE_SHAPE,
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

    draftState.setSliceShape(WEKKER_SLICE_SHAPE);

    if (TI4.config.playerCount === 7) {
      draftState.overrideSliceShape(0, WEKKER_SLICE_SHAPE_R);
      draftState.overrideSliceShape(1, WEKKER_SLICE_SHAPE_L);
    } else if (TI4.config.playerCount === 8) {
      draftState.overrideSliceShape(0, WEKKER_SLICE_SHAPE_R);
      draftState.overrideSliceShape(1, WEKKER_SLICE_SHAPE_L);
      draftState.overrideSliceShape(2, WEKKER_SLICE_SHAPE_R);
      draftState.overrideSliceShape(3, WEKKER_SLICE_SHAPE_L);
    }

    return draftState;
  }
}
