import {
  Canvas,
  HorizontalAlignment,
  HorizontalBox,
  ImageWidget,
  LayoutBox,
  Text,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";

import { AbstractUI } from "../../abstract-ui/abtract-ui";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { BOX_W, BOX_H, FONT_SIZE, SPACING } from "./faction-ui";

/**
 * Keleres has three flavors, based on Argent, Mentak, and Xxcha.
 *
 * Flavors are available so long as the corresponding actual faction
 * has not been selected.
 *
 * Use the "wrapped clickable ui" size because cannot have buttons
 * inside a content button.
 */
export class KeleresUI extends AbstractUI {
  private readonly _draftState: DraftState;

  private readonly _keleresArgent: Faction =
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-argent");
  private readonly _keleresMentak: Faction =
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-mentak");
  private readonly _keleresXxcha: Faction =
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-xxcha");

  private readonly _onDraftStateChanged = (): void => {};

  destroy(): void {
    this._draftState.onDraftStateChanged.remove(this._onDraftStateChanged);
  }

  constructor(draftState: DraftState, scale: number) {
    const w: number = BOX_W * scale;
    const h: number = BOX_H * scale;
    const fontSize = FONT_SIZE * scale;
    const spacing = SPACING * scale;

    // TODO use clickable button size.

    // This one is complicated, use a canvas for more positional control.
    const canvas: Canvas = new Canvas();
    const box: Widget = new LayoutBox()
      .setOverrideWidth(w)
      .setOverrideHeight(h)
      .setChild(canvas);
    super(box, { w, h });

    this._draftState = draftState;
    this._draftState.onDraftStateChanged.add(this._onDraftStateChanged);

    // Now fill in the canvas.

    const s: number = h - spacing * 2;
    const icon: Widget = new ImageWidget()
      .setImageSize(s, s)
      .setImage(
        this._keleresArgent.getIcon(),
        this._keleresArgent.getIconPackageId()
      );

    const name: Widget = new Text()
      .setBold(true)
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center)
      .setText("Keleres".toUpperCase());

    const panel: Widget = new HorizontalBox()
      .setChildDistance(spacing)
      .addChild(icon)
      .addChild(name);
    const panelBox: LayoutBox = new LayoutBox()
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(panel);

    canvas.addChild(panelBox, 0, 0, w, h);
  }
}
