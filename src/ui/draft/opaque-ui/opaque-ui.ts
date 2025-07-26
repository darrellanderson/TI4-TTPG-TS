import { ImageWidget, Widget } from "@tabletop-playground/api";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { Faction } from "../../../lib/faction-lib/faction/faction";

export class OpaqueUI extends AbstractUI {
  constructor(opaque: string, draftState: DraftState, scale: number) {
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

    if (!widget || !size) {
      throw new Error(
        `Failed to create OpaqueUI for ${draftState.getOpaqueType()} / ${opaque}`
      );
    }
    super(widget, size);
  }
}
