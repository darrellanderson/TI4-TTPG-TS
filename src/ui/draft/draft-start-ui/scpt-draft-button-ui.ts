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
import {
  ConfirmButton,
  ThrottleClickHandler,
  TriggerableMulticastDelegate,
} from "ttpg-darrell";
import { DraftActivityStartParams } from "../../../lib/draft-lib/draft-activity-start/draft-activity-start-params";
import { ScptDraftParams } from "../../../lib/draft-lib/scpt/abstract-scpt/scpt-draft-params";

/**
 * "YEAR" qual / prelim / semi / final.
 *
 * SCPT draft goes right to the draft.
 */
export class ScptDraftButtonUI extends AbstractUI {
  private readonly _scptDraftParams: ScptDraftParams;
  private readonly _onDraftStarted: TriggerableMulticastDelegate<() => void>;

  _qualHandler = (_button: Button, _player: Player): void => {
    const draftActivityStartParams: DraftActivityStartParams | undefined =
      this._scptDraftParams.qual;
    if (draftActivityStartParams) {
      this._onDraftStarted.trigger();
      TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
    }
  };
  _prelimHandler = (_button: Button, _player: Player): void => {
    const draftActivityStartParams: DraftActivityStartParams | undefined =
      this._scptDraftParams.prelim;
    if (draftActivityStartParams) {
      this._onDraftStarted.trigger();
      TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
    }
  };
  _semiHandler = (_button: Button, _player: Player): void => {
    const draftActivityStartParams: DraftActivityStartParams | undefined =
      this._scptDraftParams.semi;
    if (draftActivityStartParams) {
      this._onDraftStarted.trigger();
      TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
    }
  };
  _finalHandler = (_button: Button, _player: Player): void => {
    const draftActivityStartParams: DraftActivityStartParams | undefined =
      this._scptDraftParams.final;
    if (draftActivityStartParams) {
      this._onDraftStarted.trigger();
      TI4.events.onSliceDraftRequest.trigger(draftActivityStartParams);
    }
  };

  constructor(
    scale: number,
    scptDraftParams: ScptDraftParams,
    onDraftStarted: TriggerableMulticastDelegate<() => void>
  ) {
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
    this._onDraftStarted = onDraftStarted;

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
