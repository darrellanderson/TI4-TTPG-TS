import {
  LayoutBox,
  MultilineTextBox,
  Player,
  Widget,
} from "@tabletop-playground/api";
import { Broadcast } from "ttpg-darrell";
import { AbstractUI, UI_SIZE } from "../../abstract-ui/abtract-ui";
import { CONFIG } from "../../config/config";
import {
  DRAFT_NAMESPACE_ID,
  DraftActivityStart,
  DraftActivityStartParams,
} from "../../../lib/draft-lib/draft-activity-start/draft-activity-start";
import { HorizontalUIBuilder } from "../../panel/horizontal-ui-builder";
import { IDraft } from "../../../lib/draft-lib/drafts/idraft";
import { LabelUI } from "../../button-ui/label-ui";
import { VerticalUIBuilder } from "../../panel/vertical-ui-builder";
import { SliderWithValueUI } from "../../button-ui/slider-with-value-ui";

export class DraftStartUI extends AbstractUI {
  private readonly _idraft: IDraft;
  private readonly _params: DraftActivityStartParams = {
    namespaceId: DRAFT_NAMESPACE_ID,
    numSlices: TI4.config.playerCount,
    numFactions: TI4.config.playerCount,
    config: "",
  };

  readonly _onTextCommitted = (
    _textBox: MultilineTextBox,
    _player: Player,
    text: string
  ): void => {
    this._params.config = text;
  };

  constructor(scale: number, idraft: IDraft) {
    const playerCount: number = TI4.config.playerCount;

    const numSlicesLabel: LabelUI = new LabelUI(scale);
    numSlicesLabel.getText().setText("Slice count:");
    const numSlices: SliderWithValueUI = new SliderWithValueUI(scale);
    numSlices.getSlider().setMinValue(playerCount);
    numSlices.getSlider().setMaxValue(9);
    const numSlicesPanel: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([numSlicesLabel, numSlices])
      .build();

    const numFactionsLabel: LabelUI = new LabelUI(scale);
    numFactionsLabel.getText().setText("Faction count:");
    const numFactions: SliderWithValueUI = new SliderWithValueUI(scale);
    numFactions.getSlider().setMinValue(playerCount);
    numFactions.getSlider().setMaxValue(9);
    const numFactionsPanel: AbstractUI = new HorizontalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([numFactionsLabel, numFactions])
      .build();

    const customConfigLabel: LabelUI = new LabelUI(scale);
    customConfigLabel.getText().setText("Custom config:");
    const editText: MultilineTextBox = new MultilineTextBox()
      .setFontSize(CONFIG.FONT_SIZE * scale)
      .setMaxLength(1000);
    const textBoxSize: UI_SIZE = {
      w: CONFIG.BUTTON_WIDTH * 2 * scale + CONFIG.SPACING * scale,
      h: CONFIG.BUTTON_HEIGHT * scale,
    };
    const layoutBox: Widget = new LayoutBox()
      .setChild(editText)
      .setOverrideHeight(textBoxSize.h)
      .setOverrideWidth(textBoxSize.w);
    const textBoxUi: AbstractUI = new (class extends AbstractUI {
      constructor() {
        super(layoutBox, textBoxSize);
      }
    })();

    const ui: AbstractUI = new VerticalUIBuilder()
      .setSpacing(CONFIG.SPACING * scale)
      .addUIs([numSlicesPanel, numFactionsPanel, customConfigLabel, textBoxUi])
      .build();
    super(ui.getWidget(), ui.getSize());

    this._idraft = idraft;
    editText.onTextCommitted.add(this._onTextCommitted);
  }

  startDraft(): void {
    const errors: Array<string> = new Array<string>();
    new DraftActivityStart().start(this._idraft, this._params, errors);
    if (errors.length > 0) {
      const msg: string = errors.join("\n");
      Broadcast.chatAll("Draft start errors:\n" + msg);
    }
  }
}
