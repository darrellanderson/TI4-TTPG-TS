import { HexType, NamespaceId } from "ttpg-darrell";
import { DraftState } from "../draft-state/draft-state";
import { GenerateSlicesParams } from "../generate-slices/generate-slices";
import { IDraft } from "./idraft";
import { System } from "lib/system-lib/system/system";

export const NUCLEUS_SLICE_SHAPE: ReadonlyArray<HexType> = [
  "<0,0,0>", // home system
  "<1,-1,0>", // left
  "<1,0,-1>", // front
  "<0,1,-1>", // right
];

export class NucleusDraft implements IDraft {
  public isEnabled(): boolean {
    return true;
  }

  getDraftName(): string {
    return "Nucleus Draft";
  }

  getGenerateSlicesParams(): GenerateSlicesParams {
    const generateSlicesParams: GenerateSlicesParams = {
      sliceMakeups: [
        ["high", "low", "red"],
        ["med", "med", "red"],
      ],
      sliceShape: NUCLEUS_SLICE_SHAPE,
      minAlphaWormholes: 2,
      minBetaWormholes: 2,
      minLegendary: 1,
    };
    return generateSlicesParams;
  }

  createEmptyDraftState(namespaceId: NamespaceId): DraftState {
    const draftState: DraftState = new DraftState(namespaceId);
    draftState.setSliceShape(NUCLEUS_SLICE_SHAPE);

    // Create the inner "nucleus" systems.
    const count: number = 12;
    const fillSystems: Array<string> =
      "1 1 1 1 1 1 -1 1 -1 1 -1 1 -1 1 -1 1 -1 1".split(" ");
    draftState.setBaseMap(fillSystems.join(" "));

    return draftState;
  }

  _getAvailableWormholes(): Array<number> {
    const skipContained: boolean = false;
    const wormholes: Array<number> = TI4.systemRegistry
      .getAllSystemsWithObjs(skipContained)
      .filter((system: System): boolean => {
        return (
          system.getClass() === "map" &&
          !system.isHome() &&
          !system.isExcludeFromDraft() &&
          system.getWormholes().length > 0
        );
      })
      .map((system: System): number => {
        return system.getSystemTileNumber();
      });
    return wormholes;
  }
}
