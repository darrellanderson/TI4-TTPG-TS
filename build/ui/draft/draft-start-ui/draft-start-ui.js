"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftStartUI = void 0;
const api_1 = require("@tabletop-playground/api");
const ttpg_darrell_1 = require("ttpg-darrell");
const abtract_ui_1 = require("../../abstract-ui/abtract-ui");
const button_ui_1 = require("../../button-ui/button-ui");
const config_1 = require("../../config/config");
const draft_activity_start_1 = require("../../../lib/draft-lib/draft-activity-start/draft-activity-start");
const checkbox_ui_1 = require("../../button-ui/checkbox-ui");
const div_ui_1 = require("../../div-ui/div-ui");
const editable_ui_1 = require("../../button-ui/editable-ui");
const horizontal_ui_builder_1 = require("../../panel/horizontal-ui-builder");
const label_ui_1 = require("../../button-ui/label-ui");
const long_label_ui_1 = require("../../button-ui/long-label-ui");
const slider_with_value_ui_1 = require("../../button-ui/slider-with-value-ui");
const vertical_ui_builder_1 = require("../../panel/vertical-ui-builder");
const milty_1 = require("../../../lib/draft-lib/drafts/milty");
const wekker_1 = require("../../../lib/draft-lib/drafts/wekker");
const scpt_drafts_ui_1 = require("./scpt-drafts-ui");
const nucleus_1 = require("../../../lib/draft-lib/drafts/nucleus");
const bag_draft_1 = require("../../../lib/draft-lib/drafts/bag-draft");
class DraftStartUI extends abtract_ui_1.AbstractUI {
    constructor(scale, params) {
        const playerCount = TI4.config.playerCount;
        const onDraftStarted = new ttpg_darrell_1.TriggerableMulticastDelegate();
        const scaledWidth = (config_1.CONFIG.BUTTON_WIDTH * 2 + config_1.CONFIG.SPACING * 2) * scale;
        const label = new long_label_ui_1.LongLabelUI(scaledWidth, scale);
        label.getText().setBold(true).setText("Custom Draft".toUpperCase());
        const sliceShapeLabel = new label_ui_1.LabelUI(scale);
        sliceShapeLabel
            .getText()
            .setText("Slice shape:")
            .setJustification(api_1.TextJustification.Right);
        const iDrafts = [
            new milty_1.Milty(),
            new wekker_1.Wekker(),
            new nucleus_1.NucleusDraft(),
            new bag_draft_1.BagDraft(),
        ];
        const draftCheckBoxUIs = iDrafts.map((idraft) => {
            const checkBoxUi = new checkbox_ui_1.CheckBoxUI(scale);
            checkBoxUi
                .getCheckBox()
                .setEnabled(idraft.isEnabled())
                .setText(idraft.getDraftName())
                .setIsChecked(idraft.getDraftName() === params.draft.getDraftName());
            return checkBoxUi;
        });
        const draftCheckBoxesPanel = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs(draftCheckBoxUIs)
            .build();
        const draftPanel = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setVerticalAlignment(api_1.VerticalAlignment.Top)
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([sliceShapeLabel, draftCheckBoxesPanel])
            .build();
        const numSlicesLabel = new label_ui_1.LabelUI(scale);
        numSlicesLabel
            .getText()
            .setText("Slice count:")
            .setJustification(api_1.TextJustification.Right);
        const numSlices = new slider_with_value_ui_1.SliderWithValueUI(scale);
        numSlices.getSlider().setMinValue(playerCount);
        numSlices.getSlider().setMaxValue(9);
        numSlices.getSlider().setValue(params.numSlices);
        const numSlicesPanel = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([numSlicesLabel, numSlices])
            .build();
        const numFactionsLabel = new label_ui_1.LabelUI(scale);
        numFactionsLabel
            .getText()
            .setText("Faction count:")
            .setJustification(api_1.TextJustification.Right);
        const numFactions = new slider_with_value_ui_1.SliderWithValueUI(scale);
        numFactions.getSlider().setMinValue(playerCount);
        numFactions.getSlider().setMaxValue(9);
        numFactions.getSlider().setValue(params.numFactions);
        const numFactionsPanel = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([numFactionsLabel, numFactions])
            .build();
        const customConfigLabel = new label_ui_1.LabelUI(scale);
        customConfigLabel
            .getText()
            .setText("Custom config:")
            .setJustification(api_1.TextJustification.Right);
        const customConfig = new editable_ui_1.EditableUI(scale);
        const customConfigPanel = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .addUIs([customConfigLabel, customConfig])
            .build();
        customConfig.getEditText().setText(params.config);
        const startButton = new button_ui_1.ButtonUI(scale);
        startButton.getButton().setText("Start Draft");
        const rightUi = new vertical_ui_builder_1.VerticalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .setHorizontalAlignment(api_1.HorizontalAlignment.Center)
            .addUIs([
            label,
            draftPanel,
            numSlicesPanel,
            numFactionsPanel,
            customConfigPanel,
            startButton,
        ])
            .build();
        const overrideHeight = rightUi.getSize().h;
        const SCPT = new scpt_drafts_ui_1.ScptDraftsUi(scale, overrideHeight, onDraftStarted);
        const div = new div_ui_1.DivUI(scale, overrideHeight, "vertical");
        const ui = new horizontal_ui_builder_1.HorizontalUIBuilder()
            .setSpacing(config_1.CONFIG.SPACING * scale)
            .setVerticalAlignment(api_1.VerticalAlignment.Top)
            .addUIs([SCPT, div, rightUi])
            .build();
        super(ui.getWidget(), ui.getSize());
        this._onDraftCheckStateChangedHandler = (checkBox, player, _checked) => {
            // Regardless of checked state, use last one the player clicked.
            if (player) {
                this._draftCheckBoxes.forEach((draftCheckBox, index) => {
                    const iDraft = this._idrafts[index];
                    const useThis = draftCheckBox.getText() === checkBox.getText();
                    draftCheckBox.setIsChecked(useThis);
                    if (useThis && iDraft) {
                        // Set the current draft to the one selected by the player.
                        this._params.draft = iDraft;
                    }
                });
            }
        };
        this._onSliceCountChanged = (_slider, _player, value) => {
            this._params.numSlices = value;
        };
        this._onFactionCountChanged = (_slider, _player, value) => {
            this._params.numFactions = value;
        };
        this._onTextCommitted = (_textBox, _player, text) => {
            this._params.config = text;
        };
        this._onStartButtonClicked = new ttpg_darrell_1.ThrottleClickHandler((_button, _player) => {
            this.onDraftStarted.trigger();
            this.startDraft();
        }).get();
        this.onDraftStarted = onDraftStarted;
        this._idrafts = iDrafts;
        this._params = params;
        this._draftCheckBoxes = draftCheckBoxUIs.map((checkBoxUI) => {
            const checkBox = checkBoxUI.getCheckBox();
            checkBox.onCheckStateChanged.add(this._onDraftCheckStateChangedHandler);
            return checkBox;
        });
        numSlices.getSlider().onValueChanged.add(this._onSliceCountChanged);
        numFactions.getSlider().onValueChanged.add(this._onFactionCountChanged);
        customConfig.getEditText().onTextCommitted.add(this._onTextCommitted);
        startButton.getButton().onClicked.add(this._onStartButtonClicked);
    }
    startDraft() {
        // Bag draft requires a custom setup.
        if (this._params.draft &&
            this._params.draft.getDraftName() === "Bag Draft") {
            new bag_draft_1.BagDraft().createDraftObjects();
        }
        else {
            const errors = new Array();
            new draft_activity_start_1.DraftActivityStart().start(this._params, errors);
            if (errors.length > 0) {
                const msg = errors.join("\n");
                ttpg_darrell_1.Broadcast.chatAll("Draft start errors:\n" + msg);
            }
        }
    }
}
exports.DraftStartUI = DraftStartUI;
//# sourceMappingURL=draft-start-ui.js.map