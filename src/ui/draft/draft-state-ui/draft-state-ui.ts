import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { SliceShape } from "../../../lib/draft-lib/generate-slices/generate-slices";
import { SliceUI } from "../slice-ui/slice-ui";
import { WrappedClickableUI } from "../../wrapped-clickable-ui/wrapped-clickable-ui";
import { GridUIBuilder } from "ui/panel/grid-ui-builder";
import { HorizontalUIBuilder } from "ui/panel/horizontal-ui-builder";
import { FactionUI } from "../faction-ui/faction-ui";
import { SeatUI } from "../seat-ui/seat-ui";

const SPACING: number = 4;

export class DraftStateUI extends AbstractUI {
  constructor(draftState: DraftState, scale: number) {
    const sliceShape: SliceShape = draftState.getSliceShape();
    const sliceButtons: Array<WrappedClickableUI> = draftState
      .getSlices()
      .map((slice) => {
        const sliceUi: AbstractUI = new SliceUI(slice, sliceShape, scale);
        const clickable = new WrappedClickableUI(sliceUi, scale);

        clickable.

        return clickable;
      });
    const sliceGrid: AbstractUI = new GridUIBuilder()
      .addUIs(sliceButtons)
      .setMaxRows(3)
      .setSpacing(SPACING * scale)
      .build();

    const factionButtons: Array<WrappedClickableUI> = draftState
      .getFactions()
      .map((faction) => {
        const factionUi: AbstractUI = new FactionUI(faction, scale);
        const clickable = new WrappedClickableUI(factionUi, scale);
        return clickable;
      });
    const factionGrid: AbstractUI = new GridUIBuilder()
      .addUIs(factionButtons)
      .setMaxRows(6)
      .setSpacing(SPACING * scale)
      .build();

    const speakerSeatIndex: number = draftState.getSpeakerIndex();
    const seatButtons: Array<WrappedClickableUI> = [];
    for (let i = 0; i < TI4.config.playerCount; i++) {
      const seatUi: AbstractUI = new SeatUI(i, speakerSeatIndex, scale);
      const clickable = new WrappedClickableUI(seatUi, scale);
      seatButtons.push(clickable);
    }

    const panel: AbstractUI = new HorizontalUIBuilder()
      .addUIs([sliceGrid, factionGrid])
      .setPadding(SPACING * scale)
      .setSpacing(SPACING * scale)
      .build();

    super(panel.getWidget(), panel.getSize());
  }
}
