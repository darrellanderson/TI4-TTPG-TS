import {
  SliceShape,
  SliceTiles,
} from "lib/draft-lib/generate-slices/generate-slices";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { SliceUI } from "../slice-ui/slice-ui";
import { Color } from "@tabletop-playground/api";

export class OpaqueUI extends AbstractUI {
  constructor(opaque: string, draftState: DraftState, scale: number) {
    let ui: AbstractUI;

    if (draftState.getOpaqueType() === "minorFactions") {
      const tile: number = Number.parseInt(opaque);
      const slice: SliceTiles = [tile];
      const sliceShape: SliceShape = ["<0,0,0>", "<1,-1,0>"];
      const sliceColor: Color = new Color(1, 1, 1, 1);
      const sliceUi: SliceUI = new SliceUI(
        slice,
        sliceShape,
        sliceColor,
        scale
      );
      sliceUi.setLabel(opaque);
      ui = sliceUi;
    } else {
      throw new Error(`Unknown opaque type: ${draftState.getOpaqueType()}`);
    }

    const size: UI_SIZE = ui.getSize();
    super(ui.getWidget(), size);
  }
}
