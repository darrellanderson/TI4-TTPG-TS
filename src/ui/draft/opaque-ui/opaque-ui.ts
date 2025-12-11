import { ImageWidget, Widget } from "@tabletop-playground/api";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { TfFactionRefsUI } from "../tf-faction-refs-ui/tf-faction-refs-ui";
import { DraftStateTF } from "../../../lib/draft-lib/draft-state-tf/draft-state-tf";

export class OpaqueUI extends AbstractUI {
  constructor(
    opaque: string,
    index: number,
    draftState: DraftState,
    scale: number
  ) {
    let widget: Widget | undefined;
    let size: UI_SIZE | undefined;

    if (draftState.getOpaqueType() === "minorFactions") {
      const tile: number = Number.parseInt(opaque);
      const faction: Faction | undefined =
        TI4.factionRegistry.getByHomeSystemTileNumber(tile);
      if (faction) {
        const d: number = 100 * scale;
        size = { w: d, h: d };
        widget = new ImageWidget()
          .setImage(faction.getHomeImg(), faction.getHomeImgPackageId())
          .setImageSize(size.w, size.h);
      }
    }

    if (draftState.getOpaqueType() === "tfFactionRefs") {
      if (!(draftState instanceof DraftStateTF)) {
        throw new Error(
          `Expected DraftStateTF for tfFactionRefs opaque type but saw ${draftState.constructor.name}`
        );
      }
      const draftStateTF: DraftStateTF = draftState as DraftStateTF;
      const tfFactionRefsUi: AbstractUI = new TfFactionRefsUI(
        scale,
        draftStateTF,
        index
      );
      widget = tfFactionRefsUi.getWidget();
      size = tfFactionRefsUi.getSize();
    }

    if (!widget || !size) {
      throw new Error(
        `Failed to create OpaqueUI for ${draftState.getOpaqueType()} / ${opaque}`
      );
    }
    super(widget, size);
  }
}
