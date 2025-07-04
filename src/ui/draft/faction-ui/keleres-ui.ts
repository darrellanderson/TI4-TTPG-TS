import {
  Border,
  Canvas,
  Color,
  ContentButton,
  HorizontalAlignment,
  LayoutBox,
  Player,
  Text,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { ThrottleClickHandler } from "ttpg-darrell";

import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { DraftState } from "../../../lib/draft-lib/draft-state/draft-state";
import { Faction } from "../../../lib/faction-lib/faction/faction";
import { FONT_SIZE, FactionUI } from "./faction-ui";
import {
  WRAPPED_BORDER_WIDTH,
  WrappedClickableUI,
} from "../../wrapped-clickable-ui/wrapped-clickable-ui";
import { AbstractWrappedClickableUI } from "../../wrapped-clickable-ui/abstract-wrapped-clickable-ui";
import { ResolveConflictsKeleres } from "../../../lib/draft-lib/resolve-conflicts/resolve-conflicts-keleres";

type KeleresFlavor = "argent" | "mentak" | "xxcha";

/**
 * Export for testing, not normally used externally.
 */
export class KeleresFlavorButton {
  private readonly _draftState: DraftState;
  private readonly _faction: Faction;
  private readonly _fg: Text;
  private readonly _bg: Border;
  private readonly _button: ContentButton;
  public readonly _widget: Widget;

  /**
   * Switch the keleres faction to this flavor.
   *
   * @param _contentButton
   * @param _player
   */
  public _onClicked = new ThrottleClickHandler<ContentButton>(
    (_contentButton: ContentButton, _player: Player): void => {
      const keleresIndex: number = KeleresFlavorButton._getKeleresIndex(
        this._draftState
      );
      const factions: Array<Faction> = this._draftState.getFactions();
      if (keleresIndex >= 0 && factions[keleresIndex] !== this._faction) {
        factions[keleresIndex] = this._faction;
        this._draftState.setFactions(factions);
      }
    }
  ).get();

  static _getKeleresIndex(draftState: DraftState): number {
    return draftState.getFactions().findIndex((faction) => {
      return faction.getNsid().startsWith("faction:codex.vigil/keleres");
    });
  }

  constructor(
    draftState: DraftState,
    flavor: KeleresFlavor,
    w: number,
    h: number
  ) {
    this._draftState = draftState;

    this._faction = TI4.factionRegistry.getByNsidOrThrow(
      `faction:codex.vigil/keleres-${flavor}`
    );

    const fontSize: number = h * 0.5;

    this._fg = new Text()
      .setBold(true)
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center)
      .setText(flavor.toUpperCase());
    const fgBox: Widget = new LayoutBox()
      .setOverrideWidth(w)
      .setOverrideHeight(h)
      .setHorizontalAlignment(HorizontalAlignment.Center)
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(this._fg);
    this._bg = new Border().setChild(fgBox);

    // Create a ContentButton with the flavor text.
    // Strip off ContentButton added edges; cannot use LayoutBox negative
    // padding because it will be in another Canvas and bleed, but wrap
    // in a second Canvas to enforce the size/trim.
    this._button = new ContentButton().setChild(this._bg);
    this._widget = new Canvas().addChild(this._button, -4, -4, w + 8, h + 8);

    this._button.onClicked.add(this._onClicked);
  }

  /**
   * Update the button color to reflect if this is the active flavor.
   * This only updates the local widget attributes, never touches
   * the draft state (to avoid infinite update loops).
   */
  update(): void {
    const keleresIndex: number = KeleresFlavorButton._getKeleresIndex(
      this._draftState
    );
    const activeFaction: Faction | undefined =
      this._draftState.getFactions()[keleresIndex];
    if (activeFaction) {
      const isActive: boolean = this._faction === activeFaction;
      const colorActive: Color = new Color(0, 0, 0, 1);
      const colorPassive: Color = new Color(1, 1, 1, 1);
      const fg: Color = isActive ? colorActive : colorPassive;
      const bg: Color = isActive ? colorPassive : colorActive;
      this._fg.setTextColor(fg);
      this._bg.setColor(bg);
    }

    // Enable if an available flavor.
    const availableFlavors: ReadonlyArray<Faction> =
      ResolveConflictsKeleres.getAvailableFlavors(this._draftState);
    const isEnabled: boolean = availableFlavors.includes(this._faction);
    this._button.setEnabled(isEnabled);
  }
}

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

  private readonly _flavorButtons: Array<KeleresFlavorButton> = [];

  private readonly _onDraftStateChanged = (): void => {
    // Update the flavor buttons.
    this._flavorButtons.forEach((flavorButton) => flavorButton.update());
  };

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
    const reserveW: number = size.w * 0.45;

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

    const argent: KeleresFlavorButton = new KeleresFlavorButton(
      draftState,
      "argent",
      reserveW,
      flavorH
    );
    const mentak: KeleresFlavorButton = new KeleresFlavorButton(
      draftState,
      "mentak",
      reserveW,
      flavorH
    );
    const xxcha: KeleresFlavorButton = new KeleresFlavorButton(
      draftState,
      "xxcha",
      reserveW,
      flavorH
    );

    this._flavorButtons.push(argent, mentak, xxcha);
    this._flavorButtons.forEach((flavorButton) => {
      flavorButton.update();
    });

    canvas.addChild(argent._widget, flavorLeft, 0, reserveW, flavorH);
    canvas.addChild(mentak._widget, flavorLeft, flavorH, reserveW, flavorH);
    canvas.addChild(xxcha._widget, flavorLeft, flavorH * 2, reserveW, flavorH);

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
