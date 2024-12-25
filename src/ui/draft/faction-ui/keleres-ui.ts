import {
  Border,
  Canvas,
  ContentButton,
  HorizontalAlignment,
  LayoutBox,
  Text,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";

import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { FONT_SIZE, FactionUI } from "./faction-ui";
import {
  WRAPPED_BORDER_WIDTH,
  WrappedClickableUI,
} from "../../wrapped-clickable-ui/wrapped-clickable-ui";
import { AbstractWrappedClickableUI } from "../../wrapped-clickable-ui/abstract-wrapped-clickable-ui";

/**
 * Keleres has three flavors, based on Argent, Mentak, and Xxcha.
 *
 * Flavors are available so long as the corresponding actual faction
 * has not been selected.
 *
 * Use the "wrapped clickable ui" size because cannot have buttons
 * inside a content button.
 */
export class KeleresUI extends AbstractWrappedClickableUI {
  private readonly _contentButton: ContentButton;
  private readonly _border: Border = new Border();
  private readonly _draftState: DraftState;

  private readonly _keleresArgent: Faction =
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-argent");
  private readonly _keleresMentak: Faction =
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-mentak");
  private readonly _keleresXxcha: Faction =
    TI4.factionRegistry.getByNsidOrThrow("faction:codex.vigil/keleres-xxcha");

  private readonly _argentBorder: Border = new Border();
  private readonly _argentButton: ContentButton = new ContentButton();
  private readonly _mentakBorder: Border = new Border();
  private readonly _mentakButton: ContentButton = new ContentButton();
  private readonly _xxchaBorder: Border = new Border();
  private readonly _xxchaButton: ContentButton = new ContentButton();

  private readonly _onDraftStateChanged = (): void => {};

  destroy(): void {
    this._draftState.onDraftStateChanged.remove(this._onDraftStateChanged);
  }

  getContentButton(): ContentButton {
    return this._contentButton;
  }

  getBorder(): Border {
    return this._border;
  }

  constructor(draftState: DraftState, scale: number) {
    // Use the same size as a "regular" faction button.
    const dummyFaction: Faction = TI4.factionRegistry.getByNsidOrThrow(
      "faction:base/arborec"
    );
    const dummyFactionUi: AbstractUI = new FactionUI(dummyFaction, scale);
    const dummyWrappedUi: AbstractUI = new WrappedClickableUI(
      dummyFactionUi,
      scale
    );
    const size: UI_SIZE = dummyWrappedUi.getSize();

    const fontSize: number = FONT_SIZE * scale;
    const borderWidth: number = WRAPPED_BORDER_WIDTH * scale;

    // This one is complicated, use a canvas for more positional control.
    const canvas: Canvas = new Canvas();
    const box: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(canvas);
    super(box, size);

    this._draftState = draftState;
    this._draftState.onDraftStateChanged.add(this._onDraftStateChanged);

    // Now fill in the canvas.
    const reserveW: number = size.w * 0.4;

    // Label, skip the icon for the reduced size.
    const nameW: number = size.w - reserveW - borderWidth * 2;
    const nameH: number = size.h - borderWidth * 2;
    const name: Widget = new Text()
      .setBold(true)
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center)
      .setText("Keleres".toUpperCase());
    const nameBox: Widget = new LayoutBox()
      .setOverrideWidth(nameW)
      .setOverrideHeight(nameH)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(name);
    this._contentButton = new ContentButton().setChild(nameBox);

    const flavorLeft: number = size.w - reserveW;
    const flavorH: number = size.h / 3;
    const flavorFontSize: number = fontSize * 0.8;

    const createFlavorButton = (
      name: string,
      border: Border,
      button: ContentButton
    ): Widget => {
      const flavorLabel: Widget = new Text()
        .setFontSize(flavorFontSize)
        .setText(name.toUpperCase());
      const flavorLabelBox: Widget = new LayoutBox()
        .setOverrideWidth(reserveW)
        .setOverrideHeight(flavorH)
        .setHorizontalAlignment(HorizontalAlignment.Center)
        .setVerticalAlignment(VerticalAlignment.Center)
        .setChild(flavorLabel);
      border.setChild(flavorLabelBox);
      button.setChild(border);

      // Strip off content button edges.  LayoutBox negative padding
      // fails here, displaying on the canvas.
      const flavorBox: Widget = new Canvas().addChild(
        button,
        -4,
        -4,
        reserveW + 8,
        flavorH + 8
      );
      return flavorBox;
    };

    const argent: Widget = createFlavorButton(
      "argent",
      this._argentBorder,
      this._argentButton
    );
    canvas.addChild(argent, flavorLeft, 0, reserveW, flavorH);

    const mentak: Widget = createFlavorButton(
      "mentak",
      this._mentakBorder,
      this._mentakButton
    );
    canvas.addChild(mentak, flavorLeft, flavorH, reserveW, flavorH);

    const xxcha: Widget = createFlavorButton(
      "xxcha",
      this._xxchaBorder,
      this._xxchaButton
    );
    canvas.addChild(xxcha, flavorLeft, flavorH * 2, reserveW, flavorH);

    // Add left button last to draw on top of flavor bleed left.
    canvas.addChild(this._border, 0, 0, size.w - reserveW, size.h);
    canvas.addChild(
      this._contentButton,
      borderWidth,
      borderWidth,
      nameW,
      nameH
    );
  }
}
