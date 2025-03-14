import {
  Button,
  HorizontalBox,
  LayoutBox,
  Panel,
  Player,
  Text,
  TextJustification,
  VerticalAlignment,
  Widget,
} from "@tabletop-playground/api";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";
import { ConfirmButton, ThrottleClickHandler } from "ttpg-darrell";
import { IDraft } from "lib/draft-lib/drafts/idraft";
import { DraftActivityStartParams } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start";
import { DraftStartUI } from "./draft-start-ui";

export type ScptDraftParams = {
  label: string;
  draft: IDraft;
  qual?: DraftActivityStartParams;
  prelim?: DraftActivityStartParams;
  semi?: DraftActivityStartParams;
  final?: DraftActivityStartParams;
};

/**
 * "YEAR" qual / prelim / semi / final.
 *
 * SCPT draft goes right to the draft, not the "DraftStartUI" (which would be
 * used to set slice and faction count).
 */
export class ScptDraftButtonUI extends AbstractUI {
  private readonly _scptDraftParams: ScptDraftParams;

  _qualHandler = (_button: Button, _player: Player): void => {
    const draftActivityStartParams: DraftActivityStartParams | undefined =
      this._scptDraftParams.qual;
    const idraft: IDraft = this._scptDraftParams.draft;
    if (draftActivityStartParams) {
      new DraftStartUI(1, idraft, draftActivityStartParams).startDraft();
    }
  };
  _prelimHandler = (_button: Button, _player: Player): void => {
    const draftActivityStartParams: DraftActivityStartParams | undefined =
      this._scptDraftParams.prelim;
    const idraft: IDraft = this._scptDraftParams.draft;
    if (draftActivityStartParams) {
      new DraftStartUI(1, idraft, draftActivityStartParams).startDraft();
    }
  };
  _semiHandler = (_button: Button, _player: Player): void => {
    const draftActivityStartParams: DraftActivityStartParams | undefined =
      this._scptDraftParams.semi;
    const idraft: IDraft = this._scptDraftParams.draft;
    if (draftActivityStartParams) {
      new DraftStartUI(1, idraft, draftActivityStartParams).startDraft();
    }
  };
  _finalHandler = (_button: Button, _player: Player): void => {
    const draftActivityStartParams: DraftActivityStartParams | undefined =
      this._scptDraftParams.final;
    const idraft: IDraft = this._scptDraftParams.draft;
    if (draftActivityStartParams) {
      new DraftStartUI(1, idraft, draftActivityStartParams).startDraft();
    }
  };

  constructor(scale: number, scptDraftParams: ScptDraftParams) {
    const size: UI_SIZE = {
      w: (CONFIG.BUTTON_WIDTH * 2 + CONFIG.SPACING) * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };

    const fontSize: number = CONFIG.FONT_SIZE * scale;

    const label: Widget = new Text()
      .setFontSize(fontSize)
      .setJustification(TextJustification.Center)
      .setText(scptDraftParams.label);
    const labelBox: Widget = new LayoutBox()
      .setVerticalAlignment(VerticalAlignment.Center)
      .setChild(label);

    const buttonQual: Button = new Button()
      .setFontSize(fontSize)
      .setText("QUAL")
      .setEnabled(scptDraftParams.qual !== undefined);
    const buttonPrelim: Button = new Button()
      .setFontSize(fontSize)
      .setText("PRELIM")
      .setEnabled(scptDraftParams.prelim !== undefined);
    const buttonSemi: Button = new Button()
      .setFontSize(fontSize)
      .setText("SEMI")
      .setEnabled(scptDraftParams.semi !== undefined);
    const buttonFinal: Button = new Button()
      .setFontSize(fontSize)
      .setText("FINAL")
      .setEnabled(scptDraftParams.final !== undefined);

    const confirmQual: Widget = new ConfirmButton(buttonQual).getWidget();
    const confirmPrelim: Widget = new ConfirmButton(buttonPrelim).getWidget();
    const confirmSemi: Widget = new ConfirmButton(buttonSemi).getWidget();
    const confirmFinal: Widget = new ConfirmButton(buttonFinal).getWidget();

    const panel: Panel = new HorizontalBox()
      .setChildDistance(CONFIG.SPACING * scale)
      .addChild(labelBox, 1.3)
      .addChild(confirmQual, 1)
      .addChild(confirmPrelim, 1)
      .addChild(confirmSemi, 1)
      .addChild(confirmFinal, 1);
    const panelBox: Widget = new LayoutBox()
      .setOverrideWidth(size.w)
      .setOverrideHeight(size.h)
      .setChild(panel);

    super(panelBox, size);
    this._scptDraftParams = scptDraftParams;

    buttonQual.onClicked.add(
      new ThrottleClickHandler<Button>(this._qualHandler).get()
    );
    buttonPrelim.onClicked.add(
      new ThrottleClickHandler<Button>(this._prelimHandler).get()
    );
    buttonSemi.onClicked.add(
      new ThrottleClickHandler<Button>(this._semiHandler).get()
    );
    buttonFinal.onClicked.add(
      new ThrottleClickHandler<Button>(this._finalHandler).get()
    );
  }
}
